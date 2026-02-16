import httpClient from "../httpClient";

interface CreateServiceRequest {
  name: string;
  tagline: string;
  price: number;
  position: number;
  picture: File;
  description: string;
}

export const createService = async ({ name, tagline, price, position, picture, description }: CreateServiceRequest) => {
  const { data } = await httpClient.post(`/services`, { name, tagline, price, position, picture, description });
  return data;
};