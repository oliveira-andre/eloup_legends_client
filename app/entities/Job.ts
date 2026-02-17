import { Elo } from './Elo'
import { Jobber } from './Jobber';
import { Service } from './Service'
import { User } from './User';

export interface Job {
  id: string;
  name: string;
  observation: string;
  currentRank: number;
  rank: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  serviceId: string;
  currentEloId: string;
  targetEloId: string;
  service: Service;
  currentElo: Elo;
  targetElo: Elo;
  user: User;
  jobber: Jobber;
}