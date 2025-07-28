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
      window.location.href = '/login'; 
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

  logout: () => {
    removeToken();
  },

  isAuthenticated: () => !!getToken(),
};

export default api;