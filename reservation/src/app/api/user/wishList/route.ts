import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { NextRequest, NextResponse } from "next/server";
import { getToken, getUserPayload } from "../../APIHelpers";
import prisma from "@/lib/prisma";

interface RestaurantId {
  id: number;
}

const changeWishList = async (req: NextRequest) => {
  try {
    const token = await getToken(req);
    if (!token) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }
    const user = await getUserPayload(token);

    if (!user) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }

    const body: RestaurantId = await req.json();

    const currentWishList = await prisma.user.findFirst({
      select: { wishList: true },
      where: {
        id: user.id,
      },
    });

    if (!currentWishList || !currentWishList.wishList) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const newWishList: number[] = currentWishList.wishList.includes(body.id)
      ? currentWishList.wishList.filter((wish) => wish !== body.id)
      : [...currentWishList.wishList, body.id];

    const { wishList } = await prisma.user.update({
      select: {
        wishList: true,
      },
      where: {
        id: user.id,
      },
      data: {
        wishList: [...newWishList],
      },
    });

    return NextResponse.json(wishList, { status: HTTP_STATUS.OK });
  } catch (e) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

export { changeWishList as POST };
