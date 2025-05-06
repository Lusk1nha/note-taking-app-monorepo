import { ColorThemeForm } from '@/components/forms/color-theme-form';
import { AudienceHeaderContainer } from '../_components/audience-header-container';
import React from 'react';

export default function ColorThemePage() {
  return (
    <React.Fragment>
      <AudienceHeaderContainer
        title="Color Theme"
        description="Choose your color theme:"
      />

      <ColorThemeForm />
    </React.Fragment>
  );
}
