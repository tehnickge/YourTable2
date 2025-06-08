import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as Yup from "yup";
import jwt from "jsonwebtoken";
import { IUserPayload } from "@/types/user";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";

import { corsHeaders, handleValidationError } from "@/app/api/APIHelpers";

const hostesCreateSchema = Yup.object({
  restaurantId: Yup.number().required(),
});

const updateSchema: Yup.Schema<{ rentId: number; status: string }> =
  Yup.object().shape({
    rentId: Yup.number().required(),
    status: Yup.string().required(),
  });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slotId = Number(searchParams.get("slotId"));
    if (isNaN(slotId))
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
        { status: HTTP_STATUS.SERVER_ERROR, headers: corsHeaders }
      );

    const rents = await prisma.rent.findMany({
      where: { slot_fk: slotId },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(rents, {
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rentId, status } = await updateSchema.validate(body);

    const rent = await prisma.rent.findUnique({
      where: { id: rentId },
    });

    if (!rent)
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST, headers: corsHeaders }
      );

    const updatedRent = await prisma.rent.update({
      where: { id: rentId },
      data: { ...rent, rentStatus: status },
    });

    return NextResponse.json(updatedRent, {
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rentId = Number(searchParams.get("rentId"));

    const rent = await prisma.rent.findUnique({
      where: { id: rentId },
    });

    if (!rent)
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST, headers: corsHeaders }
      );

    const deletedRent = await prisma.rent.delete({
      where: { id: rentId },
    });

    return NextResponse.json(deletedRent, {
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
