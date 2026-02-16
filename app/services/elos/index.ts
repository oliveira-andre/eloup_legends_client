import { getAllElo } from "./getAll";
import { showElo } from "./show";
import { updateElo } from "./update";
import { uploadImage } from "./uploadImage";
import { deleteElo } from "./delete";
import { createElo } from "./create";

export const elos = {
  getAll: getAllElo,
  show: showElo,
  update: updateElo,
  uploadImage: uploadImage,
  delete: deleteElo,
  create: createElo,
};