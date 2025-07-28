import axios from "axios";

const TOKEN_KEY = "authToken";

// token management functions
const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

// create an axios instance with default settings
// set default base URL and headers
const api = axios.create({
  baseURL: "http://localhost:5234/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      removeToken();
      
      // Dispatch an event instead of direct redirection
      window.dispatchEvent(new Event('auth:unauthorized'));
      
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { 
      username, 
      password 
    });
    
    if (response.data.token) {
      setToken(response.data.token);
    }
    
    return response.data;
  },

  register: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        password
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Registration error details:", error);
      
      // Properly structure the error to be handled by the calling component
      if (error.response?.data && typeof error.response.data === 'string') {
        // Handle direct string error messages from the backend
        throw new Error(error.response.data);
      }
      
      // If it's not a direct string message, let the caller handle it
      throw error;
    }
  },
  
  logout: () => {
    removeToken();
  },

  isAuthenticated: () => !!getToken(),
};

export default api;