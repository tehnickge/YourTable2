import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { IRestaurantCreateSchema } from "@/types/restaurant";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { handleValidationError } from "../../APIHelpers";

export const getRestaurantById = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
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

    const url = req.nextUrl;
    if (!params) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }
    const restId = Number(await params.id);
    console.log(restId);
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restId,
      },
      select: {
        kitchens: true,
        zones: {
          select: {
            slots: true,
          },
        },
        reviews: true,
        workShedules: true,
        address: true,
        photos: true,
        menus: true,
        restaurantChain: { select: { company: true } },
      },
    });

    return NextResponse.json("jopa", { status: 200 });
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
