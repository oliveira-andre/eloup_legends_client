import httpClient from "../httpClient";

export const showJob = async (jobId: string) => {
  const { data } = await httpClient.get(`/jobs/${jobId}`);
  return data;
};