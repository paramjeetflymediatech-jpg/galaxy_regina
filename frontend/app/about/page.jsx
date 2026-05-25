import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import About from "@/src/screens/About";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchAboutContent() {
  try {
    const response = await fetch(`${API_URL}/api/content/page/about`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    return json.success ? json.content : null;
  } catch (error) {
    console.error('Failed to fetch About page content:', error);
    return null;
  }
}

export async function generateMetadata() {
  const content = await fetchAboutContent();
  const seo = content?.seo || {};

  return {
    title: seo.aboutTitle || 'About Galaxy Movers Regina',
    description: seo.aboutDescription || 'Learn more about Galaxy Movers Regina, your trusted moving partner in Saskatchewan.',
  };
}

export default async function AboutPage() {
  const content = await fetchAboutContent();

  return (
    <>
      <Navbar />
      <About content={content} />
      <Footer />
    </>
  );
}