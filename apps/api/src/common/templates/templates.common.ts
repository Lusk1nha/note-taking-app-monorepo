import { TemplatesNamesType, TemplateSettings, TEMPLATES_NAMES } from './templates.types';

export const TEMPLATES_SETTINGS: Record<TemplatesNamesType, TemplateSettings> = {
  [TEMPLATES_NAMES.REGISTER]: {
    subject: 'Welcome to Our Service',
    defaultContext: {
      companyName: 'Our Company',
    },
  },
  [TEMPLATES_NAMES.LOGIN_NOTIFICATION]: {
    subject: 'Login Notification',
  },
};
