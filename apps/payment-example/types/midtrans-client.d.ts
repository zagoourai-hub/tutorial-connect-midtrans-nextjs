declare module "midtrans-client" {
  type SnapClient = {
    httpClient: { http_client: { defaults: { timeout: number; maxRedirects: number } } };
    createTransaction(parameters: unknown): Promise<unknown>;
    transaction: { status(orderId: string): Promise<unknown>; notification(notification: unknown): Promise<unknown> };
  }
  const midtrans: { Snap: new(options: { isProduction: boolean; serverKey: string; clientKey: string }) => SnapClient };
  export default midtrans;
}
