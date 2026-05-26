import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import LicenseComponents from "@/src/components/LicenseComponents/LicenseComponents";
import { getSeoMetadata } from "@/src/lib/seo";

export async function generateMetadata() {
  return await getSeoMetadata(
    'license',
    'Licensing & Credentials | Galaxy Movers Regina',
    'Read about the licensing, operating authorities, and professional credentials of Galaxy Movers Regina.'
  );
}

export default function LicensePage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <LicenseComponents />
      </main>
      <Footer />
    </>
  );
}