export interface TriagePayment {
  id: string;
  mpesaRef: string;
  phone: string;
  amount: number;
  receivedAt: string;
  reason: string;
}
