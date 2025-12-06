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
} from "@mui/material";
import Navbar from "@/components/navbar.js";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("burger");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const CATEGORIES = ["burger", "side", "drink", "dessert"];

  // Fetch products
  async function fetchProducts() {
    const res = await fetch("/api/dashboard/");
    const json = await res.json();
    setProducts(json.products);
  }

  // Fetch weather using OpenWeatherMap API
  async function fetchWeather() {
    try {
      setWeatherLoading(true);

      // Pick your location — example: Dublin
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

  useEffect(() => {
    fetchProducts();
    fetchWeather();
  }, []);

  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === filter.toLowerCase()
  );

  return (
    <Container sx={{ mt: 4, mb: 6 }}>

    <Box
      sx={{
        alignItems: "center",
      }}
    >

      <Box
        sx={{
          background: "#FFF8E1",
          padding: 5,
          minWidth: 260,
          boxShadow: 10,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign:"left"}}>
          Our Menu
        </Typography>
      
      
      <Box sx={{ textAlign:"right" }}>
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
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {product.name}
                  </Typography>

                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {product.category}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#DA291C" }}
                  >
                    €{product.price.toFixed(2)}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#FFC72C",
                        color: "black",
                        fontWeight: 700,
                        "&:hover": { backgroundColor: "#FDB913" },
                      }}
                      onClick={() =>
                        console.log("Add to cart clicked:", product.name)
                      }
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Navbar />
    </Container>
  );
}
