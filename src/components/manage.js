import { useState } from "react";

export function useManagerActions({ fetchUsers, fetchProducts, fetchOrders }) {
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showDeleteProduct, setShowDeleteProduct] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showDeleteUser, setShowDeleteUser] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserType, setNewUserType] = useState("customer");

  // Product handlers
  async function handleAddProduct(newName, newPrice, newCategory) {
    const res = await fetch("/api/manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addProduct",
        name: newName,
        price: parseFloat(newPrice),
        category: newCategory,
      }),
    });
    const data = await res.json();
    if (data.success) {
      fetchProducts();
      setShowAddProduct(false);
    }
  }

  async function handleDeleteProduct(id) {
    const res = await fetch("/api/manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteProduct", id }),
    });
    const data = await res.json();
    if (data.success) {
      fetchProducts();
      setShowDeleteProduct(false);
    }
  }

  // User handlers
  async function handleAddUser(email, password, type) {
    const res = await fetch("/api/manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addUser", email, password, type }),
    });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserType("customer");
      setShowAddUser(false);
    }
  }

  async function handleEditUser(id, email, type) {
    const res = await fetch("/api/manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "editUser", id, email, type }),
    });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
      setShowEditUser(false);
    }
  }

  async function handleDeleteUser(id) {
    const res = await fetch("/api/manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteUser", id }),
    });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
      setShowDeleteUser(false);
    }
  }

  // Orders fetch
  async function fetchAllOrders(setOrders) {
    const res = await fetch("/api/manager?section=orders");
    const json = await res.json();
    setOrders(json.data);
  }

  return {
    showAddProduct,
    setShowAddProduct,
    showDeleteProduct,
    setShowDeleteProduct,
    showAddUser,
    setShowAddUser,
    showEditUser,
    setShowEditUser,
    showDeleteUser,
    newUserEmail,
    setNewUserEmail,
    newUserPassword,
    setNewUserPassword,
    newUserType,
    setNewUserType,
    userToEdit,
    setUserToEdit,
    userToDelete,
    setUserToDelete,
    setShowDeleteUser,
    handleAddProduct,
    handleDeleteProduct,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    fetchAllOrders,
  };
}
