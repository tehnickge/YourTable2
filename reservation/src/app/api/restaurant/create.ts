import { NextRequest, NextResponse } from "next/server";
import { handleValidationError } from "../APIHelpers";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { IRestaurantCreateSchema } from "@/types/restaurant";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
const restaurantSchema: Yup.Schema<IRestaurantCreateSchema> =
  Yup.object().shape({
    info: Yup.string().optional(),
    title: Yup.string().required(),
    shortInfo: Yup.string().optional(),
    uniqueKey: Yup.string().optional(),
  });

const generateSecretKey = async (length = 32): Promise<string> => {
  const key = randomBytes(length).toString("hex");
  const rest = await prisma.restaurant.findFirst({
    where: {
      uniqueKey: key,
    },
  });
  if (rest) {
    generateSecretKey();
  }

  return key;
};

export const createRestaurant = async (req: NextRequest) => {
  try {
    const token =
      req.cookies.get("jwt_token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      //   return NextResponse.redirect(new URL("api/login", req.url));
      return NextResponse.json({error: ERROR_MESSAGES.BAD_AUTHORIZED}, {
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    // вытаскиваем и проверяем jwt
    const { id, username, email, type } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;
    // проверка на роль пользователя
    if (type !== "admin") {
      return NextResponse.json(
        {error: ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights"},
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }
    // получение данных из тела запроса
    const body: IRestaurantCreateSchema = await req.json();
    // валидация полученных данных
    const restValid = await restaurantSchema.validate(body, {
      abortEarly: false,
    });
    // генерация уникального ключа
    restValid.uniqueKey = await generateSecretKey();
    // создание ресторана
    const createRest = await prisma.restaurant.create({
      data: {
        info: restValid.info || "",
        title: restValid.title,
        shortInfo: restValid.shortInfo || "",
        uniqueKey: restValid.uniqueKey,
      },
    });

    return NextResponse.json(createRest, { status: 200 });
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
