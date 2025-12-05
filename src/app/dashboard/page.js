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
  const [filter, setFilter] = useState("all");
  const filteredProducts = filter === "all" ? products : products.filter((p) => p.category.toLowerCase() === filter.toLowerCase());
              
  async function fetchProducts() {
    const res = await fetch('api/dashboard/');
    const json = await res.json();
    setProducts(json.products);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Our Menu
      </Typography>  

      <Box sx={{ mb: 3 }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            border: "2px solid #FFC72C",
          }}
        >
          <option value="all">All Categories</option>
          <option value="burger">Burgers</option>
          <option value="side">Sides</option>
          <option value="drink">Drinks</option>
          <option value="dessert">Desserts</option>
        </select>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.length === 0 ? (
          <Typography>No products available.</Typography>
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
                    sx={{ mt: 1, fontWeight: 700, color: "#DA291C" }}
                  >
                    €{product.price.toFixed(2)}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
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
                        console.log("Add to cart clicked:", product._id)
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
      < Navbar />
    </Container>
  );
}
