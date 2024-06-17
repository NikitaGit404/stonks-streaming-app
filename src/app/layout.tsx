import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/session-provider";

import { getServerSession } from "next-auth";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import { Knock } from "@knocklabs/node";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Streaming App",
  description: "A streaming app built with Next.js.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (session) {
    const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY);
    const knockUser = await knockClient.users.identify(
      session?.user?.email ?? "",
      {
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
      }
    );
    console.log(knockUser);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
