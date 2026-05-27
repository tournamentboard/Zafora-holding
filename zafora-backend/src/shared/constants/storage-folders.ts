export const S3_FOLDERS = {
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

export type S3Folder = (typeof S3_FOLDERS)[keyof typeof S3_FOLDERS];

export const ALLOWED_S3_FOLDERS = Object.values(S3_FOLDERS) as [S3Folder, ...S3Folder[]];
