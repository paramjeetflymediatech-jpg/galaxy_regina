import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import About from "@/src/screens/About";
import { Content } from "@/src/lib/models";

async function fetchAboutContent() {
  try {
    const results = await Content.findAll({
      where: { page: 'about' },
    });

    const content = results.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.key] = item.value;
      return acc;
    }, {});

    return content;
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