import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { handleValidationError } from "../../APIHelpers";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
import { IWorkSheduleCreateSchema } from "@/types/workShedule";
const sheduleSchema: Yup.Schema<IWorkSheduleCreateSchema> = Yup.object().shape({
  timeBegin: Yup.date().required(),
  timeEnd: Yup.date().required(),
  restaurantId: Yup.number().required(),
  dayId: Yup.number().required().min(1).max(7),
});

const restaurantExist = async (id: number): Promise<boolean> => {
  const rest = await prisma.restaurant.findFirst({
    where: {
      id,
    },
  });

  if (rest) return true;
  return false;
};
// существует ли такое рассписание у этого ресторана на этот день
const sheduleExist = async (restaurantId: number, dayNumber: number) => {
  const shedule = await prisma.workShedule.findFirst({
    where: {
      restaurant_fk: restaurantId,
      day_fk: dayNumber,
    },
  });
  if (shedule) return true;
  return false;
};
export const createShedule = async (req: NextRequest) => {
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
    // проверка на роль пользователя
    if (type !== "admin") {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }
    // получение данных из тела запроса
    const body: IWorkSheduleCreateSchema = await req.json();
    // валидируем полученные данные
    const validShedule = await sheduleSchema.validate(body);
    // проверяем существует ли такой ресторан
    if (!(await restaurantExist(validShedule.restaurantId))) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // проверяем существует ли уже такое рассписание
    if (await sheduleExist(validShedule.restaurantId, validShedule.dayId))
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );

    const interval = Interval.fromDateTimes(
      DateTime.fromJSDate(validShedule.timeBegin),
      DateTime.fromJSDate(validShedule.timeEnd)
    );

    if (!interval.isValid)
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS + " Time begin <= time end" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    // создаем новое рассписание привязывая к конкретному ресторану и дню
    const newShedule = await prisma.workShedule.create({
      data: {
        timeBegin: validShedule.timeBegin,
        timeEnd: validShedule.timeEnd,
        restaurant: { connect: { id: validShedule.restaurantId } },
        day: { connect: { id: validShedule.dayId } },
      },
    });

    return NextResponse.json(newShedule, { status: HTTP_STATUS.OK });
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
