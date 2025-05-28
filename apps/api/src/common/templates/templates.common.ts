export const TEMPLATES_NAMES = {
  REGISTER: 'register',
} as const;

export type TEMPLATES_NAMES_TYPE = (typeof TEMPLATES_NAMES)[keyof typeof TEMPLATES_NAMES];
