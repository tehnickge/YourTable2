import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { IUserPayload } from "@/types/user";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import { uploadRestaurantFile } from "@/lib/minio";
import * as Yup from "yup";
import { handleValidationError } from "../../APIHelpers";

const menuCreateSchema: Yup.Schema<ICreateMenu> = Yup.object().shape({
  restaurantId: Yup.number().required(),
  titleDish: Yup.string().required(),
  photo: Yup.string().optional(),
  price: Yup.number().required(),
});

const createMenu = async (req: NextRequest) => {
  try {
    // const token =
    //   req.cookies.get("jwt_token")?.value ||
    //   req.headers.get("Authorization")?.split(" ")[1];

    // if (!token) {
    //   //   return NextResponse.redirect(new URL("api/login", req.url));
    //   return NextResponse.json(
    //     { error: ERROR_MESSAGES.BAD_AUTHORIZED },
    //     {
    //       status: HTTP_STATUS.UNAUTHORIZED,
    //     }
    //   );
    // }
    // // вытаскиваем и проверяем jwt
    // const { id, username, email, type } = jwt.verify(
    //   token,
    //   process.env.JWT_SECRET || ""
    // ) as IUserPayload;
    // // проверка на роль пользователя
    // if (type !== "admin") {
    //   return NextResponse.json(
    //     {
    //       error: ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
    //     },
    //     {
    //       status: HTTP_STATUS.UNAUTHORIZED,
    //     }
    //   );
    // }
    // получение объекта из form-data
    const formData = await req.formData();

    // Получаем все файлы с полем "photo"
    const photoFile = formData.get("photo");

    // достаем текстовые поля
    const userData = Object.fromEntries(formData.entries());

    const restaurantId: number = Number(userData.restaurantId);
    const titleDish = userData.titleDish;
    const price: number = Number(userData.price);

    const validData = await menuCreateSchema.validate({
      restaurantId,
      titleDish,
      price,
    });

    const checkRestaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
      },
    });

    if (!checkRestaurant) {
      return NextResponse.json(
        { error: "ресторан не найден" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (!(photoFile instanceof File)) {
      return NextResponse.json(
        { error: "фото не распозано" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    if (photoFile.type !== "image/jpeg" && photoFile.type !== "image/png") {
      return NextResponse.json(
        { error: "не тот формат" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const buffer = await photoFile.arrayBuffer();
    const fileName = `menu${restaurantId}/${new Date().toISOString()}${titleDish}${price}`;

    // Сжимаем изображение перед загрузкой
    const compressedBuffer = await sharp(Buffer.from(buffer))
      .resize(800) // Изменяем размер изображения
      .jpeg({ quality: 80 }) // Сжимаем изображение в JPEG с качеством 80%
      .png({ quality: 80 }) // Сжимаем изображение в PNG с качеством 80%
      .toBuffer();

    // Загружаем файл в MinIO и получаем URL
    const fileUrl = await uploadRestaurantFile(compressedBuffer, fileName);

    const newMenu = await prisma.menu.create({
      data: {
        restaurant_fk: restaurantId,
        photo: fileUrl,
        price: price,
        titleDish: titleDish.toString(),
      },
    });

    return NextResponse.json(newMenu, { status: HTTP_STATUS.OK });
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

export { createMenu };
