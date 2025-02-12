export interface IUser {
  id: number
  username: String;
  email: String;
  password: String;
  photo?: Uint8Array;
  createdAt: Date;
  type: String;
  historyRests: number[];
  wishList: number[];
  phoneNumber?: String;
}

export interface IUserValidSchema {
  id?: number;
  username: String;
  email: String;
  role?: String;
  password: String;
}