import { NextRequest, NextResponse } from "next/server";
import { deleteRestaurantFile, uploadRestaurantFile } from "@/lib/minio";
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

    if (checkRestaurant.photos.length > 0)
      return NextResponse.json(
        { error: ERROR_MESSAGES.CONFLICT },
        { status: HTTP_STATUS.CONFLICT }
      );

    const fileUrls: string[] = [];
    let iterator: number = 0;
    for (const photoFile of photoFiles) {
      if (photoFile instanceof File) {
        if (photoFile.type !== "image/jpeg" && photoFile.type !== "image/png") {
          continue;
        }
        const buffer = await photoFile.arrayBuffer();
        const fileName = `restaurant${restaurantId}/${new Date().toISOString()}`;

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
  } catch (e) {
    return NextResponse.json(
      { error: e },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

const updatePhotos = async (req: NextRequest) => {
  try {
    // 1. Аутентификация
    const token =
      req.cookies.get("jwt_token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // 2. Проверка прав
    const { type } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;
    if (type !== "admin") {
      return NextResponse.json(
        { error: "Недостаточно прав" },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // 3. Получение данных
    const formData = await req.formData();
    const photoFiles = formData.getAll("photo");
    const restaurantId = Number(formData.get("restaurantId"));

    // 4. Валидация
    if (!restaurantId || isNaN(restaurantId)) {
      return NextResponse.json(
        { error: "Некорректный ID ресторана" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (photoFiles.length === 0) {
      return NextResponse.json(
        { error: "Не загружено ни одного фото" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant)
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    // 5. Обработка фото
    const newPhotoUrls: string[] = [];

    for (const photoFile of photoFiles) {
      if (!(photoFile instanceof File)) continue;

      // Проверка типа файла
      if (!["image/jpeg", "image/png"].includes(photoFile.type)) {
        continue;
      }

      // Обработка изображения
      const buffer = await photoFile.arrayBuffer();
      const fileName = `restaurant${restaurantId}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.${photoFile.type.split("/")[1]}`;

      const compressedBuffer = await sharp(Buffer.from(buffer))
        .resize(800)
        .jpeg({ quality: 80 })
        .png({ quality: 80 })
        .toBuffer();

      // Загрузка в хранилище
      const fileUrl = await uploadRestaurantFile(compressedBuffer, fileName);
      newPhotoUrls.push(fileUrl);
    }

    // 6. Обновление в базе данных
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { photos: [...restaurant.photos, ...newPhotoUrls] },
    });

    return NextResponse.json(updatedRestaurant, { status: HTTP_STATUS.OK });
  } catch (e) {
    console.error("Ошибка при обновлении фото:", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

const deletePhoto = async (req: NextRequest) => {
  try {
    // 1. Аутентификация
    const token =
      req.cookies.get("jwt_token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // 2. Проверка прав
    const { type } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;
    if (type !== "admin") {
      return NextResponse.json(
        { error: "Недостаточно прав" },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // 3. Парсинг URL
    const url = new URL(req.url);
    const restaurantId = Number(url.searchParams.get("restaurantId"));
    const photoUrl = url.searchParams.get("photoUrl");

    if (!restaurantId || !photoUrl) {
      return NextResponse.json(
        { error: "Не указаны ID ресторана или URL фото" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // 4. Проверка существования ресторана
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Ресторан не найден" },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // 5. Проверка существования фото
    if (!restaurant.photos.includes(photoUrl)) {
      return NextResponse.json(
        { error: "Фото не найдено в этом ресторане" },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // 6. Удаление из хранилища
    try {
      const fileName = decodeURIComponent(photoUrl.split("/").pop() || "");
      await deleteRestaurantFile(`restaurant${restaurantId}/${fileName}`);
    } catch (e) {
      console.error("Ошибка удаления файла из хранилища:", e);
      // Продолжаем удаление из БД даже если файл не найден в хранилище
    }

    // 7. Обновление в базе данных
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        photos: restaurant.photos.filter((photo) => photo !== photoUrl),
      },
    });

    return NextResponse.json(updatedRestaurant, { status: HTTP_STATUS.OK });
  } catch (e) {
    console.error("Ошибка при удалении фото:", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

export { addPhotos as POST, updatePhotos as PUT, deletePhoto as DELETE };
