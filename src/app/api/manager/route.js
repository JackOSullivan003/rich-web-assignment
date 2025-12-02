import { getCollection } from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    let data = [];

    switch (section) {
      case "orders":
        data = await (await getCollection("Orders")).find().toArray();
        break;

      case "products":
        data = await (await getCollection("Products")).find().toArray();
        break;

      case "users":
        data = await (await getCollection("Users")).find().toArray();
        break;

      case "graph":
        // Aggregate total orders by day for Chart.js
        const ordersCollection = await getCollection("Orders");
        data = await ordersCollection.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              totalOrders: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]).toArray();
        break;

      default:
        return Response.json({ error: "Invalid section" }, { status: 400 });
    }

    return Response.json({ data });
  } catch (err) {
    console.error("Manager API error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
