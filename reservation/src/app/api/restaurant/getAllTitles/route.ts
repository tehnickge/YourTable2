import prisma from "@/lib/prisma";
import { HTTP_STATUS } from "@/types/HTTPStauts";
import { NextRequest, NextResponse } from "next/server";

const getAllRestaurantTitle = async (req: NextRequest) => {
  const titles = await prisma.restaurant.findMany({
    select: {
      title: true,
    },
  });
  return NextResponse.json(titles, { status: HTTP_STATUS.OK });
};

export { getAllRestaurantTitle as GET };
