export const APP_NAME = process.env.NEXT_APP_NAME as string;
export const APP_DESCRIPTION = process.env.NEXT_APP_DESCRIPTION as string;

export const APP_ENVIRONMENT = process.env.NEXT_PUBLIC_APP_ENVIRONMENT as
  | 'development'
  | 'production'
  | 'staging';

export const APP_API_URL = process.env.NEXT_PUBLIC_API_URL as string;
