import httpClient from "../httpClient";

interface UploadImageRequest {
  id: string;
  file: File;
}

export const uploadImage = async ({ id, file }: UploadImageRequest) => {
  const { data } = await httpClient.post(`/elos/${id}/image`, { file });
  return data;
};