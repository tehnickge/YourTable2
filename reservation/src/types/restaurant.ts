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

export interface IRestaurant {}
