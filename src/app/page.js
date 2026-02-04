'use client';

import Image from "next/image";
import Link from "next/link";
import { Button, Stack } from "@mui/material";
import LoginPage from "./login/page.jsx";



export default function Home() {
  return (
    <div>
      <LoginPage></LoginPage>
    </div>
  );
}
