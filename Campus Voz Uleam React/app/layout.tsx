
import React from "react";
import type { ReactNode } from "react";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Campus Voz ULEAM",
  description: "Plataforma de participación universitaria",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
