import httpClient from "../httpClient";

interface CreatePixRequest {
  external_reference: string;
  email: string;
}

interface CreatePixResponse {
  success: boolean;
  data: {
    payment_id: string;
    status: string;
    status_detail: string;
    amount: number;
    description: string;
    external_reference: string;
    expires_at: string;
    pix: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    }
    created_at: string;
  }
}

export const createPix = async ({ external_reference, email }: CreatePixRequest): Promise<CreatePixResponse> => {
  const { data } = await httpClient.post('/payments/pix', { external_reference, email });
  return data;
};
