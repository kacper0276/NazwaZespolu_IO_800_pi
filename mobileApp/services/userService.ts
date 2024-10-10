class UserService {
  private static INSTANCE: UserService | null = null;
  private users: Array<{ id: number; name: string }> = [];

  private constructor() {}

  public static getInstance(): UserService {
    if (this.INSTANCE === null) {
      this.INSTANCE = new UserService();
    }
    return this.INSTANCE;
  }

  public addUser(id: number, name: string): void {
    this.users.push({ id, name });
  }

  public getUsers(): Array<{ id: number; name: string }> {
    return this.users;
  }

  public removeUser(id: number): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

export default UserService;
