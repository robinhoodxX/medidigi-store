"use client";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Typography, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useEffect } from "react";

export default function customs() {

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0); // Reset to first page when search changes
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchInput]);

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
          <TextField id="outlined-basic" label="Drug name" variant="outlined" InputProps />
          <TextField id="outlined-basic" label="Alias" variant="outlined" />
          <TextField id="outlined-basic" label="Category" variant="outlined" />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField id="outlined-basic" label="Dosage form" variant="outlined" />
          <TextField id="outlined-basic" label="Effect" variant="outlined" />
          <TextField id="outlined-basic" label="Keywords" variant="outlined" />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          label="Keywords"
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ bgcolor: "white", borderRadius: 1 }}
        />
        <Button variant="outlined">Search</Button>
      </Box>
    </Box>
  );
}
