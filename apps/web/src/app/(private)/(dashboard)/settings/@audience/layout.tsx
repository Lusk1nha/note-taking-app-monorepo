import { NextArtefactProps } from '@/shared/common/next-types';

export default function AudienceLayout(props: Readonly<NextArtefactProps>) {
  const { children } = props;

  return (
    <section className="lg:w-[528px] flex flex-col gap-y-200 pt-6 px-4 lg:p-8">
      {children}
    </section>
  );
}
