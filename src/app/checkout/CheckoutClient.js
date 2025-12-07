"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";

export default function CheckoutPage() {
  const params = useSearchParams();
  const userId = params.get("id");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake form state
  const [userEmail, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [processing, setProcessing] = useState(false);

  const DELIVERY_FEE = 3.5;

  // Fetch cart
  useEffect(() => {
    if (!userId) return;

    async function loadCart() {
      const res = await fetch(`/api/cart?id=${userId}`);
      const data = await res.json();
      setItems(data.cart?.items || []);
      setLoading(false);
    }

    loadCart();
  }, [userId]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + DELIVERY_FEE;

  // Fake order submit
  async function handleFakePayment() {
    if (!address || !cardNum || !userEmail) {
      alert("Please fill all fields.");
      return;
    }

    setProcessing(true);

    // Fake 1-second payment delay
    setTimeout(async () => {
      const order = {
        userId,
        items,
        total,
        name,
        address,
        createdAt: new Date(),
      };

      // Send to database
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      alert("Payment successful! Order placed.");

      window.location.href =`/dashboard?id=${userId}`; // go back
    }, 1000);
  }

  if (loading) return <Typography>Loading checkout...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Checkout
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Order Summary
          </Typography>

          {items.map((item) => (
            <Box
              key={item.productId}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>
                {item.name} × {item.quantity}
              </Typography>
              <Typography>€{(item.price * item.quantity).toFixed(2)}</Typography>
            </Box>
          ))}

          <Box sx={{ mt: 2, borderTop: "1px solid #ccc", pt: 2 }}>
            <Typography>Subtotal: €{subtotal.toFixed(2)}</Typography>
            <Typography>Delivery Fee: €{DELIVERY_FEE.toFixed(2)}</Typography>
            <Typography
              sx={{ fontWeight: 700, mt: 1, fontSize: 18 }}
            >
              Total: €{total.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Delivery Information
          </Typography>

          <TextField
            label="Email"
            autoComplete="email"
            fullWidth
            sx={{ mb: 2 }}
            value={userEmail}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Delivery Address"
            fullWidth
            sx={{ mb: 2 }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Payment (FAKE)
          </Typography>

          <TextField
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            fullWidth
            sx={{ mb: 2 }}
            value={cardNum}
            onChange={(e) => setCardNum(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#DA291C",
              "&:hover": { backgroundColor: "#B71C1C" },
            }}
            disabled={processing}
            onClick={handleFakePayment}
          >
            {processing ? "Processing..." : "Pay Now (Fake)"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
