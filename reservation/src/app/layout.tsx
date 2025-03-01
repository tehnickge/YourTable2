"use client"
import { store } from "@/redux/store";
import "./globals.css";
import { Provider } from "react-redux";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="ru">
        <body>{children}</body>
      </html>
    </Provider>
  );
}
