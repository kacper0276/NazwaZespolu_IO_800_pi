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

  generateTreeWithLeaves(
    width = 200,
    height = 200,
    trunkColor = "#6E4D25",
    leafColor = "#4CAF50"
  ) {
    const trunkWidth = width * 0.08;
    const trunkHeight = height * 0.5;
    const trunkX = width / 2 - trunkWidth / 2;
    const trunkY = height - trunkHeight;

    const branchLengthX = width * 0.25;
    const branchLengthY = height * 0.4;

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="${trunkX}" y="${trunkY}" width="${trunkWidth}" height="${trunkHeight}" fill="${trunkColor}" />

        <!-- Główne gałęzie -->
        <line x1="${width / 2}" y1="${trunkY}" x2="${
      width / 2 - branchLengthX
    }" y2="${trunkY - branchLengthY}" stroke="${trunkColor}" stroke-width="4" />
        <line x1="${width / 2}" y1="${trunkY}" x2="${
      width / 2 + branchLengthX
    }" y2="${trunkY - branchLengthY}" stroke="${trunkColor}" stroke-width="4" />
        <line x1="${width / 2}" y1="${trunkY}" x2="${width / 2}" y2="${
      trunkY - branchLengthY * 1.4
    }" stroke="${trunkColor}" stroke-width="4" />
        
        <!-- Dodatkowe, mniejsze gałęzie -->
        <line x1="${width / 2 - branchLengthX / 2}" y1="${
      trunkY - branchLengthY / 2
    }" x2="${width / 2 - branchLengthX * 0.8}" y2="${
      trunkY - branchLengthY * 0.9
    }" stroke="${trunkColor}" stroke-width="2" />
        <line x1="${width / 2 + branchLengthX / 2}" y1="${
      trunkY - branchLengthY / 2
    }" x2="${width / 2 + branchLengthX * 0.8}" y2="${
      trunkY - branchLengthY * 0.9
    }" stroke="${trunkColor}" stroke-width="2" />
        <line x1="${width / 2}" y1="${trunkY - branchLengthY * 0.6}" x2="${
      width / 2 - branchLengthX * 0.5
    }" y2="${
      trunkY - branchLengthY * 1.1
    }" stroke="${trunkColor}" stroke-width="2" />
        <line x1="${width / 2}" y1="${trunkY - branchLengthY * 0.6}" x2="${
      width / 2 + branchLengthX * 0.5
    }" y2="${
      trunkY - branchLengthY * 1.1
    }" stroke="${trunkColor}" stroke-width="2" />

        <!-- Liście na końcach głównych gałęzi -->
        <circle cx="${width / 2 - branchLengthX}" cy="${
      trunkY - branchLengthY
    }" r="${width * 0.06}" fill="${leafColor}" />
        <circle cx="${width / 2 + branchLengthX}" cy="${
      trunkY - branchLengthY
    }" r="${width * 0.06}" fill="${leafColor}" />
        <circle cx="${width / 2}" cy="${trunkY - branchLengthY * 1.4}" r="${
      width * 0.07
    }" fill="${leafColor}" />

        <!-- Więcej liści na mniejszych gałęziach -->
        <circle cx="${width / 2 - branchLengthX * 0.8}" cy="${
      trunkY - branchLengthY * 0.9
    }" r="${width * 0.04}" fill="${leafColor}" />
        <circle cx="${width / 2 + branchLengthX * 0.8}" cy="${
      trunkY - branchLengthY * 0.9
    }" r="${width * 0.04}" fill="${leafColor}" />
        <circle cx="${width / 2 - branchLengthX * 0.5}" cy="${
      trunkY - branchLengthY * 1.1
    }" r="${width * 0.05}" fill="${leafColor}" />
        <circle cx="${width / 2 + branchLengthX * 0.5}" cy="${
      trunkY - branchLengthY * 1.1
    }" r="${width * 0.05}" fill="${leafColor}" />
        
        <!-- Dodatkowe liście na środkowych partiach gałęzi -->
        <circle cx="${width / 2 - branchLengthX * 0.6}" cy="${
      trunkY - branchLengthY * 0.7
    }" r="${width * 0.03}" fill="${leafColor}" />
        <circle cx="${width / 2 + branchLengthX * 0.6}" cy="${
      trunkY - branchLengthY * 0.7
    }" r="${width * 0.03}" fill="${leafColor}" />
        <circle cx="${width / 2 - branchLengthX * 0.4}" cy="${
      trunkY - branchLengthY * 0.8
    }" r="${width * 0.03}" fill="${leafColor}" />
        <circle cx="${width / 2 + branchLengthX * 0.4}" cy="${
      trunkY - branchLengthY * 0.8
    }" r="${width * 0.03}" fill="${leafColor}" />
        <circle cx="${width / 2}" cy="${trunkY - branchLengthY * 0.9}" r="${
      width * 0.04
    }" fill="${leafColor}" />
      </svg>
    `;
  }

  generateTreeWithoutLeaves(width = 200, height = 200, trunkColor = "#6E4D25") {
    const trunkWidth = width * 0.08;
    const trunkHeight = height * 0.5;
    const trunkX = width / 2 - trunkWidth / 2;
    const trunkY = height - trunkHeight;

    const branchLengthX = width * 0.25;
    const branchLengthY = height * 0.4;

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="${trunkX}" y="${trunkY}" width="${trunkWidth}" height="${trunkHeight}" fill="${trunkColor}" />

        <!-- Główne gałęzie -->
        <line x1="${width / 2}" y1="${trunkY}" x2="${
      width / 2 - branchLengthX
    }" y2="${trunkY - branchLengthY}" stroke="${trunkColor}" stroke-width="4" />
        <line x1="${width / 2}" y1="${trunkY}" x2="${
      width / 2 + branchLengthX
    }" y2="${trunkY - branchLengthY}" stroke="${trunkColor}" stroke-width="4" />
        <line x1="${width / 2}" y1="${trunkY}" x2="${width / 2}" y2="${
      trunkY - branchLengthY * 1.4
    }" stroke="${trunkColor}" stroke-width="4" />
        
        <!-- Dodatkowe, mniejsze gałęzie -->
        <line x1="${width / 2 - branchLengthX / 2}" y1="${
      trunkY - branchLengthY / 2
    }" x2="${width / 2 - branchLengthX * 0.8}" y2="${
      trunkY - branchLengthY * 0.9
    }" stroke="${trunkColor}" stroke-width="2" />
        <line x1="${width / 2 + branchLengthX / 2}" y1="${
      trunkY - branchLengthY / 2
    }" x2="${width / 2 + branchLengthX * 0.8}" y2="${
      trunkY - branchLengthY * 0.9
    }" stroke="${trunkColor}" stroke-width="2" />
        <line x1="${width / 2}" y1="${trunkY - branchLengthY * 0.6}" x2="${
      width / 2 - branchLengthX * 0.5
    }" y2="${
      trunkY - branchLengthY * 1.1
    }" stroke="${trunkColor}" stroke-width="2" />
        <line x1="${width / 2}" y1="${trunkY - branchLengthY * 0.6}" x2="${
      width / 2 + branchLengthX * 0.5
    }" y2="${
      trunkY - branchLengthY * 1.1
    }" stroke="${trunkColor}" stroke-width="2" />
      </svg>
    `;
  }
}
