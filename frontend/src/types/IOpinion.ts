import { UserType } from "./IUser";

export interface Opinion {
  _id: string;

  rating: number;

  opinion: string;

  user: UserType;

  closed: boolean;
}
