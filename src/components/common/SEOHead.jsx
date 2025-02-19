// src/components/common/SEOHead.jsx
import Head from 'next/head';

export default function SEOHead({
  title = 'Document Audit Platform',
  description = 'AI-powered document analysis and collaboration platform',
  keywords = 'document audit, AI analysis, collaboration',
  ogImage = '/og-image.jpg'
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}