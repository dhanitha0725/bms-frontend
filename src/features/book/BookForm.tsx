import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Book } from "../../types/book";
import {
  bookSchema,
  type BookFormData,
} from "../../validations/bookValidations";

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => Promise<void>;
  initialData?: Book;
  title: string;
  renderAsDialog?: boolean;
  apiError?: string;
}

const BookForm: React.FC<BookFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
  renderAsDialog = true,
  apiError,
}) => {
  // State for form submission error
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          title: "",
          author: "",
          publishedYear: new Date().getFullYear(),
          genre: "",
        },
  });

  // Reset form and clear error when opened or when initialData/apiError changes
  useEffect(() => {
    console.log("Initial data in BookForm:", initialData);

    if (open && initialData) {
      // Explicitly set each field to ensure proper initialization
      reset({
        title: initialData.title || "",
        author: initialData.author || "",
        publishedYear: initialData.publishedYear || new Date().getFullYear(),
        genre: initialData.genre || "",
      });
    } else if (open) {
      reset({
        title: "",
        author: "",
        publishedYear: new Date().getFullYear(),
        genre: "",
      });
    }

    if (apiError) {
      console.log("Received API error in BookForm:", apiError);
      setSubmitError(apiError);
    } else {
      setSubmitError(null);
    }
  }, [open, initialData, reset, apiError]);

  // Handle form submission with error handling
  const handleFormSubmit = async (data: BookFormData) => {
    try {
      setSubmitError(null); // Clear any previous errors
      await onSubmit(data);
    } catch (error: any) {
      // Display the error message
      setSubmitError(error.message || "An unexpected error occurred");
    }
  };

  const genres = [
    "Fiction",
    "Non-fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Romance",
    "Biography",
    "History",
    "Poetry",
    "Adventure",
    "Self-help",
    "Horror",
    "Children",
    "Young Adult",
    "Other",
  ];

  const formContent = (
    <Box component="form" sx={{ pt: 2 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <Controller
        name="author"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Author"
            fullWidth
            margin="normal"
            error={!!errors.author}
            helperText={errors.author?.message}
          />
        )}
      />

      <Controller
        name="publishedYear"
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <TextField
            {...field}
            label="Published Year"
            type="number"
            fullWidth
            margin="normal"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            error={!!errors.publishedYear}
            helperText={errors.publishedYear?.message}
            InputProps={{
              inputProps: { min: 1000, max: new Date().getFullYear() },
            }}
          />
        )}
      />

      <Controller
        name="genre"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.genre}>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select {...field} labelId="genre-label" label="Genre">
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
            {errors.genre && (
              <FormHelperText>{errors.genre.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      {!renderAsDialog && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {initialData ? "Update Book" : "Add Book"}
          </Button>
        </Box>
      )}
    </Box>
  );

  if (renderAsDialog) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {initialData ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return formContent;
};

export default BookForm;
