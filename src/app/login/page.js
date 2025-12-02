"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [createdMsg, setCreatedMsg] = useState("");
  const isFormValid = email.length > 0 && pass.length > 0;
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("created") === "true") {
      setCreatedMsg("Account created! please login to your new account.")
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    runDBCallAsync(`/api/login?email=${email}&pass=${pass}`
    );
  };

  async function runDBCallAsync(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data.data);
      if (data.data === "valid") {
        console.log("attempting redirect...");
        window.location.href = data.redirect;
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  }

  return (
    <Container
      sx={{
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
          backgroundColor: "#FFF8E1", // McDonald's cream color
          boxShadow: "0px 4px 15px rgba(0,0,0,0.25)",
        }}
      >
        <Typography
          variant="h4" align="center" sx={{ fontWeight: 800, marginBottom: 1 }}
        >
          Welcome Back
        </Typography>
        
        <Typography
          align="center" sx={{ marginBottom: 3 }}
        >
          login in to continue
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {createdMsg && (
            <p style={{ color: "green", fontWeight: "bold", marginBottom: "10px" }}>
            {createdMsg}
            </p>
            )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPass(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />

          {error && (
            <p style={{ color: "#DA291C", fontWeight: "bold" }}>{error}</p>
          )}

          <FormControlLabel
            control={<Checkbox sx={{ color: "#DA291C" }} />}
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isFormValid}
            sx={{
              mt: 3,
              backgroundColor: "#FFC72C", // McDonald's yellow
              color: "#27251F",
              fontWeight: 700,
              paddingY: 1.2,
              ":hover": { backgroundColor: "#e6b526" },
            }}
          >
            Sign In
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#DA291C", fontWeight: "bold" }}>
              Register
            </a>
          </Typography>
        </Box>
      </Card>

      <Navbar />
    </Container>
  );
}
