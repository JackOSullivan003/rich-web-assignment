"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default function LoginPage() {
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(""); 

    const data = new FormData(event.currentTarget);

    let email = data.get("email");
    let pass = data.get("pass");

    runDBCallAsync(
      `http://localhost:3000/api/login?email=${email}&pass=${pass}`
    );
  };

  async function runDBCallAsync(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.data === "valid") {
        console.log("Login valid!");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Could not connect to server.");
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
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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

          {error && (
            <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
          )}

          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
