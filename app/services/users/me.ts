import httpClient from "../httpClient";

interface GetMeResponse {
  name: string;
  email: string;
  role?: string;
  id?: string;
}
export const getMe = async () => {
  const token = localStorage.getItem('token');
  httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  if (!token) {
    throw new Error('Token not found');
  }

  const { data } = await httpClient.get<GetMeResponse>('/users/me');
  return data;
};