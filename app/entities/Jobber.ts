import { Elo } from "./Elo";

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
}