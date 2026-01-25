import { Service } from "@/app/entities/Service";
import httpClient from "../httpClient";

export const getAllServices = async () => {
  const { data } = await httpClient.get<Service[]>("/services");
  return data;
};