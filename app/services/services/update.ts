import httpClient from "../httpClient";

interface UpdateServiceRequest {
  id: string;
  name: string;
  tagline: string;
  price: number;
  position: number;
  picture: string;
  description: string;
}

export const updateService = async ({ id, name, tagline, price, position, picture, description }: UpdateServiceRequest) => {
  const { data } = await httpClient.patch(`/services/${id}`, { name, tagline, price, position, picture, description });
  return data;
};