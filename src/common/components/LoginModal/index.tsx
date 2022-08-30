import { useForm } from 'react-hook-form';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import members from 'app/consts/members';
import { LoginRequest } from 'app/controllers/login.controller';
import FormInput from 'common/components/Form/FormInput';
import FormSelect from 'common/components/Form/FormSelect';
import useAuth from 'common/hooks/useAuth';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const loginSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
});

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { login, isMutating } = useAuth();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    login(data);
  };

  return (
    <Modal isCentered isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <VStack spacing="15px">
              <FormSelect
                placeholder="Nome"
                name="name"
                control={control}
                options={members.map(member => ({
                  label: member.name,
                  value: member.name,
                }))}
              />
              <FormInput placeholder="Senha do grupo" name="password" type="password" control={control} />
            </VStack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button isLoading={isMutating} onClick={handleSubmit(onSubmit)} colorScheme="green">
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
