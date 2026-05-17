import "./globals.css";

export const metadata = {
  title: "Cotizador EcoFlow",
  description: "Encuentra tu solución de energía ideal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
