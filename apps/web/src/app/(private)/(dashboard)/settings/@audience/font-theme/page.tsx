import { FontThemeForm } from '@/components/forms/font-theme-form';
import React from 'react';
import { AudienceHeaderContainer } from '../_components/audience-header-container';

export default function FontThemePage() {
  return (
    <React.Fragment>
      <AudienceHeaderContainer title="Font Theme" description="Choose your font theme:" />

      <FontThemeForm />
    </React.Fragment>
  );
}
