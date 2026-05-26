import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import StorageServices from "@/src/components/StorageServices/StorageServices";
import { getSeoMetadata } from "@/src/lib/seo";

export async function generateMetadata() {
  return await getSeoMetadata(
    'storage-services',
    'Secure Storage Services | Galaxy Movers Regina',
    'Safe and secure short-term and long-term storage services in Regina, Saskatchewan. Climate-controlled and monitored facilities.'
  );
}

export default function StorageServicesPage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <StorageServices />
      </main>
      <Footer />
    </>
  );
}
