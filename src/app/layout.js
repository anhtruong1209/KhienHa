import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam",
});

export const metadata = {
  title: "Khiên Hà | Công ty TNHH TM Đóng Tàu Hàng Đầu Việt Nam",
  description: "Khiên Hà chuyên đóng mới và sửa chữa tàu nội địa, tàu biển, tàu biển chuyên tuyến quốc tế, sà lan biển với hơn 20 năm kinh nghiệm.",
  keywords: "đóng tàu, sửa chữa tàu, Khiên Hà, Hải Phòng, đóng tàu biển, sà lan biển",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${beVietnam.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}

