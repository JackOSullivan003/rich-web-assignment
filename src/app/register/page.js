"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default function RegisterPage() {
  const [msg, setMsg] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMsg("");

    const data = new FormData(event.currentTarget);
    let email = data.get("email");
    let pass = data.get("pass");

    runRegisterAsync(
      `http://localhost:3000/api/register?email=${email}&pass=${pass}`
    );
  };

  async function runRegisterAsync(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.data === "created") {
        setMsg("Account created!");
      } else {
        setMsg("User already exists.");
      }
    } catch (err) {
      setMsg("Server error — try again.");
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: "100vh" }}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="pass"
            label="Password"
            type="password"
            id="pass"
          />

          {msg && <p style={{ fontWeight: "bold" }}>{msg}</p>}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
