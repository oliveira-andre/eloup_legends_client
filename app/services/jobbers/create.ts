import httpClient from "../httpClient";

interface CreateJobberRequest {
  name: string;
  email: string;
  password: string;
  rank: number;
  position: number;
  observation: string;
  eloId: string;
  file: string;
  userId?: string;
}

export const createJobber = async ({ name, email, password, rank, position, observation, eloId, file, userId }: CreateJobberRequest) => {
  await httpClient.post(`/auth/sign-up`, { name, email, password, role: 'jober' });
  const { data } = await httpClient.post(`/jobers`, { name, rank, position, observation, eloId, file, userId: userId ?? null });
  return data;
};
