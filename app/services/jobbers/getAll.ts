import { Jobber } from "@/app/entities/Jobber";
import httpClient from "../httpClient";

export const getAllJobbers = async () => {
  const { data } = await httpClient.get<Jobber[]>("/jobers");
  return data;
};