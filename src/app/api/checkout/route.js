import { getCollection } from "@/lib/mongodb";

export async function POST(req) {
    const data = await req.json();
    const orders = await getCollection("Orders");

    const order = {
      userId: data.userId,
      userEmail: data.userEmail,
      items: data.items,
      total: data.total,
      address: data.address,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await orders.insertOne(order);
    
    const cart = await getCollection("Cart");
    await cart.updateOne(
        { userId: data.userId },
        { $set: { items: [] } }
      );

    return Response.json({
      success: true,
      order 
    });
}
