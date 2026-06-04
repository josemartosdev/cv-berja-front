import Cabecera from "../components/Cabecera";
import Footer from "../components/Footer";

/**
 * Shell común de la web pública: cabecera + contenido a ancho completo + pie.
 */
export default function PublicLayout({ children, className = "" }) {
  const mainClass = ["web-public", className].filter(Boolean).join(" ");

  return (
    <>
      <Cabecera />
      <main className={mainClass}>{children}</main>
      <Footer />
    </>
  );
}
