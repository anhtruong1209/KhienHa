import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "vietnamese"],
});

export const metadata = {
  title: "Khiên Hà | Công ty TNHH TM Đóng Tàu Hàng Đầu Việt Nam",
  description: "Khiên Hà chuyên đóng mới và sửa chữa tàu nội địa, tàu biển, tàu biển chuyên tuyến quốc tế, sà lan biển với hơn 20 năm kinh nghiệm.",
  keywords: "đóng tàu, sửa chữa tàu, Khiên Hà, Hải Phòng, đóng tàu biển, sà lan biển",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}

