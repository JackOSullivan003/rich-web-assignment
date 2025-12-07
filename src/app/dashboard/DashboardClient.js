"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import Navbar from "@/components/navbar.js";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("burger");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [items, setItems] = useState([]);

  const [CATEGORIES, setCategories] = useState([]);

  // Fetch products
  async function fetchProducts() {
    const res = await fetch("/api/dashboard/");
    const json = await res.json();
    setProducts(json.products);
  }

  // Fetch weather
  async function fetchWeather() {
    try {
      setWeatherLoading(true);
      const lat = 53.3498;
      const lon = -6.2603;
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      if (data.current_weather) {
        setWeather({
          temp: data.current_weather.temperature,
          wind: data.current_weather.windspeed,
          code: data.current_weather.weathercode,
        });
      }
    } catch (err) {
      console.error("Weather fetch failed:", err);
    } finally {
      setWeatherLoading(false);
    }
  }

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart`);
      const data = await res.json();
      const cartItems = data.cart?.items || [];
      setItems(cartItems);
      const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setItems([]);
      setCartCount(0);
    }
  };

  // Add product to cart
  const addToCart = async (product) => {
  await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: product._id,
      name: product.name,
      price: product.price,
    }),
  });
  fetchCart();
};


  // Update item quantity
  const updateQuantity = async (productId, delta) => {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
      // Remove item
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
    } else {
      // Update quantity
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
    }
    fetchCart();
  };

  useEffect(() => {
    fetchProducts();
    fetchWeather();
    fetchCart();
  }, []);

useEffect(() => {
  async function loadCategories() {
    try {
      const res = await fetch("/api/dashboard");

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Dashboard API returned non-JSON", res);
        return;
      }

      const data = await res.json();

      console.log("API returned:", data);

      const products = data.products || []; 

      const uniqueCategories = [
        ...new Set(products.map(p => p.category).filter(Boolean))
      ];

      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }

  loadCategories();
}, []);


  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === filter.toLowerCase()
  );

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ alignItems: "center" }}>
        <Box
          sx={{
            background: "#FFF8E1",
            padding: 5,
            minWidth: 260,
            boxShadow: 10,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "left" }}>
            Our Menu
          </Typography>

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Weather
            </Typography>
            {weatherLoading ? (
              <Typography>Loading...</Typography>
            ) : weather ? (
              <>
                <Typography>🌡 {weather.temp}°C</Typography>
                <Typography>💨 Wind: {weather.wind} km/h</Typography>
              </>
            ) : (
              <Typography>Error loading weather</Typography>
            )}
          </Box>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FFC72C",
            color: "black",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#FDB913" },
            position: "fixed",
            right: 40,
            bottom: 80,
            zIndex: 2000,
          }}
          onClick={() => setCartOpen(true)}
        >
          Cart ({cartCount})
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          p: 1,
          backgroundColor: "#FFF8E1",
          borderBottom: "3px solid #FFC72C",
        }}
      >
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            onClick={() => setFilter(cat)}
            sx={{
              fontWeight: 700,
              color: filter === cat ? "#DA291C" : "#333",
              borderBottom: filter === cat ? "3px solid #DA291C" : "none",
              borderRadius: 0,
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.length === 0 ? (
          <Typography>No products found in this category.</Typography>
        ) : (
          filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card
                sx={{
                  borderRadius: 4,
                  padding: 2,
                  backgroundColor: "#FFF8E1",
                  boxShadow: "0px 4px 18px rgba(0,0,0,0.15)",
                }}
              >
                {product.image && (
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 2, mb: 2 }}
                  />
                )}

                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {product.name}
                  </Typography>
              
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
                    {product.category}
                  </Typography>
              
                  {product.description && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {product.description}
                    </Typography>
                  )}

                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#DA291C" }}>
                    €{product.price.toFixed(2)}
                  </Typography>
                
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#FFC72C",
                      color: "black",
                      fontWeight: 700,
                      "&:hover": { backgroundColor: "#FDB913" },
                      mt: 1,
                    }}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {cartOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#FFF8E1",
            zIndex: 3000,
            p: 3,
            overflowY: "auto",
          }}
        >
          <Button
            onClick={() => {setCartOpen(false); fetchCart();}}
            sx={{
              position: "absolute",
              top: 16,
              left: 32,
              minWidth: "auto",
              padding: 0,
              fontSize: 36,
              fontWeight: 600,
            }}
          >
            X
          </Button>
          
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "center", mb: 3 }}>
            Your Cart
          </Typography>
          
          {items.length === 0 ? (
            <Typography sx={{ textAlign: "center", mt: 10 }}>No items in cart.</Typography>
          ) : (
            <Box>
              {items.map((item) => (
                <Box
                  key={item.productId}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#FFF2CC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                    <Typography>€{(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton size="small" onClick={() => updateQuantity(item.productId, -1)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.productId, 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}

              <Typography sx={{ fontWeight: 700, mt: 4, fontSize: 18 }}>
                Total: €{totalPrice.toFixed(2)}
              </Typography>
            
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  backgroundColor: "#DA291C",
                  "&:hover": { backgroundColor: "#B71C1C" },
                }}
                onClick={() => window.location.href = `/checkout`}
              >
                Checkout
              </Button>
            </Box>
          )}
        </Box>
      )}


      <Navbar />
    </Container>
  );
}
