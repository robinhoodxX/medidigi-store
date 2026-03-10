"use client";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Typography, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import axios from "axios";

export default function customs() {

  const [formData, setFormData] = useState({
    drugName: "",
    alias: "",
    category: "",
    dosageForm: "",
    effect: "",
    keywords: ""
  });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setPage(0);

    try {
      // Filter out empty fields
      const searchParams = Object.entries(formData)
        .filter(([_, value]) => value !== "")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      // Request to your backend API using Axios, aligning with `drugsearchingforum.jsx`
      const response = await axios.get("http://localhost:5000/api/drugs", {
        params: searchParams // the params will automatically map to the endpoint
      });

      // Based on drugsearchingforum, the list is usually in response.data.drugs
      // Fallback to response.data if it's returning an array directly
      setResults(response.data.drugs || response.data);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2, bgcolor: "#f5f5f5", borderRadius: 1, m: 20 }}>
      <Typography variant="h4" gutterBottom>
        Custom Drug Search
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter specific drug attributes to find the perfect match for your needs.
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField name="drugName" value={formData.drugName} onChange={handleChange} label="Drug name" variant="outlined" />
          <TextField name="alias" value={formData.alias} onChange={handleChange} label="Alias" variant="outlined" />
          <TextField name="category" value={formData.category} onChange={handleChange} label="Category" variant="outlined" />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField name="dosageForm" value={formData.dosageForm} onChange={handleChange} label="Dosage form" variant="outlined" />
          <TextField name="effect" value={formData.effect} onChange={handleChange} label="Effect" variant="outlined" />
          <TextField name="keywords" value={formData.keywords} onChange={handleChange} label="Keywords" variant="outlined" />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          size="large"
          sx={{ px: 4, py: 1 }}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </Box>

      {/* Basic Error Handling & Results Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 3, width: "100%", maxWidth: 600 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Box sx={{ mt: 4, width: "100%", maxWidth: 800 }}>
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          {results.length > 0 ? (
            results.map((item, index) => (
              <Box key={index} sx={{ p: 2, mb: 2, border: "1px solid #ccc", borderRadius: 1, bgcolor: "white" }}>
                <Typography variant="body1"><strong>{item.drugName || "Unnamed Drug"}</strong></Typography>
                <Typography variant="body2" color="textSecondary">{item.category}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No results found for your search.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}