import { UUID } from 'src/common/entities/uuid/uuid';
import { TemplatesNamesType, TemplateSettings } from 'src/common/templates/templates.types';

export type EmailQueueData = {
  template?: TemplatesNamesType;
  context?: Record<string, any>;
  to: string;
  from?: string;
  cc?: string;
  subject?: string;
  body?: string;
};

export class EmailQueueEntity {
  readonly id: string;
  readonly template?: TemplatesNamesType;
  readonly context: Readonly<Record<string, any>>;
  readonly to: string;
  readonly from?: string;
  readonly cc?: string;
  readonly subject?: string;
  readonly body?: string;

  constructor(data: EmailQueueData, templateSettings?: TemplateSettings) {
    this.id = new UUID().value;
    this.template = data.template;
    this.context = Object.freeze({
      ...templateSettings?.defaultContext,
      ...data.context,
      currentYear: new Date().getFullYear(),
    });

    this.to = data.to;
    this.from = data.from || 'noreply@company.com';
    this.cc = data.cc;
    this.subject = data.subject || templateSettings?.subject;
    this.body = data.body;
  }
}
