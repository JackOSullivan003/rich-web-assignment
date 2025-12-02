"use client";

import { useState, useEffect } from "react";
import { Container, Card, Typography, Button, Grid, Box } from "@mui/material";
import {  Table,  TableBody,  TableCell,  TableContainer,  TableHead,  TableRow,  Paper} from "@mui/material";
import Script from "next/script";
import Navbar from "@/components/navbar";

export default function ManagerDashboard() {
  const [activeSection, setActiveSection] = useState(""); // which section to show
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  // Fetch data when a section is activated
    useEffect(() => {
      if (!activeSection) return;

      fetch(`/api/manager?section=${activeSection}`)
        .then(res => res.json())
        .then(json => {
          if (activeSection === "graph") setChartData({
            labels: json.data.map(item => item._id),
            values: json.data.map(item => item.totalOrders),
          });
          else if (activeSection === "orders") setOrders(json.data);
          else if (activeSection === "products") setProducts(json.data);
          else if (activeSection === "users") setUsers(json.data);
        });
    }, [activeSection]);

  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, marginBottom: 3, textAlign: "center" }}>
        Manager Dashboard
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {["graph", "orders", "products", "users"].map(section => (
          <Grid item xs={12} sm={3} key={section}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: section === "graph" || section === "products" ? "#FFC72C" : "#DA291C",
                color: section === "graph" || section === "products" ? "#27251F" : "#FFF8E1",
                fontWeight: 700,
                paddingY: 1.5,
                ":hover": { backgroundColor: section === "graph" || section === "products" ? "#e6b526" : "#b8241f" },
              }}
              onClick={() => setActiveSection(section)}
            >
              {section === "graph" ? "Graph Data" :
               section === "orders" ? "Manage Orders" :
               section === "products" ? "Manage Products" :
               "View Users"}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: 4 }}>
        {activeSection === "graph" && (
          <Card sx={{ padding: 3, borderRadius: 4, backgroundColor: "#FFF8E1", boxShadow: "0px 4px 15px rgba(0,0,0,0.25)" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 3 }}>
              Orders Over Time
            </Typography>

            <canvas id="salesChart" width="400" height="200"></canvas>

            <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="afterInteractive" />

            <Script id="chart-setup" strategy="afterInteractive">
              {`
                window.go = function() {
                  const ctx = document.getElementById('salesChart');
                  if (!ctx) return;

                  new Chart(ctx, {
                    type: 'line',
                    data: {
                      labels: ${JSON.stringify(chartData.labels)},
                      datasets: [{
                        label: "Orders Per Day",
                        data: ${JSON.stringify(chartData.values)},
                        borderColor: "#DA291C",
                        backgroundColor: "rgba(218,41,28,0.3)",
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 5
                      }]
                    },
                    options: {
                      responsive: true,
                      scales: { y: { beginAtZero: true } }
                    }
                  });
                }
              `}
            </Script>
          </Card>
        )}

        {activeSection === "orders" && (
          <Card sx={{ padding: 3, borderRadius: 4, backgroundColor: "#FFF8E1", boxShadow: "0px 4px 15px rgba(0,0,0,0.25)" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2 }}>
              Orders
            </Typography>
            {orders.length === 0 ? <Typography>No orders found.</Typography> :
              orders.map(order => (
                <Box key={order._id} sx={{ padding: 1, borderBottom: "1px solid #ccc" }}>
                  <Typography>User: {order.userId} | Product: {order.productId} | Total: ${order.total}</Typography>
                </Box>
              ))}
          </Card>
        )}

        {activeSection === "products" && (
          <Card sx={{ padding: 3, borderRadius: 4, backgroundColor: "#FFF8E1", boxShadow: "0px 4px 15px rgba(0,0,0,0.25)" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2 }}>
              Products
            </Typography>
            {products.length === 0 ? <Typography>No products found.</Typography> :
              products.map(product => (
                <Box key={product._id} sx={{ padding: 1, borderBottom: "1px solid #ccc" }}>
                  <Typography>{product.name} — ${product.price}</Typography>
                </Box>
              ))}
          </Card>
        )}

        {activeSection === "users" && (
          <Card sx={{ padding: 3, borderRadius: 4, backgroundColor: "#FFF8E1", boxShadow: "0px 4px 15px rgba(0,0,0,0.25)" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2 }}>
              Users
            </Typography>
        
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#FFC72C" }}>
                  <TableRow>
                    <TableCell sx={{fontWeight: 800}}>Email</TableCell>
                    <TableCell sx={{fontWeight: 800}}>Type</TableCell>
                  </TableRow>
                </TableHead>
        
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.type}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
        </Box>
        <Navbar />
    </Container>
  );
}
