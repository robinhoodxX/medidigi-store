"use client";

import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, Container} from '@mui/material';
import LeftMenuDash from './components/leftmenudash';
import DrugSearchingForum from './components/drugsearchingforum';


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
        <LeftMenuDash />
      </Container>
    </Box>

  );
}

export default dashboard;
