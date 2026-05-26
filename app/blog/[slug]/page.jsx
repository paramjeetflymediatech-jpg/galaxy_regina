import React from "react";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import PageHero from "@/src/components/PageHero/PageHero";
import { Blog } from "@/src/lib/models";
import { notFound } from "next/navigation";

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

  const bgImage = post.image_url 
    ? `/uploads/${post.image_url}` 
    : "https://galaxymoversregina.ca/wp-content/uploads/2025/08/galaxy0regina.png";

  return (
    <>
      <Navbar />
      
      <PageHero
        title={post.title}
        bgImage={bgImage}
      />

      <article className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* Post Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
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
        </div>

        {/* Short Description */}
        {post.description && (
          <p className="text-xl text-gray-600 leading-relaxed font-light mb-8 italic pl-4 border-l-4 border-blue-500">
            {post.description}
          </p>
        )}

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

      <Footer />
    </>
  );
}
