import httpClient from "../httpClient";

export const showService = async (serviceId: string) => {
  const { data } = await httpClient.get(`/services/${serviceId}`);
  return data;
};