"use client";

import { AuthProvider } from '@/components/auth-provider';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster"

export default function SDRLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        {children}
    </>
  );
}
