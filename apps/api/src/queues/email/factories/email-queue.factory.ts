import { TEMPLATES_SETTINGS } from 'src/common/templates/templates.common';
import { EmailQueueEntity, EmailQueueData } from '../entity/email-queue.entity';

import { TemplateSettings, TemplatesNamesType } from 'src/common/templates/templates.types';
import { TemplateNotFound } from '../errors/email-queue.errors';

export class EmailQueueFactory {
  static create(data: EmailQueueData): EmailQueueEntity {
    const templateSettings = data.template ? this._getTemplateSettings(data.template) : undefined;
    return new EmailQueueEntity(data, templateSettings);
  }

  private static _getTemplateSettings(template: TemplatesNamesType): TemplateSettings {
    const settings = TEMPLATES_SETTINGS[template];

    if (!settings) {
      throw new TemplateNotFound(template);
    }

    return settings;
  }
}
