import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Tooltip,
  TablePagination,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import type { Book } from "../../types/book";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onView: (book: Book) => void;
}

const BookTable: React.FC<BookTableProps> = ({
  books,
  onEdit,
  onDelete,
  onView,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Update filtered books whenever search query or books change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = books.filter((book) => {
        // Search across multiple fields: title, author, genre
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query) ||
          book.publishedYear.toString().includes(query)
        );
      });
      setFilteredBooks(filtered);
    }
    setPage(0); // Reset to first page on search
  }, [searchQuery, books]);

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      onDelete(bookToDelete.id);
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleEditClick = (book: Book) => {
    onEdit(book);
  };

  const handleViewClick = (book: Book) => {
    onView(book);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Calculate the subset of books to display on the current page
  const displayedBooks = filteredBooks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (books.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
          minHeight: "200px",
        }}
      >
        <Typography variant="subtitle1" color="text.secondary">
          No books available. Add your first book using the button above.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Single Universal Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search books by title, author, genre..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={clearSearch}
                  size="small"
                  aria-label="clear search"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>

      {filteredBooks.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 1,
            minHeight: "200px",
          }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            No books match your search. Try different keywords.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="book table">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.light" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Title
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Author
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                  align="center"
                >
                  Published Year
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    display: { xs: "none", md: "table-cell" },
                  }}
                >
                  Genre
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "white" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBooks.map((book) => (
                <TableRow
                  key={book.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {book.title}
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell
                    align="center"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {book.publishedYear}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {book.genre}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip
                        title="View book details"
                        key={`view-${book.id}`}
                      >
                        <IconButton
                          onClick={() => handleViewClick(book)}
                          color="info"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit book" key={`edit-${book.id}`}>
                        <IconButton
                          onClick={() => handleEditClick(book)}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete book" key={`delete-${book.id}`}>
                        <IconButton
                          onClick={() => handleDeleteClick(book)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredBooks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
          />
        </TableContainer>
      )}

      {/* Use the DeleteConfirmationDialog component */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default BookTable;
