import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

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
        const ordersCollection = await getCollection("Orders");

        data = await ordersCollection.aggregate([
          {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                totalRevenue: { $sum: "$total" }, // sum of all order totals
                orderCount: { $sum: 1 }            // number of orders that day
            }
          },
          { $sort: { _id: 1 } }
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

export async function POST(req) {
  const body = await req.json();

  switch (body.action) {


    // PRODUCT ACTIONS
    case "addProduct": {
      const products = await getCollection("Products");
      await products.insertOne({
        name: body.name,
        price: body.price,
        category: body.category
      });
      return Response.json({ success: true });
    }

    case "deleteProduct": {
      const products = await getCollection("Products");
      await products.deleteOne({ _id: new ObjectId(body.id) });
      return Response.json({ success: true });
    }


    // USER ACTIONS
    case "addUser": {
      const users = await getCollection("Users");
      const hashedPassword = await bcrypt.hash(body.password, 10);

      await users.insertOne({
        email: body.email,
        password: hashedPassword,
        type: body.type
      });
      return Response.json({ success: true });
    }

    case "editUser": {
      const users = await getCollection("Users");
      const updateFields = { email: body.email, type: body.type };

      if (body.password) {
        updateFields.password = await bcrypt.hash(body.password, 10);
      }

      await users.updateOne(
        { _id: new ObjectId(body.id) },
        { $set: updateFields }
      );
      return Response.json({ success: true });
    }

    case "deleteUser": {
      const users = await getCollection("Users");
      await users.deleteOne({ _id: new ObjectId(body.id) });
      return Response.json({ success: true });
    }



    // ORDER ACTIONS
    case "addOrder": {
      const orders = await getCollection("Orders");
      await orders.insertOne({
        userId: body.userId ? new ObjectId(body.userId) : null,
        items: body.items,
        total: body.total,
        status: body.status || "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return Response.json({ success: true });
    }

    case "editOrder": {
      const orders = await getCollection("Orders");

      await orders.updateOne(
        { _id: new ObjectId(body.id) },
        {
          $set: {
            items: body.items,
            total: body.total,
            status: body.status,
            updatedAt: new Date()
          }
        }
      );

      return Response.json({ success: true });
    }

    case "deleteOrder": {
      const orders = await getCollection("Orders");
      await orders.deleteOne({ _id: new ObjectId(body.id) });
      return Response.json({ success: true });
    }

    default:
      return Response.json({ error: "Invalid action" }, { status: 400 });
  }
}
