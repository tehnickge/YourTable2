import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
import { handleValidationError } from "../APIHelpers";
import { IRentCreateSchema } from "@/types/rent";

// схема валидации данных
const rentSchema: Yup.Schema<IRentCreateSchema> = Yup.object().shape({
  timeStart: Yup.date().required(),
  timeEnd: Yup.date().required(),
  userId: Yup.number().required(),
  restaurantId: Yup.number().required(),
  amountPeople: Yup.number().required(),
  slotId: Yup.number().required(),
});
// существует ли такой юзер
const userExist = async (id: number): Promise<boolean> => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user) return true;
  return false;
};
// получить рассписание на текущий день
const getSheduleToDate = async (restaurantId: number, dayId: number) => {
  const shedule = await prisma.workShedule.findFirst({
    where: {
      restaurant_fk: restaurantId,
      day_fk: dayId,
    },
  });
  return shedule;
};
// существует ли такой ресторан и слот в нем
const slotAndRestaurantExist = async (
  restaurantId: number,
  slotId: number
): Promise<boolean> => {
  const rest = await prisma.restaurant.findFirst({
    where: { id: restaurantId },
    include: {
      zones: {
        include: {
          slots: {
            where: {
              id: slotId,
            },
          },
        },
      },
    },
  });

  return rest?.zones.some((zone) => zone.slots.length > 0) || false;
};
// проверка вместит ли стол такое количество людей
const checkMaxPeopleInSlot = async (
  countPeople: number,
  slotId: number
): Promise<boolean> => {
  const slot = await prisma.slot.findFirst({ where: { id: slotId } });
  if (!slot) return false;
  return slot?.maxCountPeople >= countPeople ? true : false;
};

// проверка существуют ли уже ренты в этом временном интервале
const checkRentExist = async (
  currenTimeStart: DateTime,
  currentTimeEnd: DateTime,
  slotId: number
): Promise<boolean> => {
  const rents = await prisma.rent.findMany({
    where: {
      AND: [
        { slot_fk: slotId },
        { timeStart: { lte: currentTimeEnd.toJSDate() } }, // Существующая аренда начинается до конца текущего интервала
        { timeEnd: { gte: currenTimeStart.toJSDate() } }, // Существующая аренда заканчивается после начала текущего интервала
      ],
    },
  });

  return rents.length > 0 ? true : false;
};
// получение маскимального время ренты
const getMaxHoursToRent = async (restaurantId: number): Promise<number> => {
  const rest = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
    },
    select: {
      maxHoursToRent: true,
    },
  });

  return Number(rest?.maxHoursToRent) ?? 0;
};

export const createRent = async (req: NextRequest) => {
  try {
    const token =
      req.cookies.get("jwt_token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      //   return NextResponse.redirect(new URL("api/login", req.url));
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }
    // вытаскиваем и проверяем jwt
    const { id, username, email, type } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;
    // получение данных из тела запроса
    const body: IRentCreateSchema = await req.json();
    // валидируем полученные данные
    const validRent = await rentSchema.validate(body);

    // проверка на соподанеии id юзера отпр. запрос с id в jwt и типом юзера
    if (validRent.userId !== id && type !== "admin") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS + " not enough rights" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // проверяем существует ли юзер
    if (!(await userExist(validRent.userId))) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // проверка есть ли такой ресторан и в нем такой стол
    if (
      !(await slotAndRestaurantExist(validRent.restaurantId, validRent.slotId))
    ) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // проверка на количество людей помещаймых в 1 слот
    if (
      !(await checkMaxPeopleInSlot(validRent.amountPeople, validRent.slotId))
    ) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    const timeStart = DateTime.fromJSDate(validRent.timeStart);
    const timeEnd = DateTime.fromJSDate(validRent.timeEnd);
    const timeNow = DateTime.now();
    const maxHoursToRent = await getMaxHoursToRent(validRent.restaurantId);
    const shedule = await getSheduleToDate(
      validRent.restaurantId,
      timeStart.weekday
    );

    //проверка на наличие рассписание на этот день
    if (!shedule) {
      return NextResponse.json(
        {
          error:
            ERROR_MESSAGES.BAD_ARGUMENTS +
            " Shedule not exist this day" +
            ` ${timeStart.weekdayLong}`,
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // проверка на максимальное допустимое время ренты
    if (
      Interval.fromDateTimes(timeStart, timeEnd).length("hours") >
      maxHoursToRent
    ) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + " maximum rent time exceeded",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // проверка на разницу во времени
    if (timeStart >= timeEnd) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS + " Time begin <= time end" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // проверка на ренту в прошлое
    if (timeNow >= timeStart) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS + " Time now > time Start" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // проверка интервала времени
    const interval = Interval.fromDateTimes(
      DateTime.fromJSDate(validRent.timeStart),
      DateTime.fromJSDate(validRent.timeEnd)
    );
    if (!interval.isValid)
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS + " Time begin < time end" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );

    // проверка свободно ли время для ренты
    if (await checkRentExist(timeStart, timeEnd, validRent.slotId)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS + " time not free" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const newRent = await prisma.rent.create({
      data: {
        timeStart: timeStart.toJSDate(),
        timeEnd: timeEnd.toJSDate(),
        user: { connect: { id: validRent.userId } },
        rentStatus: "in work",
        restaurant: { connect: { id: validRent.restaurantId } },
        amountPeople: validRent.amountPeople,
        slot: { connect: { id: validRent.slotId } },
        createdAt: DateTime.now().toJSDate(),
      },
    });
    return NextResponse.json(newRent, { status: HTTP_STATUS.OK });
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
