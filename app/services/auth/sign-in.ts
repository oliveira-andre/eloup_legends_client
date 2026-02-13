import httpClient from "../httpClient";

interface SignInRequest {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: SignInRequest) => {
  const { data } = await httpClient.post('/auth/sign-in/', { email, password });
  return data;
};