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
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
