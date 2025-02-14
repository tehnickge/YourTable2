import { HTTP_STATUS } from "@/types/HTTPStauts";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const response = NextResponse.json(
      { info: "logout" },
      { status: HTTP_STATUS.OK }
    );

    response.cookies.delete("jwt_token");

    return await response;
  } catch (err) {
    return err;
  }
};
