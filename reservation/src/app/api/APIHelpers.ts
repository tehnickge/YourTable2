import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { IUserPayload, UserTypes } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import * as Yup from "yup";

export const handleValidationError = (error: Yup.ValidationError) => {
  return NextResponse.json(
    { error: error.errors },
    { status: HTTP_STATUS.BAD_REQUEST }
  );
};

export const getToken = async (req: NextRequest): Promise<string | null> => {
  const token =
    req.cookies.get("jwt_token")?.value ||
    req.headers.get("Authorization")?.split(" ")[1];

  return token ? token : null;
};

export const getUserPayload = async (
  token: string,
  rolesPermit?: UserTypes[]
): Promise<IUserPayload | null> => {
  try {
    const { id, username, email, type } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as IUserPayload;
    // проверка на роль пользователя
    if (rolesPermit?.length && !rolesPermit.some((role) => role === type)) {
      return null;
    }

    return { id, username, email, type };
  } catch (error) {
    console.warn("Invalid or expired JWT:", error);
    return null;
  }
};
