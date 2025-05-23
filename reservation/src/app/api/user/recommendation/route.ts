import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/types/HTTPStauts";
import prisma from "@/lib/prisma";
import { getToken, getUserPayload } from "../../APIHelpers";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken(req);
    if (!token) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const user = await getUserPayload(token);
    if (!user) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        rents: { select: { restaurant_fk: true } },
        wishList: true,
      },
    });

    if (!foundUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const rentedIds = foundUser.rents.map((r) => r.restaurant_fk);
    const wishListIds = foundUser.wishList;
    const combinedIds = Array.from(new Set([...rentedIds, ...wishListIds]));

    if (combinedIds.length === 0) {
      return NextResponse.json([], { status: HTTP_STATUS.OK });
    }

    const baseRestaurants = await prisma.restaurant.findMany({
      where: { id: { in: combinedIds } },
      include: {
        kitchens: { select: { kitchen_fk: true } },
      },
    });

    const kitchenIds = new Set<number>();
    let totalBill = 0;
    let billCount = 0;

    baseRestaurants.forEach((restaurant) => {
      restaurant.kitchens.forEach((rk) => kitchenIds.add(rk.kitchen_fk));
      if (restaurant.averageBill) {
        totalBill += Number(restaurant.averageBill);
        billCount++;
      }
    });

    const avgBill = billCount > 0 ? totalBill / billCount : 0;
    const minBill = avgBill * 0.75;
    const maxBill = avgBill * 1.25;

    const similarRestaurants = await prisma.restaurant.findMany({
      where: {
        id: { notIn: combinedIds },
        averageBill:
          avgBill > 0
            ? {
                gte: minBill,
                lte: maxBill,
              }
            : undefined,
        kitchens: {
          some: {
            kitchen_fk: { in: Array.from(kitchenIds) },
          },
        },
      },
      orderBy: {
        rating: "desc",
      },
      take: 5,
    });

    return NextResponse.json(similarRestaurants, {
      status: HTTP_STATUS.OK,
    });
  } catch (e) {
    console.error("recommendation error", e);
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
}
