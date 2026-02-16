import httpClient from "../httpClient";

export const deleteJobber = async (jobberId: string) => {
  const { data } = await httpClient.delete(`/jobers/${jobberId}`);
  return data;
};