import httpClient from "../httpClient";

export const deleteElo = async (eloId: string) => {
  const { data } = await httpClient.delete(`/elos/${eloId}`);
  return data;
};