import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
export const GET = async () => {
  const now = DateTime.now();
  console.log(now.plus({ day: 1 }).weekdayLong);
  const days = await prisma.day.findMany({});
  console.log(days);
  const newDate = DateTime.fromObject({
    year: 2025,
    month: 2,
    day: 18,
    hour: 0,
    minute: 30,
  });
  console.log(newDate.toFormat("yyyy LLL dd hh:mm"));
  return NextResponse.json("test", { status: 200 });
};
