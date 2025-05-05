'use client';

import {
  ItemFadeInAnimate,
  ListFadeInAnimate,
} from '@/components/utilities/animation';
import { useState } from 'react';

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

  const handleSelect = (id: T) => {
    if (!isControlled) setInternalSelectedId(id);
    onSelect?.(id);
  };

  const defaultRenderOption = (option: OptionType<T>, isSelected: boolean) => (
    <>
      <div className="flex items-center space-x-3">
        {option.icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-12 bg-gray-100 dark:bg-gray-700">
            {option.icon}
          </div>
        )}

        <div className="flex flex-col gap-y-075">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {option.name}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {option.description}
          </p>
        </div>
      </div>

      <div
        className={`h-5 w-5 rounded-full border ${
          isSelected
            ? 'border-blue-500 bg-blue-500'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        {isSelected && (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );

  return (
    <ListFadeInAnimate className="w-full flex flex-col gap-y-200">
      {options.map((option) => (
        <ItemFadeInAnimate
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
            selectedId === option.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          {renderOption
            ? renderOption(option, selectedId === option.id)
            : defaultRenderOption(option, selectedId === option.id)}
        </ItemFadeInAnimate>
      ))}
    </ListFadeInAnimate>
  );
}
