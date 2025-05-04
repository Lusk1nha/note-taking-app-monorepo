import { NextArtefactProps } from '@/shared/common/next-types';

export default function DashboardLayout(props: Readonly<NextArtefactProps>) {
  const { children } = props;
  return <div className="w-full min-h-screen">{children}</div>;
}
