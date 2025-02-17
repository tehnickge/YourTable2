import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { handleValidationError } from "../../APIHelpers";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
import { ISlotCreateSchema } from "@/types/slot";
const slotSchema: Yup.Schema<ISlotCreateSchema> = Yup.object().shape({
  number: Yup.string().required(),
  description: Yup.string().optional(),
  maxCountPeople: Yup.number().required().min(1).max(200),
  zoneId: Yup.number().required(),
});

const zoneExist = async (id: number): Promise<boolean> => {
  const rest = await prisma.zone.findFirst({
    where: {
      id,
    },
  });

  if (rest) return true;
  return false;
};

export const createSlot = async (req: NextRequest) => {
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
    const body: ISlotCreateSchema = await req.json();
    // валидируем полученные данные
    const validSlot = await slotSchema.validate(body);
    // проверяем существует ли такая зона
    if (!(await zoneExist(validSlot.zoneId))) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // создаем новый слот и привязываем его к зоне
    const newSlot = await prisma.slot.create({
      data: {
        number: validSlot.number,
        description: validSlot.description,
        maxCountPeople: validSlot.maxCountPeople,
        zone: { connect: { id: validSlot.zoneId } },
      },
    });

    return NextResponse.json(newSlot, { status: HTTP_STATUS.OK });
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
