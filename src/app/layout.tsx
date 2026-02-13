import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@/src/styles/themes.css";
import "@/src/styles/globals.css";
import ThemeContainer from "../components/ThemeContainer";

export const metadata: Metadata = {
  title: "Vroom - Video Conferencing",
  description: "Virtual avatar video conferencing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <ThemeContainer>{children}</ThemeContainer>
        </body>
      </html>
    </ClerkProvider>
  );
}
