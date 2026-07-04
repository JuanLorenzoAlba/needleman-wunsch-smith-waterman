import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Needleman-Wunsch vs Smith-Waterman",
  description:
    "Visualizador interactivo de alineamiento de secuencias por programación dinámica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
