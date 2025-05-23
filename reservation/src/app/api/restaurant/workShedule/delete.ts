import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { handleValidationError } from "../../APIHelpers";

const deleteSchema = Yup.object({
  id: Yup.number().required(), // ID расписания
});

export const deleteShedule = async (req: NextRequest) => {
  try {
    const token =
      req.cookies.get("jwt_token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const { id, username, email, type } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;

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

    const body = await req.json();
    const { id: sheduleId } = await deleteSchema.validate(body);

    const existingShedule = await prisma.workShedule.findUnique({
      where: { id: sheduleId },
    });

    if (!existingShedule) {
      return NextResponse.json(
        { error: "Shedule not found" },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const deletedShedule = await prisma.workShedule.delete({
      where: { id: sheduleId },
      include: { day: true },
    });

    return NextResponse.json(deletedShedule, { status: HTTP_STATUS.OK });
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
