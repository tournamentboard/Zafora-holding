export const STORAGE_FOLDER = {
  BRANDING_LOGO: "branding/logo",
  BRANDING_FAVICON: "branding/favicon",
  TEAM_PHOTOS: "team/photos",
  SERVICES_IMAGES: "services/images",
  TESTIMONIALS_PHOTOS: "testimonials/photos",
  PROJECTS_IMAGES: "projects/images",
  SITE_IMAGES_HOME: "site-images/home",
  SITE_IMAGES_SERVICES: "site-images/services",
  SITE_IMAGES_GOVERNMENT: "site-images/government",
} as const;

export type StorageFolder = (typeof STORAGE_FOLDER)[keyof typeof STORAGE_FOLDER];
