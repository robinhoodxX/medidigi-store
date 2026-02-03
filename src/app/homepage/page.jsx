"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Badge,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination,
} from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";

// --- MOCK DATA  ---
const mockDrugs = [
  {
    id: 1,
    name: "Panadol Extra",
    category: "Pain Relief",
    price: 50,
    dose: "500mg",
  },
  { id: 2, name: "Amoxil", category: "Antibiotic", price: 120, dose: "250mg" },
  {
    id: 3,
    name: "Brufen",
    category: "Anti-inflammatory",
    price: 85,
    dose: "400mg",
  },
  {
    id: 4,
    name: "Disprin",
    category: "Blood Thinner",
    price: 20,
    dose: "300mg",
  },
  { id: 5, name: "Flagyl", category: "Antibiotic", price: 60, dose: "400mg" },
  {
    id: 6,
    name: "Augmentin",
    category: "Antibiotic",
    price: 350,
    dose: "625mg",
  },
];

export default function HomePage() {

  const [drugs, setDrugs] = useState([]);
  const [page, setPage] = useState(0); // MUI uses 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchDrugs = async () => {
      const response = await axios.get(`http://localhost:5000/api/drugs`, {
        params: {
          page: page + 1, // API expects 1-based index
          limit: rowsPerPage,
          search: search
        }
      });
      setDrugs(response.data.drugs);
      setTotalCount(response.data.totalDrugs);
    };
    fetchDrugs();
  }, [page, rowsPerPage, search]); // Re-run when these change

  const [cartCount, setCartCount] = useState(0);

  // Filter drugs based on search
  const filteredDrugs = mockDrugs.filter((drug) =>
    drug.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
    // Logic to add to actual cart database goes here
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* 1. NAVBAR */}
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            MediDigi Store
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Button color="inherit" href="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* 2. HERO / SEARCH SECTION */}
      <Box
        sx={{
          bgcolor: "#e3f2fd",
          py: 8,
          textAlign: "center",
          mb: 4,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            gutterBottom
            sx={{ color: "#0d47a1", fontWeight: "bold" }}
          >
            Find Your Medicine
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Search for drugs, supplements, and healthcare products instantly.
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for Panadol, Brufen..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ bgcolor: "white", borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </Box>

      {/* 3. PRODUCT GRID DASHBOARD */}

      <Box sx={{ p: 3 }}>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#eee' }}>
                <TableCell><strong>Drug Name</strong></TableCell>
                <TableCell><strong>Alias</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Dosage Form</strong></TableCell>
                <TableCell><strong>Effect</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drugs.map((drug) => (
                <TableRow key={drug._id}>
                  <TableCell>{drug["Drug Name"]}</TableCell>
                  <TableCell>{drug["Alias name"]}</TableCell>
                  <TableCell>{drug.Category}</TableCell>
                  <TableCell>{drug["Dosage Form"]}</TableCell>
                  <TableCell>{drug["Effect Description"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[20, 50, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      </Box>
    </Box>
  );
}
