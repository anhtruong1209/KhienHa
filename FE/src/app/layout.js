import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam",
});

export const metadata = {
  title: "Khiên Hà | Đóng mới và sửa chữa tàu chuyên nghiệp tại Hải Phòng",
  description:
    "Khiên Hà chuyên đóng mới, sửa chữa tàu nội địa, tàu biển, sà lan biển và các phương tiện thủy chuyên dụng với năng lực đến 25.000 DWT.",
  keywords:
    "đóng tàu, sửa chữa tàu, Khiên Hà, Hải Phòng, đóng mới tàu biển, sà lan biển, shipbuilding",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${beVietnam.variable} bg-background font-sans text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
