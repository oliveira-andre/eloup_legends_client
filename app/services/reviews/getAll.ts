import httpClient from "../httpClient";

export const getAllReviews = async () => {
  const { data } = await httpClient.get('/reviews');
  return data;
};