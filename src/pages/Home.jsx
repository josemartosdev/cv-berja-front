import PublicLayout from "../layouts/PublicLayout";
import Inicio from "../components/Inicio/Inicio";

function Home() {
  return (
    <PublicLayout className="web-public--home">
      <Inicio />
    </PublicLayout>
  );
}

export default Home;
