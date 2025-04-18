import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "~/providers/auth-provider";
import QueryClientProviderWrapper from "~/providers/query-client-provider";
import { ThemeProvider } from "~/providers/theme-provider";
import "~/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "no_strings",
  description: "no_strings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable}${geistMono.variable} flex h-full bg-secondary antialiased dark:bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProviderWrapper>
            <AuthProvider>{children}</AuthProvider>
          </QueryClientProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
