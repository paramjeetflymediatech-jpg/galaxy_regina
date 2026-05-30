import Navbar from "@/src/components/Navbar/Navbar";
import Locations from "@/src/components/Locations/MovingCompanyWebsite";
import { Location, Seo } from "@/src/lib/models";
import { Op } from "sequelize";

// Fetch location data on the server side
async function getLocationData(slug) {
  try {
    let locationSlug = slug;
    if (slug && slug.includes('-in-')) {
      const parts = slug.split('-in-');
      locationSlug = parts[1];
    }
    const location = await Location.findOne({ where: { slug: locationSlug } });
    return location;
  } catch (error) {
    console.error("❌ Failed to fetch location metadata:", error);
    return null;
  }
}

export default async function LocationPage() {
  return (
    <>
      <Navbar />
      <Locations />
    </>
  );
}