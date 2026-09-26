import { useState, useEffect, useCallback } from 'react';
import type { Category, GalleryResponse, PortfolioItem, Photo } from '../types/gallery';

export interface CategoryNav {
  name: string;
  slug: string;
  photoCount?: number;
}

export function useGallery() {
  const [categories, setCategories] = useState<CategoryNav[]>([{ name: 'All', slug: 'all' }]);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gallery');
      if (!res.ok) {
        throw new Error(`Failed to load gallery (HTTP ${res.status})`);
      }

      const data: GalleryResponse = await res.json();
      if (!data.success || !Array.isArray(data.categories)) {
        throw new Error(data.error || 'Invalid gallery data received.');
      }

      setCategoryData(data.categories);
      setAllPhotos(data.allPhotos || []);

      // Build category navigation array starting with "All"
      const navCategories: CategoryNav[] = [
        { name: 'All', slug: 'all', photoCount: data.allPhotos?.length || 45 },
        ...data.categories.map((c) => ({
          name: c.name,
          slug: c.slug,
          photoCount: c.photos?.length || 0,
        })),
      ];

      setCategories(navCategories);
    } catch (err: any) {
      console.error('Error fetching gallery from Google Drive:', err);
      setError(err?.message || 'Failed to load gallery from Google Drive.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Helper to format photos into clean PortfolioItems
  const getPhotosForSlug = useCallback(
    (slug: string): { categoryName: string; items: PortfolioItem[] } => {
      const cleanTitle = (name: string) =>
        name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .trim();

      if (slug === 'all' || !slug) {
        return {
          categoryName: 'All Photos',
          items: allPhotos.map((photo) => ({
            id: photo.id,
            category: photo.categoryName || 'Featured',
            categorySlug: photo.categorySlug || 'all',
            thumbnailUrl: photo.thumbnailUrl || `${photo.url}&size=thumb`,
            image: photo.url,
            title: cleanTitle(photo.name) || 'Featured Photo',
          })),
        };
      }

      const category = categoryData.find(
        (c) => c.slug.toLowerCase() === slug.toLowerCase()
      );

      if (!category) {
        return { categoryName: slug, items: [] };
      }

      return {
        categoryName: category.name,
        items: category.photos.map((photo) => ({
          id: photo.id,
          category: category.name,
          categorySlug: category.slug,
          thumbnailUrl: photo.thumbnailUrl || `${photo.url}&size=thumb`,
          image: photo.url,
          title: cleanTitle(photo.name) || photo.name,
        })),
      };
    },
    [allPhotos, categoryData]
  );

  return {
    categories,
    categoryData,
    allPhotos,
    getPhotosForSlug,
    isLoading,
    error,
    refetch: fetchGallery,
  };
}
