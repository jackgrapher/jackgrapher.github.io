import siteJson from '../../content/site.json';

/** Thông tin chung của website — chỉnh trong /admin → "Thông tin chung" (file content/site.json). */
export const site = siteJson;

const digits = (s: string) => s.replace(/[^\d]/g, '');
const isFilled = (s?: string) => !!s && !/^\[.*\]$/.test(s.trim());
const c = site.contact as typeof site.contact & Partial<Record<'hours' | 'hoursEn' | 'youtube' | 'tiktok', string>>;

export const contact = {
  ...c,
  hasPhone: isFilled(c.phone) && digits(c.phone).length >= 8,
  hasEmail: isFilled(c.email) && c.email.includes('@'),
  /** Link Zalo: ưu tiên ô "Zalo", không có thì dùng số điện thoại */
  zaloUrl: (() => {
    const z = (c.zalo || '').trim();
    if (z.startsWith('http')) return z;
    const num = digits(z || c.phone || '');
    return num ? `https://zalo.me/${num}` : 'https://zalo.me';
  })(),
  telUrl: `tel:${digits(c.phone || '')}`,
  hours: (lang: 'vi' | 'en') => (lang === 'en' && c.hoursEn) || c.hours || '',
};

export type SocialKey = 'facebook' | 'instagram' | 'youtube' | 'tiktok';

/** Các mạng xã hội đã điền link trong admin (ô trống sẽ tự ẩn) */
export const socials = (
  [
    { key: 'facebook', label: 'Facebook', url: c.facebook },
    { key: 'instagram', label: 'Instagram', url: c.instagram },
    { key: 'youtube', label: 'YouTube', url: c.youtube },
    { key: 'tiktok', label: 'TikTok', url: c.tiktok },
  ] as { key: SocialKey; label: string; url?: string }[]
).filter((s) => !!s.url && /^https?:\/\/.+\..+\/.+/.test(s.url));
