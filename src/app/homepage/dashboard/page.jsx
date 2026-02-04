"use client";

import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, Container, List, ListItem, ListItemButton, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, TextField, InputAdornment} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
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
        <Box sx={{ width: '100%' }}>
          <DrugSearchingForum />
        </Box>
      </Container>
    </Box>

  );
}

export default dashboard;
