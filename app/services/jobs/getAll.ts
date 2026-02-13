import { Job } from "@/app/entities/Job";
import httpClient from "../httpClient";

export const getAllJobs = async () => {
  const { data } = await httpClient.get<Job[]>("/jobs");
  return data;
};