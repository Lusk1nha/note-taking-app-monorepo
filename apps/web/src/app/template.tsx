import { NextArtefactProps } from '@/shared/common/next-types';

export default function RootTemplate(props: Readonly<NextArtefactProps>) {
  const { children } = props;

  return (
    <div id="root-template-container" className="bg-dashboard-base w-full h-screen">
      {children}
    </div>
  );
}
