import Navbar from "@/src/components/Navbar/Navbar";
import Locations from "@/src/components/Locations/MovingCompanyWebsite";
import { Location } from "@/src/lib/models";

// Fetch location data on the server side
async function getLocationData(slug) {
  try {
    const location = await Location.findOne({ where: { slug } });
    return location;
  } catch (error) {
    console.error("❌ Failed to fetch location metadata:", error);
    return null;
  }
}

// Generate dynamic SEO metadata from the database
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const location = await getLocationData(resolvedParams.slug);

  return {
    title: location?.meta_title || location?.location_name || "Moving Services",
    description: location?.meta_description || `Professional moving services in ${location?.location_name || "your area"}.`,
    keywords: location?.meta_keywords || "movers, moving company",
  };
}

export default async function LocationPage({ params }) {
  // Await params as required by Next.js 15+
  await params;

  return (
    <>
      <Navbar />
      <Locations />
    </>
  );
}