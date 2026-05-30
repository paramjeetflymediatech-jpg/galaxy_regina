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

// Generate dynamic SEO metadata from the database
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    // Try to find specific SEO record for this slug, matching ends-with since it might have a state prefix
    const seoRecord = await Seo.findOne({ 
      where: { 
        [Op.or]: [
          { page_path: `/location/${slug}` },
          { page_path: { [Op.like]: `%/${slug}` } }
        ]
      } 
    });

    if (seoRecord) {
      return {
        title: seoRecord.title || undefined,
        description: seoRecord.description || undefined,
        keywords: seoRecord.keywords || undefined,
        alternates: seoRecord.canonical_url ? { canonical: seoRecord.canonical_url } : undefined,
        openGraph: {
          title: seoRecord.og_title || seoRecord.title || undefined,
          description: seoRecord.og_description || seoRecord.description || undefined,
          images: seoRecord.og_image ? [{ url: seoRecord.og_image }] : undefined,
        }
      };
    }
  } catch (err) {
    console.error("SEO fetch error:", err);
  }

  const location = await getLocationData(slug);

  return {
    title: location?.meta_title || location?.location_name || "Moving Services",
    description: location?.meta_description || `Professional moving services in ${location?.location_name || "your area"}.`,
    keywords: location?.meta_keywords || "movers, moving company",
  };
}

export default async function LocationPage() {
  return (
    <>
      <Navbar />
      <Locations />
    </>
  );
}