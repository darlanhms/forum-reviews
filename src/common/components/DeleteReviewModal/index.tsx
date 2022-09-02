import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import useAlert from 'common/hooks/useAlert';
import { useTRPC } from 'common/hooks/useTRPC';

interface DeleteReviewModalProps {
  reviewId: string;
  restaurantId: string;
  restaurantName: string;
  open: boolean;
  onClose: () => void;
}

const DeleteReviewModal: React.FC<DeleteReviewModalProps> = ({
  reviewId,
  restaurantId,
  restaurantName,
  open,
  onClose,
}) => {
  const { useMutation, useContext } = useTRPC();
  const alert = useAlert();
  const utils = useContext();

  const deleteReviewMutation = useMutation(['review.delete'], {
    onError(error) {
      alert.error(error.message);
    },
    onSuccess() {
      utils.invalidateQueries(['review.getByRestaurant', restaurantId]);
      utils.invalidateQueries(['restaurant.getOne', restaurantId]);
      utils.invalidateQueries(['restaurant.getAll']);
      alert.success('Review removida com sucesso');
      onClose();
    },
  });

  const onSubmit = () => {
    deleteReviewMutation.mutate({
      id: reviewId,
      restaurantId,
    });
  };

  return (
    <Modal isCentered isOpen={open} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmar remoção</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="flex-start" spacing={1}>
            <Text>
              Tem certeza que deseja remover o review no restaurante <b>{restaurantName}</b>?
            </Text>
            <Text color="red" fontWeight={600}>
              Essa ação não pode ser desfeita
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="green" onClick={onSubmit} isLoading={deleteReviewMutation.isLoading}>
            Remover
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteReviewModal;
