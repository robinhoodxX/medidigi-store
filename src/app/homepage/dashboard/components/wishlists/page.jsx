'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Button from '@mui/material/Button';

export default function wishlists() {
  const [items, setItems] = useState([]);

  const getGuestId = () => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : `guest-${Date.now()}`;
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      const guestId = getGuestId();
      const res = await axios.get(`http://localhost:5000/api/wishlist/guest/${guestId}`);
      setItems(res.data || []);
    };

    fetchWishlist();

    const handleUpdate = () => {
      fetchWishlist();
    };

    window.addEventListener('wishlist-updated', handleUpdate);
    return () => {
      window.removeEventListener('wishlist-updated', handleUpdate);
    };
  }, []);

  // Clear wishlist for current guest
  const handleClear = async () => {
    try {
      const guestId = getGuestId();
      const res = await fetch(`http://localhost:5000/api/wishlist/guest/${guestId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setItems([]);
      } else {
        alert(data.message || "Failed to clear wishlist.");
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      alert("Error clearing wishlist. Please check console for details.");
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h4" gutterBottom>
        Your Wishlists
      </Typography>
      <Button variant="contained" onClick={handleClear}>Clear</Button>
      </Box>
      {items.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 20 }}>
          Your wishlist is empty.
        </Typography>
      ) : (
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
              {items.map((drug) => (
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
        </TableContainer>
      )}
    </Box>
  );
}