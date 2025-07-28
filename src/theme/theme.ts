import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f9f9f9",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
