import * as Yup from "yup";
import { NextRequest, NextResponse } from "next/server";
import {
  getToken,
  getUserPayload,
  handleValidationError,
} from "../../APIHelpers";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { UserTypes } from "@/types/user";
import prisma from "@/lib/prisma";

export type RestaurantUpdate = {
  title: string;
  info: string | null;
  shortInfo: string | null;
  averageBill: number | null;
  maxHoursToRent: number;
};

const restaurantSchema: Yup.Schema<RestaurantUpdate> = Yup.object().shape({
  title: Yup.string().required(),
  info: Yup.string().required().nullable(),
  shortInfo: Yup.string().required().nullable(),
  averageBill: Yup.number().required().nullable(),
  maxHoursToRent: Yup.number().required(),
});

export const updateRestaurantById = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const token = await getToken(req);
    if (!token) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }

    const user = await getUserPayload(token);

    if (!user) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }

    if (user.type !== UserTypes.admin)
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );

    const resturant = await prisma.restaurant.findUnique({
      where: { id: Number(params.id) },
    });

    if (!resturant)
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS + " ресторан не найден" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );

    const body = await req.json();

    const validateDate = await restaurantSchema.validate(body);

    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id: resturant.id,
      },
      data: {
        ...validateDate,
      },
    });

    return NextResponse.json(updatedRestaurant, { status: HTTP_STATUS.OK });
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
