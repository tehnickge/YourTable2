import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { IAddressCreateSchema } from "@/types/address";
import { handleValidationError } from "@/app/api/APIHelpers";

export const getCities = async (req: NextRequest) => {
  try {
    const cities = await prisma.address
      .findMany({
        select: { city: true },
        distinct: "city",
      })
      .then((citiesObject) => citiesObject.map((city) => city.city));

    return NextResponse.json(cities, { status: HTTP_STATUS.OK });
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

export { getCities as GET };
