import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { Header } from "@/components/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <Header />
          <main className="pt-16">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
