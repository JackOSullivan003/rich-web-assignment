"use server";

import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const productsCollection = await getCollection("Products");

    if (!productsCollection) {
      throw new Error("Products collection could not be loaded.");
    }

    const products = await productsCollection.find({}).toArray();

    return new Response(JSON.stringify({ products }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Products API error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch products", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
