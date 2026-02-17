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
  jobberId?: string;
  userId?: string;
}

export const createJob = async ({ name, observation, currentRank, rank, price, serviceId, currentEloId, targetEloId, jobberId, userId }: CreateJobRequest) => {
  const { data } = await httpClient.post(`/jobs`, { name, observation, currentRank, rank, price, serviceId, currentEloId, targetEloId, jobberId: jobberId ?? null, userId: userId ?? null, status: 'pending' });
  return data;
};