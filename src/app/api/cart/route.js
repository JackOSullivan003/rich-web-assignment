import { getCollection } from "@/lib/mongodb";

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("id");

  if (!userId) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const cartCollection = await getCollection("Cart");

  let cart = await cartCollection.findOne({ userId });

  // create temp cart if none exists
  if (!cart) {
    cart = {
      userId,
      items: [],
      createdAt: new Date(),
    };
    await cartCollection.insertOne(cart);
  }

  return Response.json({ success: true, cart });
}

export async function POST(req) {
  const { userId, productId, name, price, quantity = 1 } = await req.json();

  if (!userId || !productId || !name || price == null) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const cartCollection = await getCollection("Cart");

  let cart = await cartCollection.findOne({ userId });

  if (!cart) {
    cart = { userId, items: [], createdAt: new Date() };
    await cartCollection.insertOne(cart);
  }

  const existing = cart.items.find((i) => i.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, name, price, quantity });
  }

  await cartCollection.updateOne({ userId }, { $set: { items: cart.items } });

  return Response.json({ success: true, cart });
}

export async function PATCH(req) {
  const { userId, productId, quantity } = await req.json();

  if (!userId || !productId || quantity == null) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const cartCollection = await getCollection("Cart");

  const cart = await cartCollection.findOne({ userId });
  if (!cart) return Response.json({ error: "Cart not found" }, { status: 404 });

  const item = cart.items.find((i) => i.productId === productId);
  if (!item) return Response.json({ error: "Item not found" }, { status: 404 });

  if (quantity <= 0) {
    await cartCollection.updateOne(
      { userId },
      { $pull: { items: { productId } } }
    );
  } else {
    item.quantity = quantity;
    await cartCollection.updateOne(
      { userId },
      { $set: { items: cart.items } }
    );
  }

  return Response.json({ success: true });
}

export async function DELETE(req) {
  const { userId, productId } = await req.json();

  if (!userId || !productId) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const cartCollection = await getCollection("Cart");

  await cartCollection.updateOne(
    { userId },
    { $pull: { items: { productId } } }
  );

  return Response.json({ success: true });
}
