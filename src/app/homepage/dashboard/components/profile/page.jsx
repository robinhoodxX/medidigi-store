import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

export default function profile() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2, bgcolor: "#f5f5f5", borderRadius: 1, m: 20 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is where your profile information will go. You can view and edit your details here.
      </Typography>
    </Box>
  );
}
