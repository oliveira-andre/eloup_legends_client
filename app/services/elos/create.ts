import httpClient from "../httpClient";

interface CreateEloRequest {
  name: string;
  has_rank: boolean;
  position: number;
  picture: string;
}

export const createElo = async ({ name, has_rank, position, picture }: CreateEloRequest) => {
  const { data } = await httpClient.post(`/elos`, { name, has_rank, position, picture });
  return data;
};