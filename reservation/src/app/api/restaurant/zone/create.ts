import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { handleValidationError } from "../../APIHelpers";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
import { IZoneCreateSchema } from "@/types/zone";
const zoneSchema: Yup.Schema<IZoneCreateSchema> = Yup.object().shape({
  title: Yup.string().optional(),
  description: Yup.string().optional(),
  color: Yup.string().optional(),
  restaurantId: Yup.number().required(),
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

export const createZone = async (req: NextRequest) => {
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
    const body: IZoneCreateSchema = await req.json();
    // валидируем полученные данные
    const validZone = await zoneSchema.validate(body);
    // проверяем существует ли такой ресторан
    if (!(await restaurantExist(validZone.restaurantId))) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // создаем новую зону и привязываем ее к ресторану
    const newZone = await prisma.zone.create({
      data: {
        title: validZone.title,
        description: validZone.description,
        color: validZone.color,
        restaurant: { connect: { id: validZone.restaurantId } },
      },
    });

    return NextResponse.json(newZone, { status: HTTP_STATUS.OK });
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
