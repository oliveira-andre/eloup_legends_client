import { getAllReviews } from "./getAll";
import { showReview } from "./show";
import { updateReview } from "./update";
import { deleteReview } from "./delete";
import { createReview } from "./create";

export const reviews = {
  getAll: getAllReviews,
  show: showReview,
  update: updateReview,
  delete: deleteReview,
  create: createReview,
};