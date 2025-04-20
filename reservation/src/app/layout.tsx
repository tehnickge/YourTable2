import { Settings } from "luxon";
import "./globals.css";
import StateProvider from "./rootLayout";

// Глобальная конфигурация Luxon
Settings.defaultZone = "Europe/Moscow";
Settings.defaultLocale = "ru";

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
