import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ShellLayout } from "./shell-layout";

export const metadata: Metadata = {
  title: "SundaySchool Finance Portal",
  description: "Sunday School Contribution Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ShellLayout>{children}</ShellLayout>
        </Providers>
      </body>
    </html>
  );
}