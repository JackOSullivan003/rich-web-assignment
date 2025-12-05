import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const productsCollection = await getCollection("Products");

    const products = await productsCollection.find().toArray();

    return Response.json({ products });
  } catch (error) {
    console.error("Products API error:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}