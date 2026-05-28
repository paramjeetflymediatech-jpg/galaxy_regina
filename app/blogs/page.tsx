import Navbar from "@/src/components/Navbar/Navbar";
import Blog from "@/src/screens/Blog";
import { getSeoMetadata } from "@/src/lib/seo";

export async function generateMetadata() {
  return await getSeoMetadata(
    'blogs',
    'Blog Updates & Moving Tips | Galaxy Movers Regina',
    'Stay updated with the latest news, relocation guides, and expert moving tips from Galaxy Movers Regina, Saskatchewan.'
  );
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <Blog />
    </>
  );
}