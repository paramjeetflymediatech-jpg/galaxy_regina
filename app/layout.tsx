import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import { Content, Seo } from "@/src/lib/models";
import { Op } from "sequelize";
import { headers } from "next/headers";
import HeadScript from "@/src/components/Seo/HeadScript";
import {getSeoMetadata} from "@/src/lib/seo"
export const forceDynamic = 'force-dynamic'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// Fetch scripts on the server side
async function getGlobalScripts() {
  try {
    // Try loading from the Seo table first
    let seoRecord = await Seo.findOne({
      where: { page_path: 'global' }
    });

    if (seoRecord) {
      return {
        header: seoRecord.header_scripts || '',
        footer: seoRecord.footer_scripts || ''
      };
    }

    // Fallback and migrate from the site_contents table if present
    const results = await Content.findAll({
      where: { page: 'global', section: 'scripts' },
    });

    if (results.length > 0) {
      const scripts = results.reduce((acc: Record<string, string>, item) => {
        acc[item.key] = item.value || '';
        return acc;
      }, { header: '', footer: '' });

      // Migrate to Seo table
      await Seo.upsert({
        page_path: 'global',
        header_scripts: scripts.header,
        footer_scripts: scripts.footer,
      });
      return {
        header: scripts.header || '',
        footer: scripts.footer || ''
      };
    
    }
  } catch (error) {
    console.error("❌ Failed to load global header/footer scripts from Seo table:", error);
  }
  return { header: '', footer: '' };
}

// Fetch page-specific SEO record on the server side
// async function getPageSpecificSeo(pathname: string) {
//   if (!pathname) return null;

//   try {
//     const slug = pathname.split('/').pop() || '';
//     const seoRecord = await Seo.findOne({
//       where: {
//         [Op.or]: [
//           { page_path: pathname },
//           { page_path: { [Op.like]: `%${pathname}` } },
//           ...(slug ? [
//             { page_path: `/location/${slug}` },
//             { page_path: { [Op.like]: `%/${slug}` } }
//           ] : [])
//         ]
//       }
//     });

//     return seoRecord;
//   } catch (error) {
//     console.error("❌ Failed to load page-specific SEO record:", error);
//   }
//   return null;
// }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { header: globalHeader, footer: globalFooter } = await getGlobalScripts();

  // Read current request path from request headers
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';
  const seoRecord = await getSeoMetadata(pathname);
 
  const faqSchema = seoRecord?.faqSchema || null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />

        {/* Dynamic Page-Specific SEO Metadata from Seo Table */}
        {seoRecord?.title && <title>{seoRecord.title}</title>}
        {seoRecord?.description && <meta name="description" content={seoRecord.description} />}
        {seoRecord?.keywords && <meta name="keywords" content={seoRecord.keywords} />}
        {seoRecord?.canonical_url && <link rel="canonical" href={seoRecord.canonical_url} />}
        {seoRecord?.og_title && <meta property="og:title" content={seoRecord.og_title} />}
        {seoRecord?.og_description && <meta property="og:description" content={seoRecord.og_description} />}
        {seoRecord?.og_image && <meta property="og:image" content={seoRecord.og_image} />}


        {/* Dynamic Server-Side FAQ Schema injection from Seo Table */}
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        {/* Dynamic Server-Side Header Script Injection */}
        {globalHeader && <HeadScript html={globalHeader} />}
        {seoRecord?.header_scripts && <HeadScript html={seoRecord.header_scripts} />}

        {/* Dynamic Server-Side Footer Script Injection hoisted to Head */}
        {globalFooter && <HeadScript html={globalFooter} />}
        {seoRecord?.footer_scripts && <HeadScript html={seoRecord.footer_scripts} />}
      </head>

      <body className="min-h-full flex flex-col">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        {/* PAGES */}
        {children}
      </body>
    </html>
  );
}