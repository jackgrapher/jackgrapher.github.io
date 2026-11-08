export type Language = 'vi' | 'en';

export type ProjectCategory = 'event' | 'wedding' | 'brand' | 'concert';
export type ProjectFilter = 'all' | ProjectCategory;
export type MediaType = 'photo' | 'video';
export type MediaFilter = 'all' | MediaType;
export type CityFilter = 'all' | 'saigon' | 'hanoi' | 'other';
export type SortOrder = 'newest' | 'oldest' | 'az';
export type ViewMode = 'grid' | 'list';

export interface Project {
  id: string;
  category: ProjectCategory;
  mediaType: MediaType;
  title: string;
  titleEn: string;
  client?: string;
  location: string;
  city: 'saigon' | 'hanoi' | 'other';
  year: string;
  /** Thời lượng phim, ví dụ '02:45' (chỉ cho video) */
  duration?: string;
  description?: string;
  descriptionEn?: string;
  tags: string[];
  featured?: boolean;
  thumbnailUrl: string;
  highResUrl: string;
  /** Bộ ảnh hiển thị trong lightbox (cho dự án ảnh) */
  gallery?: string[];
  /** Link .mp4 hoặc link YouTube (cho dự án video) */
  videoUrl?: string;
  aspect: 'portrait' | 'landscape' | 'square';
}
