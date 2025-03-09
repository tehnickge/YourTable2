import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { handleValidationError } from "../../APIHelpers";
import { IGetRestaurantWithFilter } from "@/types/restaurant";

const restaurantSchema: Yup.Schema<IGetRestaurantWithFilter> =
  Yup.object().shape({
    kitchens: Yup.array().of(Yup.string().required()).required(),
    city: Yup.string().optional(),
    minBill: Yup.number().optional(),
    maxBill: Yup.number().optional(),
    minRating: Yup.number().optional(),
    title: Yup.string().optional(),
    page: Yup.number().required().min(1),
    pageSize: Yup.number().required().min(3),
  });

const getRestaurants = async (req: NextRequest) => {
  try {
    const body: IGetRestaurantWithFilter = await req.json();
    const validRestaurant = await restaurantSchema.validate(body);

    const {
      kitchens,
      minBill,
      maxBill,
      minRating,
      city,
      title,
      page = 1,
      pageSize = 10,
    } = validRestaurant;

    const where: any = {};

    if (kitchens?.length) {
      where.kitchens = {
        some: {
          kitchen: {
            title: { in: kitchens },
          },
        },
      };
    }

    if (city) {
      where.address = {
        city,
      };
    }

    if (minBill !== undefined || maxBill !== undefined) {
      where.averageBill = {};
      if (minBill !== undefined) where.averageBill.gte = minBill;
      if (maxBill !== undefined) where.averageBill.lte = maxBill;
    }

    if (minRating !== undefined) {
      where.rating = {
        gte: minRating,
      };
    }

    if (title) {
      where.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    const totalCount = await prisma.restaurant.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        workShedules: true,
        restaurantChain: { include: { company: true } },
        menus: true,
        address: true,
        kitchens: { include: { kitchen: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json(
      { data: restaurants, totalPages, totalCount },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return handleValidationError(error);
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR + ` ${error}` },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

export { getRestaurants as POST };
