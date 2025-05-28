import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as Yup from "yup";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";

import bcrypt from "bcryptjs";
import { corsHeaders, handleValidationError } from "@/app/api/APIHelpers";

const hostesCreateSchema = Yup.object({
  restaurantId: Yup.number().required(),
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

    return decoded.type === "hostes" ? decoded : null;
  } catch {
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurantId } = await hostesCreateSchema.validate(body);

    const restaurantExists = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurantExists) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: HTTP_STATUS.BAD_REQUEST, headers: corsHeaders }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { zones: { include: { slots: true } } },
    });

    return NextResponse.json(restaurant, {
      status: HTTP_STATUS.CREATED,
      headers: corsHeaders,
    });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return handleValidationError(error);
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR, headers: corsHeaders }
    );
  }
}
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
