export class PaymentError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly retryAfter?: number
  ) {
    super(message);
  }
}

export function invalidRequest(message = "Payload tidak valid"): never {
  throw new PaymentError(400, "INVALID_REQUEST", message);
}
