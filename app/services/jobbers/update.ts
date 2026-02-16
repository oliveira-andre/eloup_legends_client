import httpClient from "../httpClient";

interface UpdateJobberRequest {
  id: string;
  name: string;
  rank: number;
  position: number;
  observation: string;
  eloId: string;
  file: string;
}

export const updateJobber = async ({ id, name, rank, position, observation, eloId, file }: UpdateJobberRequest) => {
  const { data } = await httpClient.patch(`/jobers/${id}`, { name, rank, position, observation, eloId, file });
  return data;
};