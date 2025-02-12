export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  photo?: Uint8Array;
  createdAt: Date;
  type: string;
  historyRests: number[];
  wishList: number[];
  phoneNumber?: string;
}

export interface IUserValidSchemaRegistration {
  id?: number;
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}
