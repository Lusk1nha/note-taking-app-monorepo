import { UUID } from 'src/common/entities/uuid/uuid';
import { TEMPLATES_NAMES_TYPE } from 'src/common/templates/templates.common';

export interface EmailQueueData {
  template?: TEMPLATES_NAMES_TYPE;
  context?: Record<string, any>;

  to: string;
  from?: string;
  cc?: string;
  subject: string;
  body?: string;
}

export class EmailQueueEntity {
  constructor(data: EmailQueueData) {
    this.id = new UUID().value;

    this.template = data?.template;
    this.context = data?.context;

    this.to = data.to;
    this.from = data.from;

    this.cc = data.cc;
    this.subject = data.subject;
    this.body = data.body;
  }

  template?: TEMPLATES_NAMES_TYPE;
  context?: Record<string, any>;

  id: string;
  to: string;
  from?: string;
  cc?: string;
  subject: string;
  body?: string;
}
