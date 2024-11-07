class TreeService {
  private static INSTANCE: TreeService | null = null;

  private constructor() {}

  public static getInstance(): TreeService {
    if (this.INSTANCE === null) {
      this.INSTANCE = new TreeService();
    }

    return this.INSTANCE;
  }
}
