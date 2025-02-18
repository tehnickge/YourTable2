import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { IUserPayload } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { handleValidationError } from "../../APIHelpers";
import { IAppendKitchenToRestaurantCreateSchema } from "@/types/kitchenRestaurant";
import { connect } from "http2";

const kitchenToRestaurantSchema: Yup.Schema<IAppendKitchenToRestaurantCreateSchema> =
  Yup.object().shape({
    restaurantId: Yup.number().required(),
    kitchenId: Yup.number().required(),
  });

const checkRestaurantExist = async (restaurantId: number): Promise<boolean> => {
  const restaurant = await prisma.restaurant.findFirst({
    where: { id: restaurantId },
  });

  return restaurant ? true : false;
};

const checkKitchenExist = async (kitchenId: number): Promise<boolean> => {
  const restaurant = await prisma.kitchen.findFirst({
    where: { id: kitchenId },
  });

  return restaurant ? true : false;
};

const checkKitchenExistInRestaurant = async (
  restaurantId: number,
  kitchenId: number
): Promise<boolean> => {
  const kitchenToRestaurant = await prisma.restaurantKitchen.findFirst({
    where: {
      restaurant_fk: restaurantId,
      kitchen_fk: kitchenId,
    },
  });

  return kitchenToRestaurant ? true : false;
};

export const appendKitchenToRestaurant = async (req: NextRequest) => {
  try {
    const token =
      req.cookies.get("jwt_token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      //   return NextResponse.redirect(new URL("api/login", req.url));
      return NextResponse.json(ERROR_MESSAGES.BAD_AUTHORIZED, {
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
        ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }
    // получаем данные из тела запроса
    const body: IAppendKitchenToRestaurantCreateSchema = await req.json();
    // валидируем полученные данные
    const validKitchenToRestaurant = await kitchenToRestaurantSchema.validate(
      body
    );

    // прверяем существует ли такой ресторан
    if (!(await checkRestaurantExist(validKitchenToRestaurant.restaurantId))) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + " restaurant not found",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // проверяем существует ли такая кухня
    if (!(await checkKitchenExist(validKitchenToRestaurant.kitchenId))) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + " kitchen not found",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (
      await checkKitchenExistInRestaurant(
        validKitchenToRestaurant.restaurantId,
        validKitchenToRestaurant.kitchenId
      )
    ) {
      return NextResponse.json(
        {
          error:
            ERROR_MESSAGES.BAD_ARGUMENTS +
            " kitchen already exist in this restaurant",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const newKitchenToRestaurant = await prisma.restaurantKitchen.create({
      data: {
        restaurant: { connect: { id: validKitchenToRestaurant.restaurantId } },
        kitchen: { connect: { id: validKitchenToRestaurant.kitchenId } },
      },
    });

    return NextResponse.json(newKitchenToRestaurant, {
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
