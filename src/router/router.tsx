import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import BookPage from "../pages/BookPage";
import BookManagePage from "../pages/BookManagePage";
import BookDetailsPage from "../pages/BookDetailsPage";
import { ProtectedRoute } from "./ProtectedRoute";

const Router: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/books" element={<BookPage />} />
        <Route path="/books/new" element={<BookManagePage />} />
        <Route path="/books/edit/:id" element={<BookManagePage />} />
        <Route path="/books/details/:id" element={<BookDetailsPage />} />
      </Route>

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
