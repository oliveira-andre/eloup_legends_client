import { createPix } from "./createPix";
import { getPaymentStatus } from "./getStatus";

export const payments = {
  createPix,
  getStatus: getPaymentStatus,
};
