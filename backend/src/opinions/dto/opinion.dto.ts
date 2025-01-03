import { userData } from 'src/users/dto/user.dto';

export type opinionData = {
  rating: number;
  opinion: string;
  user: userData;
};
