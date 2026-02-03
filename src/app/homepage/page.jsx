'use client';

import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, TextField,
  Grid, Card, CardContent, CardActions, Button,
  Box, InputAdornment, IconButton, Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

// --- MOCK DATA  ---
const mockDrugs = [
  { id: 1, name: "Panadol Extra", category: "Pain Relief", price: 50, dose: "500mg" },
  { id: 2, name: "Amoxil", category: "Antibiotic", price: 120, dose: "250mg" },
  { id: 3, name: "Brufen", category: "Anti-inflammatory", price: 85, dose: "400mg" },
  { id: 4, name: "Disprin", category: "Blood Thinner", price: 20, dose: "300mg" },
  { id: 5, name: "Flagyl", category: "Antibiotic", price: 60, dose: "400mg" },
  { id: 6, name: "Augmentin", category: "Antibiotic", price: 350, dose: "625mg" },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Filter drugs based on search
  const filteredDrugs = mockDrugs.filter((drug) =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
    // Logic to add to actual cart database goes here
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>

      {/* 1. NAVBAR */}
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            MediDigi Store
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Button color="inherit" href="/login">Login</Button>
        </Toolbar>
      </AppBar>

      {/* 2. HERO / SEARCH SECTION */}
      <Box sx={{
        bgcolor: '#e3f2fd',
        py: 8,
        textAlign: 'center',
        mb: 4
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ color: '#0d47a1', fontWeight: 'bold' }}>
            Find Your Medicine
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Search for drugs, supplements, and healthcare products instantly.
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for Panadol, Brufen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ bgcolor: 'white', borderRadius: 1 }}
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
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium' }}>
          Available Medicines
        </Typography>

        <Grid container spacing={3}>
          {filteredDrugs.length > 0 ? (
            filteredDrugs.map((drug) => (
              <Grid item key={drug.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" color="primary">
                      {drug.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: <strong>{drug.category}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dosage: {drug.dose}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
                      Rs. {drug.price}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 1, mb: 2, px: 2 }}>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={handleAddToCart}
                      sx={{ bgcolor: '#fa6060' }}
                    >
                      Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No medicines found matching "{searchTerm}"
              </Typography>
            </Container>
          )}
        </Grid>
      </Container>
    </Box>
  );
}