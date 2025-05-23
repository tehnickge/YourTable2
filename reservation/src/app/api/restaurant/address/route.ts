import { createAddress } from "./create";

import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
import { handleValidationError } from "@/app/api/APIHelpers";

interface AddressUpdateSchema {
  id: number;
  fullAddress?: string;
  city?: string;
  coordinate?: string;
  timezone?: string;
}

const addressSchema: Yup.Schema<AddressUpdateSchema> = Yup.object().shape({
  id: Yup.number().required(),
  city: Yup.string().optional(),
  fullAddress: Yup.string().optional(),
  coordinate: Yup.string().optional(),
  timezone: Yup.string().optional(),
});

export const updateAddress = async (req: NextRequest) => {
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
    // проверка на роль пользователя
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
    // получение данных из тела запроса
    const body: AddressUpdateSchema = await req.json();
    // валидируем полученные данные
    const validAddress = await addressSchema.validate(body);

    const address = await prisma.address.findUnique({
      where: {
        id: validAddress.id,
      },
    });

    if (!address)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );

    const newAddress = await prisma.address.update({
      where: {
        id: address.id,
      },
      data: { ...validAddress },
    });
    return NextResponse.json(newAddress, { status: HTTP_STATUS.OK });
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

export { createAddress as POST, updateAddress as PUT };
