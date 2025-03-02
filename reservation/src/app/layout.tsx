import "./globals.css";
import StateProvider from "./rootLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <StateProvider>{children}</StateProvider>
      </body>
    </html>
  );
}
