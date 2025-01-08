export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserRegisterData extends UserLoginData {
  repeat_password: string | null;
  firstname: string | null;
  lastname: string | null;
}

export interface UserType {
  email: string;
  isActivated: boolean;
  password: string;
  role: string;
  _id: string;
  firstname: string | null;
  lastname: string | null;
  profileId: string;
}
