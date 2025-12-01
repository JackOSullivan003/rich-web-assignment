"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";


export default function RegisterPage() {
  const [msg, setMsg] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMsg("");

    const data = new FormData(event.currentTarget);
    let email = data.get("email");
    let pass = data.get("pass");

    runRegisterAsync(
      `/api/register?email=${email}&pass=${pass}`
    );
  };

  async function runRegisterAsync(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.data === "created") {
        // Redirect with message
      window.location.href = "/login?created=true";
      } else {
        setMsg("User already exists.");
      }
    } catch (err) {
      setMsg("Server error — try again.");
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "#DA291C",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          borderRadius: 4,
          padding: 3,
          backgroundColor: "#FFF8E1",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.25)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 800, color: "#27251F", marginBottom: 1 }}
        >
          Create Account
        </Typography>

        <Typography align="center" sx={{ marginBottom: 2, color: "#27251F" }}>
          Join the McCommunity!
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="pass"
            label="Password"
            type="password"
            id="pass"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />

          {msg && (
            <p
              style={{
                fontWeight: "bold",
                color: msg.includes("created") ? "green" : "#DA291C",
              }}
            >
              {msg}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#FFC72C",
              color: "#27251F",
              fontWeight: 700,
              paddingY: 1.2,
              ":hover": { backgroundColor: "#e6b526" },
            }}
          >
            Register
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#DA291C", fontWeight: "bold" }}>
              Login
            </a>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
