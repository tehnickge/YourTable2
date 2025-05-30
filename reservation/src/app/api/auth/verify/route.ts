import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "@/types/HTTPStauts";
import { corsHeaders } from "../../APIHelpers";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("jwt_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return NextResponse.json(decoded, {
      status: HTTP_STATUS.OK,
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401, headers: corsHeaders }
    );
  }
}
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
