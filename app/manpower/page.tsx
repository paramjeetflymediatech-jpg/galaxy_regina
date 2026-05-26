import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import Manpower from "@/src/components/Manpower/Manpower";
import { getSeoMetadata } from "@/src/lib/seo";

export async function generateMetadata() {
  return await getSeoMetadata(
    'manpower',
    'Professional Manpower Services | Galaxy Movers Regina',
    'Hire experienced and skilled labor/manpower for loading, unloading, packing, or moving in Regina, Saskatchewan.'
  );
}

export default function StorageServicesPage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Manpower />
      </main>
      <Footer />
    </>
  );
}
