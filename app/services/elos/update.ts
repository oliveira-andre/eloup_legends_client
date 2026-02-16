import httpClient from "../httpClient";

interface UpdateEloRequest {
  id: string;
  name: string;
  has_rank: boolean;
  position: number;
  picture: string;
}

export const updateElo = async ({ id, name, has_rank, position, picture }: UpdateEloRequest) => {
  const { data } = await httpClient.put(`/elos/${id}`, { name, has_rank, position, picture });
  return data;
};