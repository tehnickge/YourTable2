import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { IUserPayload } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export const deleteKitchenFromRestaurant = async (req: NextRequest) => {
  try {
    const token =
      req.cookies.get("jwt_token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(ERROR_MESSAGES.BAD_AUTHORIZED, {
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const { type } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;

    if (type !== "admin") {
      return NextResponse.json(
        ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const { id } = await req.json();

    if (typeof id !== "number") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS + " id must be a number" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const existing = await prisma.restaurantKitchen.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + " relation not found",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const deletedKitchen = await prisma.restaurantKitchen.delete({
      where: { id },
    });

    return NextResponse.json(
      deletedKitchen,
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};
