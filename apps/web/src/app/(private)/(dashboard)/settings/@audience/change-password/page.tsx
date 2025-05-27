import { ChangePasswordForm } from '@/components/forms/change-password-form';
import React from 'react';
import { AudienceHeaderContainer } from '../_components/audience-header-container';

export default function ChangePasswordPage() {
  return (
    <React.Fragment>
      <AudienceHeaderContainer title="Change Password" />
      <ChangePasswordForm />
    </React.Fragment>
  );
}
