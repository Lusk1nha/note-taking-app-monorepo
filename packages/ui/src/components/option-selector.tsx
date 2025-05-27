import { cn } from '@note-taking-app/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { useCallback, useState } from 'react';
import { Text } from './text';
import { Title } from './title';

const optionSelectorVariants = cva('flex flex-col', {
  variants: {
    size: {
      default: 'w-full gap-y-200',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type OptionType<T extends string> = {
  id: T;
  name: string;
  description: string;
  icon?: React.ReactNode;
};

export interface OptionSelectorProps<T extends string>
  extends VariantProps<typeof optionSelectorVariants> {
  options: OptionType<T>[];
  selectedId?: T;

  onSelect?: (id: T) => void;
  renderOption?: (option: OptionType<T>, isSelected: boolean) => React.ReactNode;
}

export function OptionSelector<T extends string>(props: Readonly<OptionSelectorProps<T>>) {
  const { options, selectedId: controlledSelectedId, onSelect, renderOption, size } = props;

  const [internalSelectedId, setInternalSelectedId] = useState<T>(
    (controlledSelectedId ?? options[0]?.id) as T
  );
  const isControlled = controlledSelectedId !== undefined;
  const selectedId = isControlled ? controlledSelectedId : internalSelectedId;

  const handleSelect = useCallback(
    (id: T) => {
      if (!isControlled) setInternalSelectedId(id);
      onSelect?.(id);
    },
    [isControlled, onSelect, setInternalSelectedId]
  );

  return (
    <ul className={cn(optionSelectorVariants({ size }))}>
      {options.map((option) => (
        <li className="w-full flex" key={option.id}>
          <button
            type="button"
            onClick={() => handleSelect(option.id)}
            className={cn(
              'w-full inline-flex cursor-pointer items-center justify-between border rounded-12 p-4',
              selectedId === option.id
                ? 'bg-option-selector-default-base-active border-option-selector-default-border-active'
                : 'bg-option-selector-default-base border-option-selector-default-border'
            )}
          >
            {renderOption ? (
              renderOption(option, selectedId === option.id)
            ) : (
              <OptionSelectorItem option={option} isSelected={selectedId === option.id} />
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

interface OptionSelectorItemProps<T extends string> {
  option: OptionType<T>;
  isSelected: boolean;
}

function OptionSelectorItem<T extends string>(props: Readonly<OptionSelectorItemProps<T>>) {
  const { option, isSelected } = props;

  return (
    <React.Fragment>
      <div className="flex items-center gap-x-200">
        {option.icon && (
          <div
            className={cn(
              'bg-option-selector-default-icon-base text-option-selector-default-text border rounded-12 flex h-10 w-10 items-center justify-center p-2',
              isSelected
                ? 'border-option-selector-default-border-active'
                : 'border-option-selector-default-border'
            )}
          >
            {option.icon}
          </div>
        )}

        <div className="flex flex-col items-start gap-y-075">
          <Text className="text-option-selector-default-text">{option.name}</Text>
          <Text className="text-option-selector-default-description" size="xs">
            {option.description}
          </Text>
        </div>
      </div>

      <div
        className={cn(
          'min-h-4 min-w-4 flex items-center justify-center rounded-full',
          isSelected
            ? 'bg-option-selector-default-check-base-active'
            : 'bg-option-selector-default-check-base'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-full',
            isSelected
              ? 'min-w-2 min-h-2 bg-option-selector-default-check-dot-active'
              : 'min-w-3 min-h-3 bg-option-selector-default-check-dot'
          )}
        />
      </div>
    </React.Fragment>
  );
}
