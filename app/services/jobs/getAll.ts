import { Job } from "@/app/entities/Job";
import httpClient from "../httpClient";

interface jobsParams {
  userId?: string;
  jobberId?: string;
}

export const getAllJobs = async ({ userId, jobberId }: jobsParams) => {
  if (userId) {
    const { data } = await httpClient.get<Job[]>(`/jobs?userId=${userId}`);
    return data;
  }
  if (jobberId) {
    const { data } = await httpClient.get<Job[]>(`/jobs?joberId=${jobberId}`);
    return data;
  }

  const { data } = await httpClient.get<Job[]>("/jobs");
  return data;
};