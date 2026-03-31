'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import html2canvas from 'html2canvas';

export default function wishlists() {
  const [items, setItems] = useState([]);
  const tableRef = useRef(null);

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

  const handleDownload = async () => {
    if (tableRef.current) {
      try {
        const canvas = await html2canvas(tableRef.current, { scale: 2 });
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'my-wishlist.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating image:", error);
        alert("Failed to download image.");
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h4" gutterBottom>
          Your Wishlists
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleDownload} disabled={items.length === 0}>
            Download Image
          </Button>
          <Button variant="contained" color="error" onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </Box>
      {items.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 20 }}>
          Your wishlist is empty.
        </Typography>
      ) : (
        <TableContainer component={Paper} ref={tableRef}>
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