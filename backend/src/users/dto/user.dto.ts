import { Role } from 'src/enums/role.enum';

export type userData = {
  email: string;
  password: string;
  role: Role;
  isActivated: boolean;
  firstname?: string;
  lastname?: string;
};
