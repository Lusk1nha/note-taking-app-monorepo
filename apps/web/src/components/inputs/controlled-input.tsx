import { Input, InputProps } from '@note-taking-app/ui/input';
import { Label } from '@note-taking-app/ui/label';
import { TipMessage, TipMessageProps } from '@note-taking-app/ui/tip-message';

import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface ControlledInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;

  required?: boolean;
  label?: string;
  field?: InputProps;
  tip?: TipMessageProps;
}

export function ControlledInput<T extends FieldValues>(
  props: Readonly<ControlledInputProps<T>>,
) {
  const { name, control, label, tip, required, field, ...rest } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value, name },
        fieldState: { error },
      }) => (
        <fieldset className="flex flex-col gap-y-075">
          {label && <Label required={required}>{label}</Label>}

          <Input
            {...field}
            {...rest}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            error={!!error}
          />
          {tip && <TipMessage {...tip} />}
          {error && <TipMessage variant="error" children={error.message} />}
        </fieldset>
      )}
    />
  );
}
