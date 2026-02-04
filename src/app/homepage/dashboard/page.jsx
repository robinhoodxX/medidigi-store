import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Container, List, ListItem, ListItemButton } from '@mui/material';

function dashboard() {
  return (
    <Box>
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
          </IconButton>
          <Button color="inherit" href="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container disableGutters sx={{ display: 'flex', flexDirection: 'row'}}>
        <Box sx={{ bgcolor: '#eaeaea' }}>
          <List>
            <ListItem disablePadding><ListItemButton>Dashboard</ListItemButton></ListItem>
            <ListItem disablePadding><ListItemButton>Orders</ListItemButton></ListItem>
            <ListItem disablePadding><ListItemButton>Products</ListItemButton></ListItem>
            <ListItem disablePadding><ListItemButton>Customers</ListItemButton></ListItem>
            <ListItem disablePadding><ListItemButton>Reports</ListItemButton></ListItem>
            <ListItem disablePadding><ListItemButton>Integrations</ListItemButton></ListItem>
          </List>
        </Box>
        <Box sx={{ bgcolor: '#e3f2fd', width: '100%' }}>
          Additional Content
        </Box>
      </Container>
    </Box>

  );
}

export default dashboard;
