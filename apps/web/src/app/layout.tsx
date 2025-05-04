import { bootstrap } from '@/shared/bootstrap';

import { APP_DESCRIPTION, APP_NAME } from '@/shared/constants';
import type { Metadata } from 'next';

import '@note-taking-app/design-system/styles.css';
import '@note-taking-app/ui/styles.css';
import './styles.css';

import { SystemProviders } from './_components/system-providers';
import { NextArtefactProps } from '@/shared/common/next-types';

bootstrap();

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: Readonly<NextArtefactProps>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/images/favicon-32x32.png"
        />
      </head>
      <body>
        <SystemProviders>{children}</SystemProviders>
      </body>
    </html>
  );
}
