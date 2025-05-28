import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/exceptions.utils';
import { TemplatesNamesType } from 'src/common/templates/templates.types';

export class NoSettingTemplate extends BaseHttpException {
  constructor(template: TemplatesNamesType) {
    super(
      {
        message: `Template settings not found for template: ${template}`,
        code: 'NO_SETTING_TEMPLATE',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'NO_SETTING_TEMPLATE'
    );
  }
}

export class TemplateNotFound extends BaseHttpException {
  constructor(template: TemplatesNamesType) {
    super(
      {
        message: `Template not found: ${template}`,
        code: 'TEMPLATE_NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
      'TEMPLATE_NOT_FOUND'
    );
  }
}
