export interface GoalType {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  dailyReminder: boolean;
  image: string;
  visibility: string;
  difficulty: string;
  tags: string[];
  treeSkin: string;
  isDone: boolean;
  profileId: string;
  images: string[];
  reactions: number;
  isPost: boolean;
  commentsIds: number[];
}
