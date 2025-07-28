import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../api/api";
import RegisterForm from "../features/auth/RegisterForm";
import { type RegisterFormData } from "../validations/registerValidation";

const RegisterPage: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormData) => {
    setError("");
    setLoading(true);

    try {
      await authService.register(data.username, data.password);
      // Registration successful, redirect to login
      navigate("/login", {
        state: {
          message: "Account created successfully! Please log in.",
        },
      });
    } catch (error: any) {
      // Handle API errors
      if (error.message) {
        // Direct error message (either from our custom Error or from the backend)
        setError(error.message);
      } else if (error.response?.data) {
        // Check for different error formats
        if (typeof error.response.data === "string") {
          // Direct string error from API
          setError(error.response.data);
        } else if (error.response.data.errors) {
          // Handle validation errors from the API
          const serverErrors = error.response.data.errors;
          // Get the first error message
          const firstError = Object.values(serverErrors)[0] as string[];
          setError(firstError[0] || "Registration failed");
        } else if (error.response.data.message) {
          // Handle specific error message from the API
          setError(error.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/src/assets/bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        margin: 0,
        overflow: "auto",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Create an Account
            </Typography>

            <RegisterForm
              onSubmit={handleRegister}
              error={error}
              loading={loading}
            />

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <MuiLink component={Link} to="/login">
                  Log in here
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;
