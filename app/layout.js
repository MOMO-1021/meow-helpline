import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata = {
  title: "MEOW'S HELPLINE SERVICE",
  description: "A safe, anonymous helpline by teenagers for teenagers in Manipur. We offer support in Meitei lon and a safe space to share your problems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
