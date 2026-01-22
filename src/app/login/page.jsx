'use client'; // Required for MUI and state
import { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token); // Save login session
      alert('Logged in!');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: "white", p: 2, mt: 10, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4">Login</Typography>
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
        </form>
      </Box>
    </Container>
  );
}