export interface MediaItem {
  url: string;
  caption?: string;
  order: number;
}

export interface SiteSettings {
  key: string;
  value: unknown;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  ip?: string | null;
  read: boolean;
  createdAt: Date;
}
