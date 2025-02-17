import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import prisma from "@/lib/prisma";

const getAddressByRestId = async (req: NextRequest) => {
  try {
    const url = req.nextUrl;
    const restId = url.searchParams.get("id");

    if (!restId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    const address = await prisma.address.findFirst({
      where: {
        restaurant_fk: Number(restId),
      },
    });

    return NextResponse.json(address, { status: HTTP_STATUS.OK });
  } catch (error) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

export { getAddressByRestId as GET };
