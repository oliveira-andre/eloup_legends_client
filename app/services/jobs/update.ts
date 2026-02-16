import httpClient from "../httpClient";

interface UpdateJobRequest {
  id: string;
  name: string;
  observation: string;
  currentRank: number;
  rank: number;
  price: number;
}

export const updateJob = async ({ id, name, observation, currentRank, rank, price }: UpdateJobRequest) => {
  const { data } = await httpClient.patch(`/jobs/${id}`, { name, observation, currentRank, rank, price });
  return data;
};