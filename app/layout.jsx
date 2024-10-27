import { Toaster } from 'react-hot-toast';
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "APLIS",
  description: "AI Powered Learning & Information System"
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
        position='bottom-center'
        toastOptions={{
          duration: 3000,
        }} 
        /> 
      </body>
    </html>
  );
}
