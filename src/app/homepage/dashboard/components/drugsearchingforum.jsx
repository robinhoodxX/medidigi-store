
import axios from "axios";
import React from 'react';
import { useState, useEffect } from "react";
import { Typography, IconButton, Box, Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, TextField, InputAdornment} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function drugsearchingforum () {

  const [drugs, setDrugs] = useState([]);
  const [page, setPage] = useState(0); // MUI uses 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState([]);


  const getGuestId = () => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : `guest-${Date.now()}`;
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  };

  const handleWishlistToggle = async (drugId) => {
    const guestId = getGuestId();

    // 1. Update UI instantly (Optimistic Update)
    if (wishlistIds.includes(drugId)) {
      setWishlistIds(wishlistIds.filter(id => id !== drugId)); // Remove
    } else {
      setWishlistIds([...wishlistIds, drugId]); // Add
    }

    // 2. Tell the backend to save it
    await axios.post('http://localhost:5000/api/wishlist/guest/toggle', { guestId, drugId });
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  // When the page loads, fetch the user's current wishlist from the backend
  useEffect(() => {
    const fetchGuestWishlist = async () => {
      const guestId = getGuestId();
      const res = await axios.get(`http://localhost:5000/api/wishlist/guest/${guestId}`);
      // Store only the IDs so it's easy to check: wishlistIds.includes(drugId)
      setWishlistIds(res.data.map(drug => drug._id));
    };
    fetchGuestWishlist();
  }, []);

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
      const guestId = getGuestId();
      // Fetch wishlist IDs for the guest
      const wishlistResponse = await axios.get(`http://localhost:5000/api/wishlist/guest/ids`, {
        params: {
          guestId
        }
      });
      setWishlistIds(wishlistResponse.data.wishlistIds);
    };
    fetchDrugs();
  }, [page, rowsPerPage, search]); // Re-run when these change


    return (
      <Box>
        <Box
          sx={{
            bgcolor: "#e3f2fd",
            py: 8,
            textAlign: "center",
            mb: 4,
          }}
        >
          {/* This is the hero section with a search bar. It has a light blue background and some padding for spacing. */}
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
                  <TableCell><strong>Wishlists</strong></TableCell>
                </TableRow>
              </TableHead>
              {/* Display the list of drugs in a table format. Each row shows the drug's name, alias, category, dosage form, effect, and a wishlist toggle button. */}
              <TableBody>
                {drugs.map((drug) => (
                  <TableRow key={drug._id}>
                    <TableCell>{drug["Drug Name"]}</TableCell>
                    <TableCell>{drug["Alias name"]}</TableCell>
                    <TableCell>{drug.Category}</TableCell>
                    <TableCell>{drug["Dosage Form"]}</TableCell>
                    <TableCell>{drug["Effect Description"]}</TableCell>
                    {/* The wishlist toggle button allows users to add or remove the drug from their wishlist. It shows a filled heart icon if the drug is in the wishlist, and an outlined heart if it's not. Clicking the button updates the wishlist both in the UI and on the backend. */}
                    <TableCell>
                      <IconButton onClick={() => handleWishlistToggle(drug._id)}>
                        {wishlistIds.includes(drug._id) ? (
                          <FavoriteIcon sx={{ color: 'red' }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </TableCell>
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
    )
}