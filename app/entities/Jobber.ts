import { Elo } from "./Elo";
import { Job } from "./Job";

export interface Jobber {
  id: string;
  picture: string;
  name: string;
  rank: number;
  position: number;
  observation: string;
  createdAt: string;
  updatedAt: string;
  eloId: string;
  elo: Elo;
  jobs: Job[];
}