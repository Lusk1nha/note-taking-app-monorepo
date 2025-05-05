'use client';

import { FadeAnimate } from '@/components/utilities/animation';
import { Text } from '@note-taking-app/ui/text';
import { Title } from '@note-taking-app/ui/title';

interface AudienceHeaderContainerProps {
  title: string;
  description: string;
}

export function AudienceHeaderContainer(
  props: Readonly<AudienceHeaderContainerProps>,
) {
  const { title, description } = props;

  return (
    <FadeAnimate>
      <div className="flex flex-col gap-y-100">
        <Title size="xl">{title}</Title>
        <Text size="sm">{description}</Text>
      </div>
    </FadeAnimate>
  );
}
