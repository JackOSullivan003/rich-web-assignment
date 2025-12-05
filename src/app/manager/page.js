"use client";

import { useState, useEffect, useRef } from "react";
import {
  Container, Card, Typography, Button, Grid, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Modal, TextField
} from "@mui/material";
import Navbar from "@/components/navbar";
import { useManagerActions } from "@/components/manage";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import MenuItem from '@mui/material/MenuItem';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";

// Register necessary Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

export default function ManagerDashboard() {
  const [activeSection, setActiveSection] = useState(""); 
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [products, setProducts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const manager = useManagerActions({
    fetchUsers: () => fetchUsers(),
    fetchProducts: () => fetchProducts(),
    fetchOrders: () => fetchOrders(),
  });

  async function fetchProducts() {
    const res = await fetch("/api/manager?section=products");
    const json = await res.json();
    setProducts(json.data);
  }

  async function fetchUsers() {
    const res = await fetch("/api/manager?section=users");
    const json = await res.json();
    setUsers(json.data);
  }

  async function fetchOrders() {
    const res = await fetch("/api/manager?section=orders");
    const json = await res.json();
    setOrders(json.data);
  }

  // Fetch data when a section is activated
  useEffect(() => {
    if (!activeSection) return;

    fetch(`/api/manager?section=${activeSection}`)
      .then(res => res.json())
      .then(json => {
        if (activeSection === "graph") {
          setChartData({
            labels: json.data.map(item => item._id),
            values: json.data.map(item => item.totalRevenue),
          });
        } else if (activeSection === "orders") setOrders(json.data);
        else if (activeSection === "products") setProducts(json.data);
        else if (activeSection === "users") setUsers(json.data);
      });
  }, [activeSection]);

  // Render/update chart when chartData changes
  useEffect(() => {
    if (!chartRef.current || chartData.labels.length === 0) return;

    // Destroy previous chart instance if exists
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Total Revenue (€)",
            data: chartData.values,
            borderColor: "#DA291C",
            backgroundColor: "rgba(218,41,28,0.3)",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Revenue (€)" } },
          x: { title: { display: true, text: "Date" } },
        },
      },
    });
  }, [chartData]);

  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, marginBottom: 3, textAlign: "center" }}>
        Manager Dashboard
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {["graph", "orders", "products", "users"].map(section => (
          <Grid size={{xs:12, sm: 3}} key={section}>
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
            <canvas ref={chartRef} width="400" height="200" />
          </Card>
        )}


        {activeSection === "orders" && (
          <Card
            sx={{
              padding: 3,
              borderRadius: 4,
              backgroundColor: "#FFF8E1",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.25)"
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2 }}>
              Orders
            </Typography>
          
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#FFC72C" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>User Email</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Items</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Total (€)</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Created</TableCell>
                  </TableRow>
                </TableHead>
          
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>{order.userEmail}</TableCell>
                    
                        <TableCell>
                          {order.items.map((item, i) => (
                            <Typography key={i} sx={{ fontSize: "14px" }}>
                              {item.quantity}× {item.name} (€{item.price})
                            </Typography>
                          ))}
                        </TableCell>
                        
                        <TableCell>€{order.total.toFixed(2)}</TableCell>
                        
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {order.status}
                        </TableCell>
                        
                        <TableCell>
                          {new Date(order.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}


        {activeSection === "products" && (
          <Card
            sx={{
              padding: 3,
              borderRadius: 4,
              backgroundColor: "#FFF8E1",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.25)"
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2 }}>
              Products
            </Typography>
            
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#DA291C", ":hover": { backgroundColor: "#b71d17" } }}
                onClick={() => setShowAddProduct(true)}
              >
                Add Product
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#FFC72C" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Price (€)</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
          
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product._id} hover>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>€{product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => console.log("Edit feature coming soon!")}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error"
                            onClick={() => {
                              setProductToDelete(product);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      
      <Modal
        open={manager.showAddProduct}
        onClose={() => manager.setShowAddProduct(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(3px)"
        }}
      >
        <Card
          sx={{
            padding: 4,
            minWidth: 400,
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Add New Product
          </Typography>
      
          <Box
            component="form"
            onSubmit={manager.handleAddProduct}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Product Name"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <TextField
              label="Price (€)"
              type="number"
              required
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />

            <TextField
              label="Category"
              required
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAddProduct(false)}
              >
                Cancel
              </Button>
      
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#DA291C" }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Card>
      </Modal>
      
      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        >
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 3,
            boxShadow: 24,
            width: 350,
          }}>
            <Typography variant="h6" fontWeight={700}>
              Delete product?
            </Typography>
        
            <Typography sx={{ mt: 2 }}>
              Are you sure you want to delete <b>{productToDelete?.name}</b>?
            </Typography>
        
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              <Button onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
        
              <Button 
                variant="contained" 
                color="error"
                onClick={async () => {
                  await handleDeleteProduct(productToDelete._id);
                  setShowDeleteConfirm(false);
                
                  setSnackbarMessage("Product deleted successfully.");
                  setShowSnackbar(true);
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
      </Modal>

        {activeSection === "users" && (
          <Card sx={{ padding: 3, borderRadius: 4, backgroundColor: "#FFF8E1", boxShadow: "0px 4px 15px rgba(0,0,0,0.25)" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2 }}>
              Users
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#DA291C" }}
                onClick={() => manager.setShowAddUser(true)}
              >
                Add User
              </Button>
            </Box>


            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#FFC72C" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.type}</TableCell>
                  
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            manager.setUserToEdit(user);
                            manager.setShowEditUser(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        
                        <IconButton
                          color="error"
                          onClick={() => {
                            manager.setUserToDelete(user);
                            manager.setShowDeleteUser(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                        
                    </TableRow>
                  ))
                )}
              </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        <Modal open={manager.showAddUser} onClose={() => manager.setShowAddUser(false)}>
          <Card sx={{ p: 4, mx: "auto", mt: "15vh", width: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Add New User
            </Typography>

            <Box component="form" onSubmit={(e) => {    e.preventDefault();    manager.handleAddUser(manager.newUserEmail, manager.newUserPassword, manager.newUserType);  }}  sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="Email" required value={manager.newUserEmail} onChange={e => manager.setNewUserEmail(e.target.value)} />
              <TextField label="Password" type="password" required value={manager.newUserPassword} onChange={e => manager.setNewUserPassword(e.target.value)} />

              <TextField
                label="Type"
                select
                value={manager.newUserType}
                onChange={e => manager.setNewUserType(e.target.value)}
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </TextField>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="outlined" onClick={() => manager.setShowAddUser(false)}>Cancel</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#DA291C" }}>Add</Button>
              </Box>
            </Box>
          </Card>
        </Modal>

        <Modal
            open={manager.showEditUser}
            onClose={() => manager.setShowEditUser(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(3px)",
            }}
          >
            <Card sx={{ p: 4, minWidth: 400, backgroundColor: "white", borderRadius: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Edit User
              </Typography>
          
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  manager.handleEditUser(
                    manager.userToEdit._id,
                    manager.userToEdit.email,
                    manager.userToEdit.type
                  );
                }}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="Email"
                  required
                  value={manager.userToEdit?.email || ""}
                  onChange={(e) =>
                    manager.setUserToEdit({ ...manager.userToEdit, email: e.target.value })
                  }
                />

                <TextField
                  label="Type"
                  select
                  value={manager.userToEdit?.type || "customer"}
                  onChange={(e) =>
                    manager.setUserToEdit({ ...manager.userToEdit, type: e.target.value })
                  }
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                </TextField>
                
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button variant="outlined" onClick={() => manager.setShowEditUser(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" sx={{ backgroundColor: "#DA291C" }}>
                    Save
                  </Button>
                </Box>
              </Box>
            </Card>
          </Modal>

          <Modal open={manager.showDeleteUser} onClose={() => manager.setShowDeleteUser(false)} 
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(3px)",
            }}>
            <Card sx={{ p: 4, mx: "auto", mt: "15vh", width: 400 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Confirm Delete
              </Typography>

              <Typography sx={{ mb: 3 }}>
                Are you sure you want to delete user {manager.userToDelete?.email}?
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="outlined" onClick={() => manager.setShowDeleteUser(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#DA291C" }}
                  onClick={() => manager.handleDeleteUser(manager.userToDelete._id)}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          </Modal>
      </Box>
    <Navbar />
  </Container>
  )
}
