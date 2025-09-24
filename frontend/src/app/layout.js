// /app/layout.js
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

export const metadata = { title: "Shepherd Security" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-screen">
        <Providers>
          <div className="flex flex-col h-full">
            <Header />
            <main className="flex-1 relative overflow-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
