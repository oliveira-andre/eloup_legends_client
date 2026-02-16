import httpClient from "../httpClient";

export const deleteService = async (serviceId: string) => {
  const { data } = await httpClient.delete(`/services/${serviceId}`);
  return data;
};