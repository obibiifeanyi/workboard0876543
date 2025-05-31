
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const defaultSEO = {
  title: 'CT Communication Towers - Telecom Infrastructure Management System',
  description: 'Professional telecom infrastructure management, tower maintenance, network optimization, and communication solutions across Nigeria.',
  keywords: 'telecom towers, communication infrastructure, Nigeria telecom, tower maintenance, network optimization, telecom services, CT Communication',
  image: '/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png',
  type: 'website'
};

export const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website' 
}: SEOHeadProps) => {
  const location = useLocation();
  
  const seoTitle = title ? `${title} | CT Communication Towers` : defaultSEO.title;
  const seoDescription = description || defaultSEO.description;
  const seoKeywords = keywords ? `${keywords}, ${defaultSEO.keywords}` : defaultSEO.keywords;
  const seoImage = image || defaultSEO.image;
  const seoUrl = url || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = seoTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seoDescription);
    updateMetaTag('keywords', seoKeywords);

    // Open Graph tags
    updateMetaTag('og:title', seoTitle, true);
    updateMetaTag('og:description', seoDescription, true);
    updateMetaTag('og:image', seoImage, true);
    updateMetaTag('og:url', seoUrl, true);
    updateMetaTag('og:type', type, true);

    // Twitter tags
    updateMetaTag('twitter:title', seoTitle);
    updateMetaTag('twitter:description', seoDescription);
    updateMetaTag('twitter:image', seoImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoUrl);

  }, [seoTitle, seoDescription, seoKeywords, seoImage, seoUrl, type]);

  return null;
};
