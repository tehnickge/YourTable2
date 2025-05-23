import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/types/HTTPStauts";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";
import { writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { formatISO } from "date-fns";

//GET /api/report/excel?restaurantId=1&from=2025-05-01&to=2025-05-22

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = Number(searchParams.get("restaurantId"));
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!restaurantId || !from || !to) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { title: true },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const rents = await prisma.rent.findMany({
      where: {
        restaurant_fk: restaurantId,
        timeStart: { gte: fromDate },
        timeEnd: { lte: toDate },
      },
      include: {
        user: true,
        slot: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Restaurant Report");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "User", key: "user", width: 25 },
      { header: "Slot", key: "slot", width: 20 },
      { header: "Start Time", key: "start", width: 25 },
      { header: "End Time", key: "end", width: 25 },
      { header: "People", key: "people", width: 10 },
      { header: "Status", key: "status", width: 15 },
    ];

    rents.forEach((rent) => {
      sheet.addRow({
        id: rent.id,
        user: rent.user.username,
        slot: rent.slot.number,
        start: formatISO(rent.timeStart),
        end: formatISO(rent.timeEnd),
        people: rent.amountPeople,
        status: rent.rentStatus,
      });
    });

    const tempFilePath = join(tmpdir(), `restaurant-report-${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(tempFilePath);

    const fileBuffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="restaurant_report.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel report error", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
}
