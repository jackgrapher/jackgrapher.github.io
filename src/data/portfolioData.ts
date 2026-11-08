import { Project } from '../types';

/**
 * Dữ liệu dự án được quản lý trong trang /admin.
 * Mỗi dự án là một file JSON trong thư mục content/projects/ — tên file chính là id của dự án.
 * Đừng sửa tay ở đây; vào /admin để thêm, sửa, xoá dự án.
 */
type ProjectFile = Omit<Project, 'id'> & { order?: number };

const files = import.meta.glob<ProjectFile>('../../content/projects/*.json', {
  eager: true,
  import: 'default',
});

export const portfolioProjects: Project[] = Object.entries(files)
  .map(([path, data]) => {
    const id = path.split('/').pop()!.replace(/\.json$/, '');
    const { order: _order, ...rest } = data;
    return {
      ...rest,
      id,
      year: String(rest.year ?? ''),
      tags: rest.tags ?? [],
      thumbnailUrl: rest.thumbnailUrl || rest.highResUrl,
      highResUrl: rest.highResUrl || rest.thumbnailUrl,
      gallery: rest.gallery?.length ? rest.gallery : undefined,
      videoUrl: rest.videoUrl || undefined,
    } as Project;
  })
  .sort((a, b) => (files[`../../content/projects/${a.id}.json`].order ?? 999) - (files[`../../content/projects/${b.id}.json`].order ?? 999));
