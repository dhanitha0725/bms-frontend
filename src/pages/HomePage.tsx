import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import FeatureCard from "../features/Home/Card";
import { Grid } from "@mui/material";

const HomePage: React.FC = () => {
  const features = [
    {
      title: "Book Management",
      description: "Add, edit, and organize your book collection with ease",
      icon: "📚",
      link: "/books",
    },
    {
      title: "Search & Filter",
      description:
        "Find books quickly using advanced search and filtering options",
      icon: "🔍",
      link: "/search",
    },
    {
      title: "Secure Access",
      description: "Secure your book data with user authentication",
      icon: "🛡️",
      link: "/users",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/src/assets/bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          flex: "0 0 40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          px: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ maxWidth: 800, width: "100%" }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              mb: 2,
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
              lineHeight: 1.2,
            }}
          >
            Welcome to Book Management System
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.95,
              mb: 4,
              fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" },
              textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
            }}
          >
            This is a simple book management system built to help you manage
            your book collection effectively.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{
                borderRadius: "12px",
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              Grant Access
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          flex: "1",
          py: { xs: 2, sm: 3 },
          background: "rgba(255,255,255,0.05)",
          overflow: "auto",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            height: "100%",
            maxWidth: "1400px",
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              color: "white",
              fontWeight: 700,
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
            }}
          >
            Available Features
          </Typography>
          <Grid
            container
            spacing={{ xs: 2, sm: 3 }}
            sx={{
              justifyContent: "center",
              maxWidth: "100%",
            }}
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={4}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ width: "100%", maxWidth: 400 }}>
                  <FeatureCard {...feature} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
