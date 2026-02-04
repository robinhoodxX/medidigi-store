import React from 'react';
import { Box, List, ListItem, ListItemButton } from '@mui/material';

export default function leftmenudash () {
    return (
      <Box sx={{ bgcolor: '#eaeaea', paddingLeft: 2, paddingRight: 2 }}>
        <List>
          <ListItem disablePadding><ListItemButton>Dashboard</ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton>Orders</ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton>Products</ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton>Customers</ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton>Reports</ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton>Integrations</ListItemButton></ListItem>
        </List>
      </Box>
    )
}