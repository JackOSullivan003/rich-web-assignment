import { useState } from "react";

export function useManagerActions({ fetchUsers, fetchProducts, fetchOrders }) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteUser, setShowDeleteUser] = useState(false);

  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserType, setNewUserType] = useState("customer");

  async function handleAddProduct(name, price, category, image, description) {
    const res = await fetch("/api/manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addProduct",
        name,
        price: parseFloat(price),
        category,
        image, 
        description
      }),
    });
    const data = await res.json();
    if (data.success) {
      fetchProducts();
      setShowAddProduct(false);
    }
    return data;
  }

  async function handleEditProduct(id, name, price, category, image, description) {
    const res = await fetch("/api/manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "editProduct",
        id,
        name,
        price: parseFloat(price),
        category,
        image,
        description
      }),
    });
    const data = await res.json();
    if (data.success) {
      fetchProducts();
      setShowEditProduct(false);
      setProductToEdit(null);
    }
    return data;
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
      setProductToDelete(null);
    }
    return data;
  }

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
    return data;
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
      setUserToEdit(null);
    }
    return data;
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
      setUserToDelete(null);
    }
    return data;
  }

  async function fetchAllOrders(setOrders) {
    const res = await fetch("/api/manager?section=orders");
    const json = await res.json();
    setOrders(json.data);
  }

  return {
    showAddProduct,
    setShowAddProduct,
    showEditProduct,
    setShowEditProduct,
    productToEdit,
    setProductToEdit,
    productToDelete,
    setProductToDelete,
    showDeleteProduct,
    setShowDeleteProduct,

    showAddUser,
    setShowAddUser,
    showEditUser,
    setShowEditUser,
    userToEdit,
    setUserToEdit,
    userToDelete,
    setUserToDelete,
    showDeleteUser,
    setShowDeleteUser,

    newUserEmail,
    setNewUserEmail,
    newUserPassword,
    setNewUserPassword,
    newUserType,
    setNewUserType,

    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    fetchAllOrders,
  };
}
