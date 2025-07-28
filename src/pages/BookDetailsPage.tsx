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
  Card,
  CardContent,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { bookApi } from "../api/bookApi";
import type { Book } from "../types/book";

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Get book data from navigation state if available
  const bookFromState = location.state?.bookData as Book | undefined;

  const [book, setBook] = useState<Book | null>(bookFromState || null);
  const [loading, setLoading] = useState(!bookFromState);
  const [error, setError] = useState<string | null>(null);

  // Fetch book data if not available from state
  useEffect(() => {
    if (!bookFromState && id) {
      const fetchBook = async () => {
        setLoading(true);
        try {
          const bookData = await bookApi.getBookById(id);
          if (bookData) {
            setBook(bookData);
            setError(null);
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
    }
  }, [id, bookFromState]);

  const handleBackClick = () => {
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
            <Typography color="text.primary">Book Details</Typography>
          </Breadcrumbs>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackClick}
              sx={{ mr: 2 }}
            >
              Back to Books
            </Button>
            <Typography variant="h4" component="h1">
              Book Details
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : book ? (
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {book.title}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Author
                    </Typography>
                    <Typography variant="body1">{book.author}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Published Year
                    </Typography>
                    <Typography variant="body1">
                      {book.publishedYear}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Genre
                    </Typography>
                    <Chip
                      label={book.genre}
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Book ID
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                      }}
                    >
                      {book.id}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Alert severity="error">Book not found</Alert>
        )}
      </Paper>
    </Container>
  );
};

export default BookDetailsPage;
