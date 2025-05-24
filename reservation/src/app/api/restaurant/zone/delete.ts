import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import * as Yup from "yup";
import { IUserPayload } from "@/types/user";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { handleValidationError } from "../../APIHelpers";

const deleteZoneSchema = Yup.object({
  id: Yup.number().required("Zone ID is required"),
});

export const deleteZone = async (req: NextRequest) => {
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

    const { type } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;

    if (type !== "admin") {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const { id } = await deleteZoneSchema.validate(body);

    const existingZone = await prisma.zone.findUnique({ where: { id } });

    if (!existingZone) {
      return NextResponse.json(
        { error: "Zone not found" },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const deletedZone = await prisma.zone.delete({
      where: { id },
    });

    return NextResponse.json(deletedZone, { status: HTTP_STATUS.OK });
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
