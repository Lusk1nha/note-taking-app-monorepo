'use client';

import {
  ItemFadeInAnimate,
  ListFadeInAnimate,
} from '@/components/utilities/animation';
import { cn } from '@note-taking-app/utils/cn';
import { useCallback, useState } from 'react';

type OptionType<T extends string> = {
  id: T;
  name: string;
  description: string;
  icon?: React.ReactNode;
};

type OptionSelectorProps<T extends string> = {
  options: Array<OptionType<T>>;
  selectedId?: T;
  onSelect?: (id: T) => void;
  renderOption?: (
    option: OptionType<T>,
    isSelected: boolean,
  ) => React.ReactNode;
};

export function OptionSelector<T extends string>(
  props: Readonly<OptionSelectorProps<T>>,
) {
  const {
    options,
    selectedId: controlledSelectedId,
    onSelect,
    renderOption,
  } = props;

  const [internalSelectedId, setInternalSelectedId] = useState<T>(
    controlledSelectedId ?? options[0]?.id,
  );
  const isControlled = controlledSelectedId !== undefined;
  const selectedId = isControlled ? controlledSelectedId : internalSelectedId;

  const handleSelect = useCallback(
    (id: T) => {
      if (!isControlled) setInternalSelectedId(id);
      onSelect?.(id);
    },
    [isControlled, onSelect, setInternalSelectedId],
  );

  return (
    <ListFadeInAnimate className="w-full flex flex-col">
      {options.map((option) => (
        <ItemFadeInAnimate
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className={cn(
            'flex cursor-pointer items-center justify-between',
            selectedId === option.id ? '' : '',
          )}
        >
          {renderOption ? (
            renderOption(option, selectedId === option.id)
          ) : (
            <OptionSelectorItem
              option={option}
              isSelected={selectedId === option.id}
            />
          )}
        </ItemFadeInAnimate>
      ))}
    </ListFadeInAnimate>
  );
}

interface OptionSelectorItemProps<T extends string> {
  option: OptionType<T>;
  isSelected: boolean;
}

function OptionSelectorItem<T extends string>(
  props: Readonly<OptionSelectorItemProps<T>>,
) {
  const { option, isSelected } = props;

  return (
    <>
      <div className="flex items-center">
        {option.icon && (
          <div className="flex h-10 w-10 items-center justify-center">
            {option.icon}
          </div>
        )}

        <div className="flex flex-col gap-y-075">
          <h3 className="">{option.name}</h3>

          <p className="">{option.description}</p>
        </div>
      </div>

      <div className={cn('h-5 w-5', isSelected ? '' : '')}>
        {isSelected && (
          <div className="flex h-full w-full items-center justify-center"></div>
        )}
      </div>
    </>
  );
}
