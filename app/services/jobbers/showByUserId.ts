import httpClient from "../httpClient";

export const showByUserId = async (userId: string) => {
  const { data } = await httpClient.get(`/jobers/user/${userId}`);
  return data;
};