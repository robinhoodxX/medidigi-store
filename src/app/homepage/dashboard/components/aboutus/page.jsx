import { Box, Typography } from '@mui/material';

export default function AboutUs() {
  return (
    <Box sx={{ mt: 5, pl: 5, pr: 5, pb: 6, width: "100%", mx: "auto" }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 4, borderRadius: 4, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" gutterBottom>
          We are a team of passionate developers dedicated to creating a seamless online platform for medicine discovery and healthcare solutions. 
          Our mission is to empower users with accurate information and personalized recommendations to enhance their well-being. With a user-friendly interface and
          cutting-edge technology, we strive to make healthcare accessible and convenient for everyone.
        </Typography>
      </Box>
    </Box>
  );
}