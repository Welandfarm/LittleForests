import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string; // e.g. "/about" or "/products/123"
  image?: string;
  type?: 'website' | 'product' | 'article';
  jsonLd?: Record<string, any>;
  noindex?: boolean;
}

const SITE_URL = 'https://littleforest.co.ke';
const DEFAULT_IMAGE = `${SITE_URL}/lovable-uploads/82ebeeb5-b8dd-4161-9668-d9077f5da34d.png`;

/**
 * Renders unique <title>, meta description, canonical, Open Graph, Twitter
 * card, and optional JSON-LD for a single route. Every page that a user
 * (or a crawler) can land on directly should render this once with
 * route-specific values — that's what makes each URL distinct to Google
 * and to non-JS AI crawlers once the page is prerendered.
 */
export default function SEO({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  noindex = false,
}: SEOProps) {
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type === 'product' ? 'product' : 'website'} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
