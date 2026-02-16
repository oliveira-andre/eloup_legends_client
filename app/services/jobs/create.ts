import httpClient from "../httpClient";

interface CreateJobRequest {
  name: string;
  observation: string;
  currentRank: number;
  rank: number;
  price: number;
  serviceId: string;
  currentEloId: string;
  targetEloId: string;
}

export const createJob = async ({ name, observation, currentRank, rank, price, serviceId, currentEloId, targetEloId }: CreateJobRequest) => {
  const { data } = await httpClient.post(`/jobs`, { name, observation, currentRank, rank, price, serviceId, currentEloId, targetEloId });
  return data;
};