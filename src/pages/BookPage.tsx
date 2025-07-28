import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import BookTable from "../features/book/BookTable";
import { bookApi } from "../api/bookApi";
import type { Book } from "../types/book";
import { useAuth } from "../context/AuthContext";

const BookPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookApi.getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load books. Please try again later.");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    navigate("/books/new");
  };

  const handleEditBook = (book: Book) => {
    // Pass the book data through state
    navigate(`/books/edit/${book.id}`, { state: { bookData: book } });
  };

  const handleViewBook = (book: Book) => {
    // Pass the book data through state to the details page
    navigate(`/books/details/${book.id}`, { state: { bookData: book } });
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const success = await bookApi.deleteBook(id);
      if (success) {
        setBooks(books.filter((book) => book.id !== id));
        setSnackbar({
          open: true,
          message: "Book deleted successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete book",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete book",
        severity: "error",
      });
      console.error("Error deleting book:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setSnackbar({
      open: true,
      message: "You have been successfully logged out",
      severity: "info",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Book Management
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title="Logout">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                Logout
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddBook}
              sx={{
                display: { xs: "none", sm: "flex" },
                px: 3,
                py: 1,
              }}
            >
              Add Book
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <BookTable
            books={books}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            onView={handleViewBook}
          />
        )}
      </Paper>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Mobile Action Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Tooltip title="Logout">
          <Fab
            color="primary"
            size="small"
            aria-label="logout"
            sx={{
              display: { sm: "none" },
              bgcolor: "white",
              color: "primary.main",
              "&:hover": {
                bgcolor: "grey.200",
              },
            }}
            onClick={handleLogout}
          >
            <LogoutIcon />
          </Fab>
        </Tooltip>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            display: { sm: "none" },
          }}
          onClick={handleAddBook}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Container>
  );
};

export default BookPage;
