import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToastProvider from "../components/ToastProvider";
import DynamicTitle from "../components/DynamicTitle";

export const metadata = {
  title: "LegalEase — Find & Hire Trusted Lawyers",
  description: "Browse verified lawyers, hire for your legal matters, and manage everything from one dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider />
            <DynamicTitle />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
