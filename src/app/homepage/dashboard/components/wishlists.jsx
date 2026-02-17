import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Wishlists
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
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