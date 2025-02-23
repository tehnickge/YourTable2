export interface IReviewCreateSchema {
  restaurantId: number;
  userId: number;
  comment?: string;
  rating: number;
}
