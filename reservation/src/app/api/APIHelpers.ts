import { HTTP_STATUS } from "@/types/HTTPStauts";
import { NextResponse } from "next/server";
import * as Yup from "yup";

export const handleValidationError = (error: Yup.ValidationError) => {
  return NextResponse.json(
    { error: error.errors },
    { status: HTTP_STATUS.BAD_REQUEST }
  );
};
