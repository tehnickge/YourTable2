import { getUserPayload } from "./../../APIHelpers";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { NextRequest, NextResponse } from "next/server";
import { getToken, handleValidationError } from "../../APIHelpers";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { UserTypes } from "@/types/user";

const getUserById = async (
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

    if (user.id !== Number(params.id) && UserTypes.admin !== user.type) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }

    const curentUser = await prisma.user.findFirst({
      select: {
        id: true,
        username: true,
        photo: true,
        type: true,
        email: true,
        historyRest: true,
        wishList: true,
        recommendations: true,
        phoneNumber: true,
      },
      where: { id: user.id },
    });

    return NextResponse.json(curentUser, { status: HTTP_STATUS.OK });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return handleValidationError(error);
    }
    console.log(error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

export { getUserById as GET };
