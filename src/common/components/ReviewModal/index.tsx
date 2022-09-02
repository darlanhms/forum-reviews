/* eslint-disable guard-for-in */
import { useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import Review from 'app/entities/Review';
import useAlert from 'common/hooks/useAlert';
import useAuth from 'common/hooks/useAuth';
import { useTRPC } from 'common/hooks/useTRPC';
import RatingPicker from '../RatingPicker';

interface ReviewModalProps {
  restaurantId: string;
  open: boolean;
  onClose: () => void;
  reviewToUpdate?: Review;
}

interface Ratings {
  service?: number;
  price?: number;
  package?: number;
  product?: number;
  waitTime?: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, restaurantId, reviewToUpdate }) => {
  const [ratings, setRatings] = useState<Ratings>({});
  const { member } = useAuth();
  const { useMutation, useContext } = useTRPC();
  const alert = useAlert();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const utils = useContext();

  const isEditing = !!reviewToUpdate;

  const handleClose = () => {
    setRatings({});
    if (textAreaRef.current) {
      textAreaRef.current.value = '';
    }

    onClose();
  };

  useEffect(() => {
    if (reviewToUpdate) {
      setTimeout(() => {
        setRatings({
          package: reviewToUpdate.packageRating,
          price: reviewToUpdate.priceRating,
          product: reviewToUpdate.productRating,
          service: reviewToUpdate.serviceRating,
          waitTime: reviewToUpdate.waitTimeRating,
        });

        if (textAreaRef.current) {
          textAreaRef.current.value = reviewToUpdate.additionalInfo || '';
        }
      }, 200);
    }
  }, [reviewToUpdate]);

  const invalidateQueries = () => {
    utils.invalidateQueries(['review.getByRestaurant', restaurantId]);
    utils.invalidateQueries(['restaurant.getOne', restaurantId]);
    utils.invalidateQueries(['restaurant.getAll']);
  };

  const createReviewMutation = useMutation('review.create', {
    onError(error) {
      alert.error(error.message);
    },
    onSuccess() {
      invalidateQueries();
      alert.success('Review enviada com sucesso!');
      handleClose();
    },
  });

  const updateReviewMutation = useMutation('review.update', {
    onError(error) {
      alert.error(error.message);
    },
    onSuccess() {
      invalidateQueries();
      alert.success('Review atualizada com sucesso!');
      handleClose();
    },
  });

  const onSubmit = () => {
    if (!ratings.service) {
      alert.error('Informe uma nota para o atendimento');
      return;
    }

    if (!ratings.product) {
      alert.error('Informe uma nota para o produto');
      return;
    }

    if (!ratings.price) {
      alert.error('Informe uma nota para o preço');
      return;
    }

    if (!ratings.waitTime) {
      alert.error('Informe uma nota para o tempo de espera');
      return;
    }

    if (!ratings.package) {
      alert.error('Informe uma nota para a embalagem');
      return;
    }

    if (!member?.name) {
      alert.error('Você só pode criar uma review logado');
      return;
    }

    if (isEditing) {
      updateReviewMutation.mutate({
        id: reviewToUpdate.id,
        restaurantId,
        serviceRating: ratings.service,
        priceRating: ratings.price,
        packageRating: ratings.package,
        productRating: ratings.product,
        waitTimeRating: ratings.waitTime,
        additionalInfo: textAreaRef.current?.value,
      });
    } else {
      createReviewMutation.mutate({
        restaurantId,
        member: member.name,
        serviceRating: ratings.service,
        priceRating: ratings.price,
        packageRating: ratings.package,
        productRating: ratings.product,
        waitTimeRating: ratings.waitTime,
        additionalInfo: textAreaRef.current?.value,
      });
    }
  };

  return (
    <Modal isCentered isOpen={open} onClose={handleClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="fit-content">
        {isEditing ? <ModalHeader>Editar review</ModalHeader> : <ModalHeader>Criar review</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={3.5}>
            <Box w="100%">
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="600">
                  Atendimento
                </Text>
                <RatingPicker
                  name="service"
                  selected={ratings.service}
                  onChange={rating => setRatings({ ...ratings, service: rating })}
                />
              </VStack>
            </Box>

            <Box w="100%">
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="600">
                  Produto
                </Text>
                <RatingPicker
                  name="product"
                  selected={ratings.product}
                  onChange={rating => setRatings({ ...ratings, product: rating })}
                />
              </VStack>
            </Box>

            <Box w="100%">
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="600">
                  Preço
                </Text>
                <RatingPicker
                  name="price"
                  selected={ratings.price}
                  onChange={rating => setRatings({ ...ratings, price: rating })}
                />
              </VStack>
            </Box>

            <Box w="100%">
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="600">
                  Tempo de espera
                </Text>
                <RatingPicker
                  name="waitTime"
                  selected={ratings.waitTime}
                  onChange={rating => setRatings({ ...ratings, waitTime: rating })}
                />
              </VStack>
            </Box>

            <Box w="100%">
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="600">
                  Embalagem
                </Text>
                <RatingPicker
                  name="package"
                  selected={ratings.package}
                  onChange={rating => setRatings({ ...ratings, package: rating })}
                />
              </VStack>
            </Box>
            <Box w="100%">
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="600">
                  Observações
                </Text>
                <Textarea
                  ref={textAreaRef}
                  w="100%"
                  placeholder="Mais informações sobre sua experiência..."
                  size="sm"
                />
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            isLoading={createReviewMutation.isLoading || updateReviewMutation.isLoading}
            colorScheme="green"
            onClick={onSubmit}
          >
            Enviar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
