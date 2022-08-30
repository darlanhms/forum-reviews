import { Control, Controller } from 'react-hook-form';
import { Checkbox, CheckboxProps } from '@chakra-ui/react';

interface FormCheckboxProps extends CheckboxProps {
  name: string;
  control: Control<any, any>;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({ name, control, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Checkbox isInvalid={!!error} errorBorderColor="red.300" {...field} {...rest} />
      )}
    />
  );
};

export default FormCheckbox;
