import React from 'react';
import { AudienceHeaderContainer } from '../_components/audience-header-container';
import { ChangePasswordForm } from '@/components/forms/change-password-form';

export default function ChangePasswordPage() {
  return (
    <React.Fragment>
      <AudienceHeaderContainer title="Change Password" />
      <ChangePasswordForm />
    </React.Fragment>
  );
}
