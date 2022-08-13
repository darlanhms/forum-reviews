import { Control, Controller } from 'react-hook-form';
import { Input, InputProps } from '@chakra-ui/react';

interface FormInputProps extends InputProps {
  name: string;
  control: Control<any, any>;
}

const FormInput: React.FC<FormInputProps> = ({ name, control, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input isInvalid={!!error} errorBorderColor="red.300" {...field} {...rest} />
      )}
    />
  );
};

export default FormInput;
