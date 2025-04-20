import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { DateTime, Interval } from "luxon";
import { handleValidationError } from "@/app/api/APIHelpers";

const slotSchema: Yup.Schema<{ slotId: number; date: string }> =
  Yup.object().shape({
    slotId: Yup.number().required(),
    date: Yup.string().required(),
  });

export const getTime = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { slotId, date: dateToRent } = await slotSchema.validate(body, {
      abortEarly: false,
    });

    const dateToRentParse = DateTime.fromISO(dateToRent, { locale: "ru" });

    if (!dateToRentParse.isValid) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const slotWithRestaurant = await prisma.slot.findFirst({
      where: { id: slotId },
      include: {
        zone: {
          include: {
            restaurant: {
              include: {
                workShedules: {
                  include: { day: true },
                },
              },
            },
          },
        },
      },
    });

    if (!slotWithRestaurant) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const curentDay = dateToRentParse.toFormat("cccc");
    const workShedule = slotWithRestaurant.zone.restaurant.workShedules.find(
      (ws) => curentDay === ws.day.title
    );

    if (!workShedule) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const workStart = DateTime.fromJSDate(workShedule.timeBegin);
    const workEnd = DateTime.fromJSDate(workShedule.timeEnd);

    const rentsInCurrentDay = await prisma.rent.findMany({
      where: {
        slot_fk: slotId,
        timeStart: {
          gte: dateToRentParse.startOf("day").toJSDate(),
          lt: dateToRentParse.endOf("day").toJSDate(),
        },
      },
      orderBy: { timeStart: "asc" },
    });

    // Генерация всех возможных часовых слотов
    const allSlots: DateTime[] = [];
    let currentSlot = workStart.startOf("hour");
    while (currentSlot < workEnd) {
      allSlots.push(currentSlot);
      currentSlot = currentSlot.plus({ hours: 1 });
    }

    // Создаем интервалы занятого времени
    const busyIntervals = rentsInCurrentDay
      .map((rent) => {
        const start = DateTime.fromJSDate(rent.timeStart);
        const end = DateTime.fromJSDate(rent.timeEnd);
        return Interval.fromDateTimes(start, end);
      })
      .filter((interval) => interval.isValid); // Фильтруем только валидные интервалы

    // Фильтрация доступных слотов
    const availableSlots = allSlots.filter((slot) => {
      const slotStart = slot;
      const slotEnd = slot.plus({ hours: 1 });

      const slotStartTime = {
        hour: slotStart.hour,
        minute: slotStart.minute,
      };
      const slotEndTime = {
        hour: slotEnd.hour,
        minute: slotEnd.minute,
      };

      return !busyIntervals.some(({ start, end }) => {
        const busyStartTime = {
          hour: start.hour,
          minute: start.minute,
        };
        const busyEndTime = {
          hour: end.hour,
          minute: end.minute,
        };

        // Проверка пересечения временных интервалов по часам/минутам
        const slotStartsBeforeBusyEnds =
          slotStartTime.hour < busyEndTime.hour ||
          (slotStartTime.hour === busyEndTime.hour &&
            slotStartTime.minute < busyEndTime.minute);

        const slotEndsAfterBusyStarts =
          slotEndTime.hour > busyStartTime.hour ||
          (slotEndTime.hour === busyStartTime.hour &&
            slotEndTime.minute > busyStartTime.minute);

        return slotStartsBeforeBusyEnds && slotEndsAfterBusyStarts;
      });
    });

    // Форматирование результата
    const formattedAvailableTime = availableSlots.map((slot) =>
      slot.toFormat("HH:00")
    );

    return NextResponse.json(formattedAvailableTime, {
      status: HTTP_STATUS.OK,
    });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return handleValidationError(error);
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

export { getTime as POST };
