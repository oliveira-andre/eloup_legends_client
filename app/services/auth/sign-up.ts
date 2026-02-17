import httpClient from "../httpClient";

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export const signUp = async ({ name, email, password }: SignUpRequest) => {
  const { data } = await httpClient.post('/auth/sign-up/', { name, email, password, role: 'user' });
  return data;
};