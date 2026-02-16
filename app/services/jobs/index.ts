import { getAllJobs } from "./getAll";
import { showJob } from "./show";
import { updateJob } from "./update";
import { deleteJob } from "./delete";
import { createJob } from "./create";

export const jobs = {
  getAll: getAllJobs,
  show: showJob,
  update: updateJob,
  delete: deleteJob,
  create: createJob,
};