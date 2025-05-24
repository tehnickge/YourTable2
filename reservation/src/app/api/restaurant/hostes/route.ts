import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as Yup from "yup";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { handleValidationError } from "../../APIHelpers";

const hostesCreateSchema = Yup.object({
  login: Yup.string().required(),
  password: Yup.string().required(),
  restaurantId: Yup.number().required(),
});

const hostesDeleteSchema = Yup.object({
  id: Yup.number().required("Hostes ID is required"),
});

// Проверка прав доступа
const verifyAdmin = (req: NextRequest): IUserPayload | null => {
  const token =
    req.cookies.get("jwt_token")?.value ||
    req.headers.get("Authorization")?.split(" ")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;

    return decoded.type === "admin" ? decoded : null;
  } catch {
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const { login, password, restaurantId } = await hostesCreateSchema.validate(
      body
    );

    const restaurantExists = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurantExists) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const newHostes = await prisma.hostes.create({
      data: {
        login,
        password,
        restaurant: { connect: { id: restaurantId } },
      },
    });

    return NextResponse.json(newHostes, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return handleValidationError(error);
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const { id } = await hostesDeleteSchema.validate(body);

    const existingHostes = await prisma.hostes.findUnique({ where: { id } });
    if (!existingHostes) {
      return NextResponse.json(
        { error: "Hostes not found" },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const deletedHostes = await prisma.hostes.delete({ where: { id } });

    return NextResponse.json(deletedHostes, { status: HTTP_STATUS.OK });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return handleValidationError(error);
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
}
