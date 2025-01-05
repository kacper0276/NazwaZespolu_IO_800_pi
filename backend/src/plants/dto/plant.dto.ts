import { GoalType } from 'src/enums/goaltype.enum';
import { GrowthStatus } from 'src/enums/growthstatus.enum';

export type plantData = {
  id: number;
  plantType: string;
  plantName: string;
  growthStatus: GrowthStatus;
  goalType: GoalType;
};