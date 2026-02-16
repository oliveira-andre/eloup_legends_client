import httpClient from "../httpClient";

export const showElo = async (eloId: string) => {
  const { data } = await httpClient.get(`/elos/${eloId}`);
  return data;
};