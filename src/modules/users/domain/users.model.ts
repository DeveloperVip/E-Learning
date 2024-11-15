export interface IUser {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  password: string;
  createAt?: Date;
  updateAt?: Date;
  confirmationCode?: number;
  isConfirmed?: boolean;
}
