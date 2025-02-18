import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
export const GET = async () => {
  const timeNow = DateTime.now();
  console.log(timeNow.weekday);
  return NextResponse.json("test", { status: 200 });
};
