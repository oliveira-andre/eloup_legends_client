import httpClient from "../httpClient";

export const showJobber = async (jobberId: string) => {
  const { data } = await httpClient.get(`/jobers/${jobberId}`);
  return data;
};