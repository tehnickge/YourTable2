import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
export const GET = async () => {
  const now = DateTime.now();
  const maxH = DateTime.now().plus({ hours: 15 });
  console.log(now.toFormat("yyyy MM dd hh:mm"));
  console.log(maxH.toFormat("yyyy MM dd hh:mm"));
  const interval = Interval.fromDateTimes(now, maxH);
  console.log(interval.length("hour"));

  return NextResponse.json("test", { status: 200 });
};
