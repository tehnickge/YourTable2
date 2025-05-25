import RecordModel from "@/app/models/Hostes";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();

    const newRecord = new RecordModel(data);
    await newRecord.save();

    return NextResponse.json(newRecord, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const searchParams = req.nextUrl.searchParams;
    const restaurantId = searchParams.get("restaurantId");

    const filter: { restaurantId?: string } = {};
    if (restaurantId) {
      filter.restaurantId = restaurantId;
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
