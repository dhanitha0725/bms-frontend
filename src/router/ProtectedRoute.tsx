import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export const ProtectedRoute = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Re-check authentication when route changes or on mount
    const verifyAuth = async () => {
      setIsChecking(true);
      await checkAuth();
      setIsChecking(false);
    };

    verifyAuth();
  }, [checkAuth, location.pathname]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    // Preserve the attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is authenticated, render the child routes
  return <Outlet />;
};
