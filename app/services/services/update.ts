import httpClient from "../httpClient";

interface UpdateServiceRequest {
  id: string;
  name: string;
  tagline: string;
  price: number;
  position: number;
  picture: File;
  description: string;
}

export const updateService = async ({ id, name, tagline, price, position, picture, description }: UpdateServiceRequest) => {
  const { data } = await httpClient.put(`/services/${id}`, { name, tagline, price, position, picture, description });
  return data;
};