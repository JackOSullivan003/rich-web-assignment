import { getCollection } from "@/lib/mongodb";

// Ensure we always have exactly ONE global cart
async function getOrCreateCart() {
  const Cart = await getCollection("Cart");
  let cart = await Cart.findOne({});

  if (!cart) {
    const newCart = {
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Cart.insertOne(newCart);
    cart = await Cart.findOne({ _id: result.insertedId });
  }

  return cart;
}

// GET – return global cart
export async function GET() {
  const Cart = await getCollection("Cart");
  const cart = await getOrCreateCart();

  return Response.json({ cart });
}

// POST – add item or increment quantity
export async function POST(request) {
  const Cart = await getCollection("Cart");
  const body = await request.json();

  const { productId, name, price } = body;

  let cart = await getOrCreateCart();

  const existing = cart.items.find((i) => i.productId === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({
      productId,
      name,
      price,
      quantity: 1,
    });
  }

  await Cart.updateOne(
    { _id: cart._id },
    {
      $set: {
        items: cart.items,
        updatedAt: new Date(),
      },
    }
  );

  return Response.json({ cart });
}

// PATCH – update quantity
export async function PATCH(request) {
  const Cart = await getCollection("Cart");
  const { productId, quantity } = await request.json();

  let cart = await getOrCreateCart();

  cart.items = cart.items.map((item) =>
    item.productId === productId ? { ...item, quantity } : item
  );

  await Cart.updateOne(
    { _id: cart._id },
    {
      $set: {
        items: cart.items,
        updatedAt: new Date(),
      },
    }
  );

  return Response.json({ cart });
}

// DELETE – remove item
export async function DELETE(request) {
  const Cart = await getCollection("Cart");
  const { productId } = await request.json();

  let cart = await getOrCreateCart();

  cart.items = cart.items.filter((i) => i.productId !== productId);

  await Cart.updateOne(
    { _id: cart._id },
    {
      $set: {
        items: cart.items,
        updatedAt: new Date(),
      },
    }
  );

  return Response.json({ cart });
}
