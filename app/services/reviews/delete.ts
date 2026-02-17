import httpClient from "../httpClient";

export const deleteReview = async (reviewId: string) => {
  const { data } = await httpClient.delete(`/reviews/${reviewId}`);
  return data;
};