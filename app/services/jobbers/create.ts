import httpClient from "../httpClient";

interface CreateJobberRequest {
  name: string;
  email: string;
  password: string;
  rank: number;
  position: number;
  observation: string;
  eloId: string;
  file: File;
}

export const createJobber = async ({ name, email, password, rank, position, observation, eloId, file }: CreateJobberRequest) => {
  await httpClient.post(`/auth/sign-up`, { name, email, password, role: 'jobber' });
  const { data } = await httpClient.post(`/jobers`, { name, rank, position, observation, eloId, file });
  return data;
};