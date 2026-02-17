import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';

export default function customs() {
  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mt: 2, mb: 2 }} >
      <Box>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </Box>
      <Button>Secondary Button</Button>
    </Box>
  );
}

