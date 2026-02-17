import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";

export default function customs() {
  return (
    <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, m: 20 }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            mb: 2,
            p: 2,
            borderRadius: 1,
          }}
        >
          <TextField id="outlined-basic" label="Drug name" variant="outlined" />
          <TextField id="outlined-basic" label="Alias" variant="outlined" />
          <TextField id="outlined-basic" label="Category" variant="outlined" />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            mb: 2,
            p: 2,
            borderRadius: 1,
          }}
        >
          <TextField
            id="outlined-basic"
            label="Dosage form"
            variant="outlined"
          />
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
