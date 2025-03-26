import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const getAllKitchens = async (req: NextRequest) => {
  try {
    const kitchens = await prisma.kitchen.findMany();
    return NextResponse.json(kitchens, { status: HTTP_STATUS.OK });
  } catch (e) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

export { getAllKitchens };
