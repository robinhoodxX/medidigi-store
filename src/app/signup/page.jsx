'use client';
import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });

    if (res.ok) {
      alert('Account created! Redirecting to login...');
      router.push('/login');
    } else {
      alert('Signup failed. User might already exist.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal" fullWidth label="Email Address" required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              margin="normal" fullWidth label="Password" type="password" required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <TextField
              margin="normal" fullWidth label="Confirm Password" type="password" required
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Typography variant="body2" align="center">
              Already have an account? <Link href="/login">Log In</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}