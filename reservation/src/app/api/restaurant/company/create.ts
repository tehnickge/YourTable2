import { ERROR_MESSAGES, HTTP_STATUS } from "@/types/HTTPStauts";
import { IUserPayload } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import * as Yup from "yup";
import prisma from "@/lib/prisma";
import { ICompanyCreateSchema } from "@/types/company";
import { handleValidationError } from "../../APIHelpers";

const companySchema: Yup.Schema<ICompanyCreateSchema> = Yup.object().shape({
  title: Yup.string().required(),
});

const checkCompanyExist = async (title: string): Promise<Boolean> => {
  const checkCompany = await prisma.company.findFirst({
    where: {
      title,
    },
  });
  if (checkCompany) {
    return true;
  }
  return false;
};

export const createCompany = async (req: NextRequest) => {
  try {
    const token =
      req.cookies.get("jwt_token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      //   return NextResponse.redirect(new URL("api/login", req.url));
      return NextResponse.json(ERROR_MESSAGES.BAD_AUTHORIZED, {
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    // вытаскиваем и проверяем jwt
    const { id, username, email, type } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as IUserPayload;
    // проверка на роль пользователя
    if (type !== "admin") {
      return NextResponse.json(
        ERROR_MESSAGES.BAD_AUTHORIZED + " Insufficient access rights",
        {
          status: HTTP_STATUS.UNAUTHORIZED,
        }
      );
    }
    // получаем данные из тела запроса
    const body: ICompanyCreateSchema = await req.json();
    // валидируем полученные данные
    const validCompany = await companySchema.validate(body);
    // прверяем есть ли уже такая компания
    if (await checkCompanyExist(validCompany.title)) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.BAD_ARGUMENTS + " Company title already exist",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const newCompany = await prisma.company.create({
      data: {
        title: validCompany.title,
      },
    });

    return NextResponse.json(newCompany, { status: HTTP_STATUS.OK });
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
