import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://manaintifarms.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/faq',
    '/delivery-policy',
    '/privacy-policy',
    '/terms',
    '/refund-policy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/products' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/products' ? 0.9 : 0.7,
  }));
}
