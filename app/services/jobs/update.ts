import httpClient from "../httpClient";

interface UpdateJobRequest {
  id: string;
  name: string;
  observation: string;
  currentRank: number;
  rank: number;
  price: number;
  serviceId: string;
  status: string;
  currentEloId: string;
  targetEloId: string;
  jobberId?: string;
}

export const updateJob = async ({ id, name, observation, status, currentRank, rank, price, serviceId, currentEloId, targetEloId, jobberId }: UpdateJobRequest) => {
  const { data } = await httpClient.patch(`/jobs/${id}`, { name, observation, status, currentRank, rank, price, serviceId, currentEloId, targetEloId, joberId: jobberId ?? null });
  return data;
};