export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface IResponse {
  error?: boolean;
  errMessage?: string;
  success: boolean;
  message?: string;
}
