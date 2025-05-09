import { NextArtefactProps } from '@/shared/common/next-types';

export default function AuthLayout(props: Readonly<NextArtefactProps>) {
  const { children } = props;

  return (
    <div className="bg-auth-base w-full h-screen flex items-center justify-center px-200">
      {children}
    </div>
  );
}
