import { Text } from '@note-taking-app/ui/text';
import { Title } from '@note-taking-app/ui/title';

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader(props: Readonly<AuthHeaderProps>) {
  const { title, description } = props;

  return (
    <section className="flex flex-col items-center justify-center gap-y-100">
      <Title className="text-auth-title text-center" size="xl">
        {title}
      </Title>
      <Text className="text-auth-text text-center" size="sm">
        {description}
      </Text>
    </section>
  );
}
