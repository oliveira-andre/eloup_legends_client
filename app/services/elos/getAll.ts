import { Elo } from "@/app/entities/Elo";
import httpClient from "../httpClient";

export const getAllElo = async () => {
  const { data } = await httpClient.get<Elo[]>("/elos");
  return data;
};