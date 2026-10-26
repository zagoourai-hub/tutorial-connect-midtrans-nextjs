import { getDatabase } from "../lib/prisma";

const database = getDatabase();
const products = [
  { id: "nextjs-course", name: "Kelas Next.js Dasar", price: 50_000, isActive: true },
  { id: "typescript-guide", name: "Panduan TypeScript", price: 25_000, isActive: true },
  { id: "inactive-product", name: "Produk tidak aktif", price: 10_000, isActive: false }
];

try {
  for (const product of products) {
    await database.product.upsert({ where: { id: product.id }, create: product, update: product });
  }
  console.info("Seed selesai; produk diperbarui tanpa menghapus order.");
} finally {
  await database.$disconnect();
}
