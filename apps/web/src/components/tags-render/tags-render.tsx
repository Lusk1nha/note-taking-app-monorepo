import { Title } from '@note-taking-app/ui/title';
import { TagsRoutes } from './tags-routes';

export function TagsRender() {
  return (
    <div className="flex flex-col gap-y-100">
      <div className="px-100">
        <Title variant="secondary" size="default">
          Tags
        </Title>
      </div>

      <TagsRoutes paths={['Cooking', 'Dev']} />
    </div>
  );
}
