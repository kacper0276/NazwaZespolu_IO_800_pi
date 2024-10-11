export default class TreeService {
  private static instance: TreeService | null = null;

  private constructor() {}

  public static getInstance() {
    if (this.instance === null) {
      this.instance = new TreeService();
    }

    return this.instance;
  }

  generateTreeSapling(width = 100, height = 100, color = "#4CAF50") {
    return ``;
  }
}
