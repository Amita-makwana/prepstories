import { Helmet } from "react-helmet-async";

const BASE_URL = import.meta.env.VITE_APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://prepstories.com");

export default function PageSEO({
  title,
  description,
  canonical,
  image,
  type = "website",
  noindex = false
}) {
  const fullTitle = title
    ? (title.includes(" | PrepStories") ? title : `${title} | PrepStories`)
    : "PrepStories | Placement Preparation Stories";
  const fullDescription = description || "Discover authentic interview stories shared by real candidates. Prepare smarter with placement experiences.";
  const fullCanonical = canonical ? (canonical.startsWith("http") ? canonical : `${BASE_URL}${canonical.startsWith("/") ? "" : "/"}${canonical}`) : BASE_URL + "/";
  const fullImage = image || `${BASE_URL}/templogo.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {canonical && <link rel="canonical" href={fullCanonical} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
    </Helmet>
  );
}
