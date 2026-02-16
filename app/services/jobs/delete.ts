import httpClient from "../httpClient";

export const deleteJob = async (jobId: string) => {
  const { data } = await httpClient.delete(`/jobs/${jobId}`);
  return data;
};