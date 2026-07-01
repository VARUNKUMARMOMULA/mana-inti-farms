import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL;
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
