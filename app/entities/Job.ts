import { Elo } from './Elo'
import { Service } from './Service'

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
}