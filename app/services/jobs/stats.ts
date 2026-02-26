import httpClient from "../httpClient";

export const stats = async () => {
  const { data } = await httpClient.get(`/jobs/stats`);
  return data;
};