/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  IUser,
  IUserPayload,
  IUserValidSchemaRegistration,
} from "@/types/user";
import * as Yup from "yup";
import { handleValidationError } from "../../APIHelpers";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import jwt from "jsonwebtoken";

// валидация данных юзера
const userValidate: Yup.Schema<IUserValidSchemaRegistration> =
  Yup.object().shape({
    username: Yup.string()
      .required("Name is required")
      .min(4, "Name must be at least 4 characters")
      .max(15, "Name must be less than 16 characters"),
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters")
      .max(15, "Password must be less than 16 characters"),
    phoneNumber: Yup.string()
      .matches(/^\+?\d{10,15}$/, "Invalid phone number format")
      .optional(),
  });

const getUser = async (
  user: IUserValidSchemaRegistration
): Promise<IUser | null> => {
  const checkedUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: user.username }, { email: user.email }],
    },
  });
  if (checkedUser) {
    return checkedUser;
  }
  return null;
};

const auth = async (req: NextRequest) => {
  try {
    // получение данных от из тела запроса
    const body: IUserValidSchemaRegistration = await req.json();
    // валидация данных
    const user = await userValidate.validate(body, { abortEarly: false });
    // получение юзера по email или username
    const currentUser = await getUser(user);
    if (!currentUser) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // сравнение пароля из базы, который представлен ввиде hash`а с паролем который был передан
    const comparePassword = await bcrypt.compare(
      user.password,
      currentUser.password
    );
    if (!comparePassword) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_ARGUMENTS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    // заполняем payload для jwt token
    const userJWT: IUserPayload = {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      type: currentUser.type,
    };
    // создаем новую подпись
    const JWTToken = jwt.sign(userJWT, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // создание ответа
    const response = NextResponse.json( userJWT , { status: HTTP_STATUS.OK });
    // уставнавливаем jwt в coockies
    response.cookies.set("jwt_token", JWTToken, { httpOnly: true, path: "/" });
    return response;
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return handleValidationError(error);
    }
    console.error("Ошибка при авторизации:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
};

export { auth as POST };
