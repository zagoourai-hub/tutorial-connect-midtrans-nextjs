import "server-only";
import { readEnvironment } from "./env";
import { createMidtransGateway } from "./midtrans";
import { getDatabase } from "./prisma";

export function getPaymentRuntime() {
  const environment = readEnvironment();
  return { database: getDatabase(), gateway: createMidtransGateway(environment), environment };
}
