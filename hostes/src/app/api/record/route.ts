import RecordModel from "@/models/Hostes";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";

// POST — создание записи
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();

    const newRecord = new RecordModel(data);
    await newRecord.save();

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}

// GET — получение по restaurantId и дате
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const searchParams = req.nextUrl.searchParams;
    const restaurantId = searchParams.get("restaurantId");
    const date = searchParams.get("date"); // Ожидаем формат YYYY-MM-DD

    const filter: any = {};

    if (restaurantId) {
      filter.restaurantId = parseInt(restaurantId, 10);
    }

    if (date) {
      const dayStart = DateTime.fromISO(date).startOf("day").toJSDate();
      const dayEnd = DateTime.fromISO(date).endOf("day").toJSDate();
      filter.date = { $gte: dayStart, $lte: dayEnd };
    }

    const records = await RecordModel.find(filter).sort({ created: -1 });
    return NextResponse.json(records);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}
