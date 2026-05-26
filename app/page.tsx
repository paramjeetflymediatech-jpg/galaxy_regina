import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import HomePage from "@/src/screens/Home";
import { getSeoMetadata } from "@/src/lib/seo";

export async function generateMetadata() {
  return await getSeoMetadata(
    'home',
    'Galaxy Movers Regina | Trusted Local Moving Company',
    'Professional moving and storage services in Regina, Saskatchewan. Reliable, licensed, and insured movers. Get your free moving quote today!'
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />
    </>
  );
}