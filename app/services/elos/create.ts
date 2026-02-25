import httpClient from "../httpClient";

interface CreateEloRequest {
  name: string;
  has_rank: boolean;
  position: number;
  picture: string;
  prices: { [key: string]: number };
}

export const createElo = async ({ name, has_rank, position, picture, prices }: CreateEloRequest) => {
  const { data } = await httpClient.post(`/elos`, { name, has_rank, position, picture, prices });
  return data;
};