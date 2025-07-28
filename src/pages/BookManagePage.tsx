import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookForm from "../features/book/BookForm";
import { bookApi } from "../api/bookApi";
import type { Book } from "../types/book";

const BookManagePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  // Get book data from navigation state if available
  const bookFromState = location.state?.bookData as Book | undefined;

  const [book, setBook] = useState<Book | null>(bookFromState || null);
  const [loading, setLoading] = useState(isEditMode && !bookFromState);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch book data if in edit mode and no data passed from table
  useEffect(() => {
    if (isEditMode && id && !bookFromState) {
      const fetchBook = async () => {
        setLoading(true);
        try {
          const bookData = await bookApi.getBookById(id);
          if (bookData) {
            console.log("Book data fetched from API:", bookData);
            setBook(bookData);
          } else {
            setError("Book not found");
          }
        } catch (err) {
          setError("Failed to load book details");
          console.error("Error fetching book:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchBook();
    } else if (bookFromState) {
      console.log("Using book data from table:", bookFromState);
      setBook(bookFromState);
      setLoading(false);
    }
  }, [id, isEditMode, bookFromState]);

  const handleFormSubmit = async (data: Omit<Book, "id">) => {
    try {
      setApiError(null); // Clear any previous errors

      if (isEditMode && id) {
        // Update existing book
        const updated = await bookApi.updateBook(id, data);
        if (updated) {
          setSnackbar({
            open: true,
            message: "Book updated successfully",
            severity: "success",
          });
          // Short delay before navigating back
          setTimeout(() => navigate("/books"), 1500);
        }
      } else {
        // Create new book
        const newBook = await bookApi.createBook(data);
        if (newBook) {
          setSnackbar({
            open: true,
            message: "Book added successfully",
            severity: "success",
          });
          // Short delay before navigating back
          setTimeout(() => navigate("/books"), 1500);
        }
      }
    } catch (err: any) {
      console.log("API Error:", err);

      // Set the API error for display in the form
      setApiError(err.message);

      // Don't show snackbar error when it's a validation error
      if (!err.message?.includes("title already exists")) {
        setSnackbar({
          open: true,
          message:
            err.message ||
            (isEditMode ? "Failed to update book" : "Failed to add book"),
          severity: "error",
        });
      }

      console.error("Error saving book:", err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    navigate("/books");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        {/* Header with breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              component={RouterLink}
              to="/"
              underline="hover"
              color="inherit"
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/books"
              underline="hover"
              color="inherit"
            >
              Books
            </Link>
            <Typography color="text.primary">
              {isEditMode ? "Edit Book" : "Add Book"}
            </Typography>
          </Breadcrumbs>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              sx={{ mb: 2 }}
            >
              Back to Books
            </Button>
            <Typography variant="h4" component="h1">
              {isEditMode ? "Edit Book" : "Add New Book"}
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary">
            {isEditMode
              ? "Update the book information below"
              : "Fill in the details to add a new book to your collection"}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Box sx={{ mt: 2 }}>
              <BookForm
                open={true}
                onClose={handleCancel}
                onSubmit={handleFormSubmit}
                initialData={book || undefined}
                title={isEditMode ? "Edit Book" : "Add New Book"}
                renderAsDialog={false}
                apiError={apiError || undefined}
                key={book?.id || "new-book"}
              />
            </Box>
          </Box>
        )}
      </Paper>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
    </Container>
  );
};

export default BookManagePage;
