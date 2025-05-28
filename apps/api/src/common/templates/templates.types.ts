export const TEMPLATES_NAMES = {
  REGISTER: 'register',
  LOGIN_NOTIFICATION: 'login-notification',
} as const;

export type TemplatesNamesType = (typeof TEMPLATES_NAMES)[keyof typeof TEMPLATES_NAMES];

export type TemplateSettings = {
  subject?: string;
  defaultContext?: Record<string, any>;
};
