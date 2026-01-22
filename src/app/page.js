'use client';

import Image from "next/image";
import Link from "next/link";
import { Button, Stack } from "@mui/material";


export default function Home() {
  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        <Button
          component={Link}
          href="/login"
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: "0 6px 16px rgba(25,118,210,0.25)",
            "&:hover": {
              boxShadow: "0 8px 20px rgba(25,118,210,0.35)",
            },
          }}
        >
          Login
        </Button>
        <Button
          component={Link}
          href="/signup"
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1,
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          Signup
        </Button>
      </Stack>
    </div>
  );
}
