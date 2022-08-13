import { Control, Controller } from 'react-hook-form';
import { Select, SelectProps } from '@chakra-ui/react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormSelectProps extends SelectProps {
  name: string;
  control: Control<any, any>;
  options: Array<SelectOption>;
}

const FormSelect: React.FC<FormSelectProps> = ({ name, options, control, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select isInvalid={!!error} errorBorderColor="red.300" {...field} {...rest}>
          {options.length &&
            options.map(option => (
              <option key={`select_option_${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
        </Select>
      )}
    />
  );
};

export default FormSelect;
