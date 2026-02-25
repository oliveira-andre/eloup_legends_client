import { getAllJobbers } from "./getAll";
import { showJobber } from "./show";
import { updateJobber } from "./update";
import { uploadImage } from "./image";
import { deleteJobber } from "./delete";
import { createJobber } from "./create";
import { showByUserId } from "./showByUserId";

export const jobbers = {
  getAll: getAllJobbers,
  show: showJobber,
  update: updateJobber,
  uploadImage: uploadImage,
  delete: deleteJobber,
  create: createJobber,
  showByUserId: showByUserId,
};