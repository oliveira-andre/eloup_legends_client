import httpClient from "../httpClient";

interface CreateReviewRequest {
  rating: number;
  comment: string;
  userId: string;
  jobId: string;
}

export const createReview = async ({ rating, comment, userId, jobId }: CreateReviewRequest) => {
  const { data } = await httpClient.post(`/reviews`, { rating, comment, userId, jobId });
  return data;
};