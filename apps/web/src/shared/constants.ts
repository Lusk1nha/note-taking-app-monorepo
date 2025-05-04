export const APP_NAME = 'Personal Blog' as const satisfies string;
export const APP_DESCRIPTION = 'A personal blog';
export const APP_ARTICLES_TO_SHOW = 5 as const satisfies number;
export const APP_ENVIRONMENT = process.env.NEXT_PUBLIC_APP_ENVIRONMENT as
  | 'development'
  | 'production'
  | 'staging';
export const APP_API_URL = process.env.NEXT_PUBLIC_API_URL as string;
