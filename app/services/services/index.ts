import { getAllServices } from "./getAll";
import { showService } from "./show";
import { updateService } from "./update";
import { deleteService } from "./delete";
import { createService } from "./create";

export const services = {
  getAll: getAllServices,
  show: showService,
  update: updateService,
  delete: deleteService,
  create: createService,
};