import PublicLayout from "../layouts/PublicLayout";
import PatrocinadoresHero from "../components/Patrocinadores/PatrocinadoresHero";
import SponsorCarousel from "../components/Patrocinadores/SponsorCarousel";
import SponsorCta from "../components/Patrocinadores/SponsorCta";

export default function PatrocinadoresPage() {
  return (
    <PublicLayout className="web-public--patro patrocinadores-pagina">
      <PatrocinadoresHero />
      <SponsorCarousel />
      <SponsorCta />
    </PublicLayout>
  );
}
