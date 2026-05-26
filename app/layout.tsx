import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Content } from "@/src/lib/models";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default fallback metadata (pages can override using generateMetadata)
export const metadata: Metadata = {
  title: "Galaxy Movers Regina | Trusted Local Moving Company",
  description: "Professional moving services in Regina, Saskatchewan. Get a free quote today!",
};

// Fetch scripts on the server side
async function getGlobalScripts() {
  try {
    const results = await Content.findAll({
      where: { page: 'global', section: 'scripts' },
    });

    const scripts = results.reduce((acc: Record<string, string>, item) => {
      acc[item.key] = item.value || '';
      return acc;
    }, { header: '', footer: '' });

    return scripts;
  } catch (error) {
    console.error("❌ Failed to load global header/footer scripts:", error);
    return { header: '', footer: '' };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { header, footer } = await getGlobalScripts();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>

      <body className="min-h-full flex flex-col">
        {/* Header scripts injection immediately inside body */}
        {header && (
          <div
            id="global-header-scripts"
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{ __html: header }}
          />
        )}

        {/* PAGES */}
        {children}

        {/* Footer scripts injection immediately before closing body tag */}
        {footer && (
          <div
            id="global-footer-scripts"
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{ __html: footer }}
          />
        )}
      </body>
    </html>
  );
}