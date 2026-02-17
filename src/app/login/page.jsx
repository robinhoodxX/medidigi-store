'use client'; // Required for MUI and state
import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.token) { // Check if request was successful
        localStorage.setItem('token', data.token);
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }

        // alert('Logged in!'); <--- Remove this
        router.push('/homepage');      // <--- 3. Redirect to Homepage
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ p: 2, mt: 10, borderRadius: 2 }}>
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: '#f9f9f9', border: '1px solid #1f1f1f' }}>
          <Typography variant="h5" align="center">
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal" fullWidth label="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              margin="normal" fullWidth label="Password" type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Login
            </Button>
            <Box variant="body2" align="center" sx={{ mt: 3 }} component="div">
              Don't have an account? <Link href="/signup">Sign Up</Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}