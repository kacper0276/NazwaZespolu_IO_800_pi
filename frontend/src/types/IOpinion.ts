import { UserType } from "./IUser";

export interface Opinion {
  rating: number;

  opinion: string;

  user: UserType;
}
