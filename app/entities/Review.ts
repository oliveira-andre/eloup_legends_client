import { Job } from './Job';
import { User } from './User';

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  jobId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  job: Job;
}
