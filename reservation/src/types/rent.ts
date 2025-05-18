import { Prisma } from "@prisma/client";

export interface IRentCreateSchema {
  timeStart: Date;
  timeEnd: Date;  
  userId: number;
  restaurantId: number;
  amountPeople: number;
  slotId: number;
}

export type Irent = Prisma.RentGetPayload<{}>;
