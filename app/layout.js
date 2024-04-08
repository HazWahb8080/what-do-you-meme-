"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "what do you meme?",
//   description: "the online version of what do you meme?",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <RecoilRoot>
        <body className={inter.className}>{children}</body>
      </RecoilRoot>
    </html>
  );
}
