import React from 'react';
import { AudienceHeaderContainer } from '../_components/audience-header-container';
import { FontThemeForm } from '@/components/forms/font-theme-form';

export default function FontThemePage() {
  return (
    <React.Fragment>
      <AudienceHeaderContainer
        title="Font Theme"
        description="Choose your font theme:"
      />

      <FontThemeForm />
    </React.Fragment>
  );
}
