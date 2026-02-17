import httpClient from "../httpClient";

export const showReview = async (reviewId: string) => {
  const { data } = await httpClient.get(`/reviews/${reviewId}`);
  return data;
};