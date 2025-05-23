import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { handleValidationError } from "../../APIHelpers";

export const getRestaurantById = async (
  req: NextRequest,
  { params }: { params: { id: string } } // <--- context содержит params
) => {
  try {
    const restaurantId = Number(params.id);
    
    if (!restaurantId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        {
          status: HTTP_STATUS.BAD_REQUEST,
        }
      );
    }
    const restId = Number(restaurantId);
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restId,
      },
      select: {
        id: true,
        averageBill: true,
        createdAt: true,
        info: true,
        lastUpdate: true,
        maxHoursToRent: true,
        photos: true,
        rating: true,
        kitchens: {
          select: {
            id: true,
            kitchen: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        title: true,
        shortInfo: true,
        zones: {
          select: {
            id: true,
            title: true,
            description: true,
            color: true,

            slots: {
              select: {
                id: true,
                description: true,
                number: true,

                maxCountPeople: true,
              },
            },
          },
        },
        reviews: { select: { user: true } },
        workShedules: {
          select: {
            id: true,
            day: true,
            timeBegin: true,
            timeEnd: true,
          },
        },
        address: true,
        menus: true,
        restaurantChain: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(restaurant, { status: 200 });
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
