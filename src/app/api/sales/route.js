import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getCollection("Orders");

    // Group total number of orders by date
    const pipeline = [
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const results = await collection.aggregate(pipeline).toArray();

    return Response.json({ data: results });

  } catch (err) {
    console.error("Orders API error:", err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}
