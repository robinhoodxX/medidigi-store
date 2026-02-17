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
import DashboardIcon from '@mui/icons-material/Dashboard';
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";


export default function HomePage() {

  const [drugs, setDrugs] = useState([]);
  const [page, setPage] = useState(0); // MUI uses 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0); // Reset to first page when search changes
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchInput]);

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
          <IconButton color="inherit" href="./homepage/dashboard">
            <DashboardIcon />
          </IconButton>
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
          <Typography variant="h6" color="text.secondary">
            Search for drugs, supplements, and healthcare products instantly.
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for Panadol, Brufen..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
