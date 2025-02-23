import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { IUserPayload } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { IReviewCreateSchema } from "@/types/review";
import { handleValidationError } from "../APIHelpers";


const reviewSchema: Yup.Schema<IReviewCreateSchema> = Yup.object().shape({
  restaurantId: Yup.number().required(),
  userId: Yup.number().required(),
  comment: Yup.string().optional(),
  rating: Yup.number().required(),
});

const restaurantExist = async (resaurantId: number): Promise<boolean> => {
  const rest = await prisma.restaurant.findFirst({
    where: {
      id: resaurantId,
    },
  });

  return rest ? true : false;
};

const reviewExist = async (
  resaurantId: number,
  userId: number
): Promise<boolean> => {
  const review = await prisma.review.findFirst({
    where: {
      restaurant_fk: resaurantId,
      user_fk: userId,
    },
  });

  return review ? true : false;
};
export const createReview = async (req: NextRequest) => {
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

    // получаем данные из тела запроса
    const body: IReviewCreateSchema = await req.json();
    // валидируем полученные данные
    const validReview = await reviewSchema.validate(body);
    // проверка на роль пользователя и соовтветсвие
    if (id !== validReview.userId) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + " not your user id",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // прверяем есть ли такой ресторан
    if (!(await restaurantExist(validReview.restaurantId))) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + "restaurant not exist",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    if (await reviewExist(validReview.restaurantId, validReview.userId)) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + "review already exist",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        rating: validReview.rating,
        comment: validReview.comment,
        restaurant: { connect: { id: validReview.restaurantId } },
        user: { connect: { id: validReview.userId } },
      },
    });

    return NextResponse.json(newReview, { status: HTTP_STATUS.OK });
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
