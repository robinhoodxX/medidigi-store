import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";

export default function customs() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2, bgcolor: "#f5f5f5", borderRadius: 1, m: 20 }}>
      <Typography variant="h4" gutterBottom>
        Custom Drug Search
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter specific drug attributes to find the perfect match for your needs.
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField id="outlined-basic" label="Drug name" variant="outlined" />
          <TextField id="outlined-basic" label="Alias" variant="outlined" />
          <TextField id="outlined-basic" label="Category" variant="outlined" />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField id="outlined-basic" label="Dosage form" variant="outlined" />
          <TextField id="outlined-basic" label="Effect" variant="outlined" />
          <TextField id="outlined-basic" label="Keywords" variant="outlined" />
        </Box>
      </Box>
      <Box>
        <Button variant="outlined">Search</Button>
      </Box>
    </Box>
  );
}
