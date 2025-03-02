import { Prisma } from "@prisma/client";

export interface IRestaurant {
  info: string | null;
  title: string;
  shortInfo: string | null;
  id: number;
  uniqueKey: string;
  createdAt: Date;
  restaurantChain_fk: number | null;
  maxHoursToRent: number;
  averageBill: number | null;
  lastUpdate: Date;
  rating: number | null;
}

export interface IRestaurantCreateSchema {
  info?: string | null;
  title: string;
  shortInfo?: string | null;
  uniqueKey?: string;
}

export interface IGetRestaurantWithFilter {
  kitchens: string[];
  city?: string | null;
  minBill?: number | null;
  maxBill?: number | null;
  minRating?: number | null;
  page: number;
  pageSize: number;
  title?: string | null;
}

export type IRestaurantWithFilter = Prisma.RestaurantGetPayload<{
  include: {
    workShedules: true;
    photos: true;
    restaurantChain: { include: { company: true } };
    menus: true;
    address: true;
    kitchens: { include: { kitchen: true } };
  };
}>;
