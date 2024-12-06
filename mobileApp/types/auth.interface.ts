export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister extends ILogin {
  repeatPassword: string;
  firstName?: string;
  lastName?: string;
}
