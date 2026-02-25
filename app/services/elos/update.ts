import httpClient from "../httpClient";

interface UpdateEloRequest {
  id: string;
  name: string;
  has_rank: boolean;
  position: number;
  picture: string;
  prices: { [key: string]: number };
}

export const updateElo = async ({ id, name, has_rank, position, picture, prices }: UpdateEloRequest) => {
  const { data } = await httpClient.patch(`/elos/${id}`, { name, has_rank, position, picture, prices });
  return data;
};