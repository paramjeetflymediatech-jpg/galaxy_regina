import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import InsuranceClaims from "@/src/components/InsuranceClaims/InsuranceClaims";
import { getSeoMetadata } from "@/src/lib/seo";

export async function generateMetadata() {
  return await getSeoMetadata(
    'insurance',
    'Moving Insurance | Galaxy Movers Regina',
    'Learn about our comprehensive moving insurance and cargo protection coverage policies for a stress-free transition.'
  );
}

export default function InsurancePage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <InsuranceClaims/>
      </main>
      <Footer />
    </>
  );
}