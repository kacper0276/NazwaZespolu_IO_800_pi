export interface ProfileType {
  _id: string;
  currentGoals: string[];
  completedGoals: string[];
  goalDescription: string;
  followers: string[];
  following: string[];
  posts: number[];
  premium: boolean;
  userId: string;
}
