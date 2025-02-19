import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { IUserPayload } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { IReviewCreateSchema } from "@/types/review";

const reviewSchema: Yup.Schema<IReviewCreateSchema> =
  Yup.object().shape({
    restaurantId: Yup.number().required(),
    userId: Yup.number().required(),
    comment: Yup.string().optional(),
    rating: Yup.number().required(),
  });

const restaurantExist = async() => {}
export const createChain = async (req: NextRequest) => {
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
    const body: IRestaurantCreateChainSchema = await req.json();
    // валидируем полученные данные
    const validChain = await restaurantChainSchema.validate(body);
    // получение компании
    const company = await getCompany(validChain.companyTitle);
    // проверка на существование компании
    if (!company) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + " Company title not exist",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // прверяем есть ли уже такая сеть ресторанов
    if (await checkChainExist(validChain.title)) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + " Chain title already exist",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const newChain = await prisma.restaurantChain.create({
      data: {
        title: validChain.title,
        company: {
          connect: { id: company.id },
        },
      },
    });

    return NextResponse.json(newChain, { status: HTTP_STATUS.OK });
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
