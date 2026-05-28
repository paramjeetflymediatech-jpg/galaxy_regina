import React from "react";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import PageHero from "@/src/components/PageHero/PageHero";
import { Blog, Faq } from "@/src/lib/models";
import { notFound } from "next/navigation";
import BlogContactForm from "./BlogContactForm";

// Server side data retrieval helper
async function getBlogPost(slug) {
  try {
    const post = await Blog.findOne({ where: { slug } });
    return post;
  } catch (error) {
    console.error("❌ Failed to fetch blog post:", error);
    return null;
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    return {
      title: "Blog Post Not Found | Galaxy Movers Regina",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.meta_title || `${post.title} | Galaxy Movers Regina`,
    description: post.meta_description || post.description || "Read our latest moving tips and guides.",
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  let faqs = [];
  try {
    faqs = await Faq.findAll();
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
  }

  const bgImage = "/Galaxy-Movers-Regina-8.jpeg";

  // Use DB FAQs if available, otherwise fallback to a default generic schema
  const schemaEntities = faqs.length > 0 
    ? faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    : [
        {
          "@type": "Question",
          "name": "How much does a local move cost in Regina?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The cost of a local move depends on the size of your home and the specific services required. We offer transparent, competitive hourly rates or flat-fee pricing depending on the job. Contact us for a free, accurate quote."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer packing services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Galaxy Movers provides comprehensive packing and unpacking services using high-quality materials to ensure your belongings are transported safely."
          }
        }
      ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": schemaEntities
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />

      <PageHero
        title={post.title}
        bgImage={bgImage}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT SIDE: Contact Form */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <BlogContactForm />
          </div>
        </aside>

        {/* RIGHT SIDE: Blog Content */}
        <article className="lg:col-span-8">
          {/* Post Metadata */}
          {/* <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
            {post.category && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-xs uppercase tracking-wider">
                {post.category}
              </span>
            )}
            <span>
              Published on {new Date(post.createdAt || post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div> */}

          {/* Short Description */}
          {/* {post.description && (
            <p className="text-xl text-gray-600 leading-relaxed font-light mb-8 italic pl-4 border-l-4 border-blue-500">
              {post.description}
            </p>
          )} */}

          {/* Featured Image inside Article */}
          {post.image_url && (
            <div className="mb-10 overflow-hidden rounded-xl shadow-lg aspect-video relative">
              <img
                src={`/uploads/${post.image_url}`}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Full Blog Content */}
          <div
            className="prose prose-blue max-w-none text-gray-800 leading-loose space-y-6"
            style={{ fontSize: "16px" }}
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>
      </div>

      <Footer />
    </>
  );
}
