export interface Photo {
  id: string;
  name: string;
  mimeType: string;
  thumbnailUrl: string;
  url: string;
  categoryName?: string;
  categorySlug?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  totalAvailable: number;
  photos: Photo[];
}

export interface GalleryResponse {
  success: boolean;
  categories: Category[];
  allPhotos: Photo[];
  error?: string;
}

export interface PortfolioItem {
  id: string;
  category: string;
  categorySlug: string;
  thumbnailUrl: string;
  image: string; // full resolution image for lightbox
  title: string;
}
