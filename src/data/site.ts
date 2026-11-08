import siteJson from '../../content/site.json';

/** Thông tin chung của website — chỉnh trong /admin → "Thông tin chung" (file content/site.json). */
export const site = siteJson;

const digits = (s: string) => s.replace(/[^\d]/g, '');
const isFilled = (s?: string) => !!s && !/^\[.*\]$/.test(s.trim());

export const contact = {
  ...site.contact,
  hasPhone: isFilled(site.contact.phone),
  hasEmail: isFilled(site.contact.email),
  /** Link Zalo: ưu tiên ô "Zalo", không có thì dùng số điện thoại */
  zaloUrl: (() => {
    const z = (site.contact.zalo || '').trim();
    if (z.startsWith('http')) return z;
    const num = digits(z || site.contact.phone || '');
    return num ? `https://zalo.me/${num}` : 'https://zalo.me';
  })(),
  telUrl: `tel:${digits(site.contact.phone || '')}`,
};
