import { Inter } from "next/font/google";
import "./globals.css";
import { createFlagsmithInstance } from "flagsmith";
import Providers from "./Providers";
import Provider from "./provider";
import flagsmith from "flagsmith/isomorphic";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "what do you meme?",
  description: "the online version of what do you meme?",
};

export default async function RootLayout({ children }) {
  const flagsmithState = await flagsmith
    .init({
      // fetches flags on the server
      environmentID: "XjcvMYrXy8z82VKTCGAg7J",
    })
    .then(() => {
      return flagsmith.getState();
    });
  return (
    <html lang="en">
      <Providers>
        <Provider flagsmithState={flagsmithState}>
          <body className={inter.className}>{children}</body>
        </Provider>
      </Providers>
    </html>
  );
}
