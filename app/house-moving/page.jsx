import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import HouseMovers from "@/src/screens/HouseMovers";
import { getSeoMetadata } from "@/src/lib/seo";

export async function generateMetadata() {
  return await getSeoMetadata(
    'house-moving',
    'House Moving Services | Galaxy Movers Regina',
    'Professional residential and house moving services in Regina, Saskatchewan. Licensed, insured, and experienced home movers.'
  );
}

export default function HouseMovingPage() {
  return (
    <>
      <Navbar />
      <HouseMovers />
      <Footer />
    </>
  );
}
