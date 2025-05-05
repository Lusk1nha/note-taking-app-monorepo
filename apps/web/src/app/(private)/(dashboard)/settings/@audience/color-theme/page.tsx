import { ColorForm } from './_components/color-form';

import { AudienceHeaderContainer } from '../_components/audience-header-container';
import React from 'react';

export default function ColorThemePage() {
  return (
    <React.Fragment>
      <AudienceHeaderContainer
        title="Color Theme"
        description="Choose your color theme:"
      />

      <ColorForm />
    </React.Fragment>
  );
}
