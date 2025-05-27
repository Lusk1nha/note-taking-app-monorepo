import { ColorThemeForm } from '@/components/forms/color-theme-form';
import React from 'react';
import { AudienceHeaderContainer } from '../_components/audience-header-container';

export default function ColorThemePage() {
  return (
    <React.Fragment>
      <AudienceHeaderContainer title="Color Theme" description="Choose your color theme:" />

      <ColorThemeForm />
    </React.Fragment>
  );
}
