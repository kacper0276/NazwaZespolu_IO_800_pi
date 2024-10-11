export default class TreeService {
  private static instance: TreeService | null = null;

  private constructor() {}

  public static getInstance() {
    if (this.instance === null) {
      this.instance = new TreeService();
    }

    return this.instance;
  }

  generateTreeSapling(width = 100, height = 100, color = "#6E4D25") {
    const trunkWidth = width * 0.04;
    const trunkHeight = height * 0.4;
    const trunkX = width / 2 - trunkWidth / 2;
    const trunkY = height - trunkHeight;

    const branchLengthX = width * 0.2;
    const branchLengthY = height * 0.4;

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="${trunkX}" y="${trunkY}" width="${trunkWidth}" height="${trunkHeight}" fill="${color}" />
        
        <line x1="${width / 2}" y1="${trunkY}" x2="${
      width / 2 - branchLengthX
    }" y2="${trunkY - branchLengthY}" stroke="${color}" stroke-width="2" />
        
        <line x1="${width / 2}" y1="${trunkY}" x2="${
      width / 2 + branchLengthX
    }" y2="${trunkY - branchLengthY}" stroke="${color}" stroke-width="2" />
        
        <line x1="${width / 2}" y1="${trunkY}" x2="${width / 2}" y2="${
      trunkY - branchLengthY * 1.2
    }" stroke="${color}" stroke-width="2" />
      </svg>
    `;
  }
}
