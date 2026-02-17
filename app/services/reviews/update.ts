import httpClient from "../httpClient";

interface UpdateReviewRequest {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  jobId: string;
}

export const updateReview = async ({ id, rating, comment, userId, jobId }: UpdateReviewRequest) => {
  const { data } = await httpClient.patch(`/reviews/${id}`, { rating, comment, userId, jobId });
  return data;
};