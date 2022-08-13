import { useToast } from '@chakra-ui/react';

interface AlertFn {
  (title: string, description?: string, duration?: number): void;
}

export default function useAlert() {
  const toast = useToast();

  const success: AlertFn = (title, description, duration) => {
    toast({
      title,
      description,
      status: 'success',
      duration: duration || 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const error: AlertFn = (title, description, duration) => {
    toast({
      title,
      description,
      status: 'error',
      duration: duration || 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return {
    success,
    error,
  };
}
