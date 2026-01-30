// app/page.tsx
import { ProductList } from "@/components/product-list";
import { Suspense } from "react";

async function getActiveMenuData() {
  // This is a placeholder for the actual API call logic
  // In a real implementation, this would fetch from /api/horarios, then products
  console.log("Fetching active menu data from the API...");
  // This would return real data from Supabase
  return { products: [] }; 
}

export default async function Home() {
  const data = await getActiveMenuData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Nosso Cardápio</h1>
      <Suspense fallback={<p>Carregando produtos...</p>}>
        <ProductList products={data.products} />
      </Suspense>
    </main>
  );
}
