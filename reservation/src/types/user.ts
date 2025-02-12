export interface IUser {
  id: number;
  username: string;
  email: string;
  role?: string;
  password?: string;
}

export interface IUserValidSchema {
  id?: number;
  username: string;
  email: string;
  role?: string;
  password: string;
}