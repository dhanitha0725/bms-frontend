import api from './api';
import type { Book } from '../types/book';

export const bookApi = {
  getAllBooks: async (): Promise<Book[]> => {
    try {
      const response = await api.get('/books/get-all-books');
      return response.data.books;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },

  getBookById: async (id: string): Promise<Book | null> => {
    try {
      const response = await api.get(`/books/${id}`);
      
      console.log("API response for getBookById:", response.data);

      return response.data;
      
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      return null;
    }
  },

  createBook: async (book: Omit<Book, 'id'>): Promise<Book | null> => {
    try {
      const response = await api.post('/books/add-book', book);
      return response.data;
    } catch (error: any) {
      const errorMessage = 
        typeof error.response?.data === 'string' 
          ? error.response.data 
          : error.response?.data?.message || 'Error creating book';
      
      console.error('Book creation error:', errorMessage, error);
      
      // Create a custom error with the backend message
      const customError = new Error(errorMessage);
      // Preserve the original error properties
      customError.cause = error;
      
      throw customError;
    }
  },

  updateBook: async (id: string, book: Partial<Book>): Promise<Book | null> => {
    try {
      const response = await api.put(`/books/${id}`, book);
      return response.data;
    } catch (error: any) {
      const errorMessage = 
        typeof error.response?.data === 'string' 
          ? error.response.data 
          : error.response?.data?.message || `Error updating book ${id}`;
      
      console.error('Book update error:', errorMessage, error);
      
      // Create a custom error with the backend message
      const customError = new Error(errorMessage);
      // Preserve the original error properties
      customError.cause = error;
      
      throw customError;
    }
  },

  deleteBook: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/books/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting book ${id}:`, error);
      return false;
    }
  }
};