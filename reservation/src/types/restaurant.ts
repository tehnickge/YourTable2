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
    restaurantChain: { include: { company: true } };
    menus: true;
    address: true;
    kitchens: { include: { kitchen: true } };
  };
}>;

export type IRestaurantWithAll = Prisma.RestaurantGetPayload<{
  include: {
    workShedules: true;
    restaurantChain: { include: { company: true } };
    menus: true;
    address: true;
    kitchens: { include: { kitchen: true } };
  };
}>;

export type IRestaurantTitle = {
  title: string;
};

export type AdminRestaurant = {
  id: number;
  title: string;
  createdAt: string;
  info: string | null;
  shortInfo: string | null;
  restaurantChain_fk: number | null;
  photos: string[];
  maxHoursToRent: number;
  uniqueKey: string;
  averageBill: number | null;
  lastUpdate: string;
  rating: number | null;
  kitchens: {
    id: number;
    kitchen: {
      id: number;
      title: string;
    };
  }[];
  zones: {
    id: number;
    title: string;
    description: string;
    color: string;
    slots: {
      id: number;
      description: string;
      maxCountPeople: string;
      number: string;
    }[];
  }[];
  reviews: {
    id: number;
    restaurant_fk: number;
    user_fk: number;
    user: {
      id: number;
      username: string;
      photo: string;
    };
    comment: string | null;
    rating: number;
  }[];
  address: {
    id: number;
    city: string;
    fullAddress: string;
    coordinate: string;
    timezone: string;
  };
  restaurantChain: {
    id: number;
    title: string;
    company: { id: number; title: string };
  };
  menus: {
    id: number;
    titleDish: string | null;
    photo: string | null;
    price: number | null;
  }[];
  workShedules: {
    id: number;
    day: {
      id: number;
      title: string;
    };
    timeBegin: string;
    timeEnd: string;
  }[];
};
