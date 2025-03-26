import { NextRequest, NextResponse } from "next/server";
import { uploadRestaurantFile } from "@/lib/minio";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { IUserPayload } from "@/types/user";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false, // Отключаем стандартный bodyParser
  },
};

const addPhotos = async (req: NextRequest) => {
  try {
    const token =
      req.cookies.get("jwt_token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      //   return NextResponse.redirect(new URL("api/login", req.url));
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_AUTHORIZED },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }
    // вытаскиваем и проверяем jwt
    const { id, username, email, type } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;
    // проверка на роль пользователя
    if (type !== "admin") {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        },
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }
    // получение объекта из form-data
    const formData = await req.formData();

    // Получаем все файлы с полем "photo"
    const photoFiles = formData.getAll("photo");

    // достаем текстовые поля
    const userData = Object.fromEntries(formData.entries());

    if (photoFiles.length === 0) {
      return NextResponse.json(
        { error: "No photos uploaded" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const restaurantId: number = Number(userData.restaurantId);

    if (!restaurantId) {
      return NextResponse.json(
        { error: "нет указан id ресторана" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const checkRestaurant = await prisma.restaurant.findFirst({
      where: {
        id: Number(restaurantId),
      },
    });

    if (!checkRestaurant) {
      return NextResponse.json(
        { error: "ресторан не найден" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const fileUrls: string[] = [];
    let iterator: number = 0;
    for (const photoFile of photoFiles) {
      if (photoFile instanceof File) {
        if (photoFile.type !== "image/jpeg" && photoFile.type !== "image/png") {
          continue;
        }
        const buffer = await photoFile.arrayBuffer();
        const fileName = `restaurant${restaurantId}/${iterator}`;

        // Сжимаем изображение перед загрузкой
        const compressedBuffer = await sharp(Buffer.from(buffer))
          .resize(800) // Изменяем размер изображения
          .jpeg({ quality: 80 }) // Сжимаем изображение в JPEG с качеством 80%
          .png({ quality: 80 }) // Сжимаем изображение в PNG с качеством 80%
          .toBuffer();

        // Загружаем файл в MinIO и получаем URL
        const fileUrl = await uploadRestaurantFile(compressedBuffer, fileName);

        // Добавляем URL файла в список
        fileUrls.push(fileUrl);

        iterator++;
      }
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id: restaurantId,
      },
      data: {
        photos: fileUrls,
      },
    });

    return NextResponse.json(updatedRestaurant, { status: HTTP_STATUS.OK });
  } catch (e) {}
};

export { addPhotos as POST };
