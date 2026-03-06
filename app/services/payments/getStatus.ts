import httpClient from "../httpClient";

interface PaymentStatusResponse {
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

export const getPaymentStatus = async (externalReference: string): Promise<PaymentStatusResponse> => {
  const { data } = await httpClient.get(`/payments/${externalReference}/status`);
  return data;
};
