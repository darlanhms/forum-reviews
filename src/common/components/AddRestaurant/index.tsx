/* eslint-disable guard-for-in */
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodBoolean } from 'zod';
import { WayToOrder, waysToOrder } from 'app/entities/Restaurant';
import useAlert from 'common/hooks/useAlert';
import { useTRPC } from 'common/hooks/useTRPC';
import FormCheckbox from '../Form/FormCheckbox';
import FormInput from '../Form/FormInput';

const waysToOrderSchema: Record<WayToOrder, ZodBoolean> = {} as Record<WayToOrder, ZodBoolean>;
const defaultWaysToOrder: Record<WayToOrder, boolean> = {} as Record<WayToOrder, boolean>;

waysToOrder.forEach(wayToOrder => {
  defaultWaysToOrder[wayToOrder] = false;
  waysToOrderSchema[wayToOrder] = z.boolean();
});

const restaurantSchema = z.object({
  name: z.string().min(1),
  waysToOrder: z.object({
    ...waysToOrderSchema,
  }),
});

interface RestaurantSubmitData {
  name: string;
  waysToOrder: Record<WayToOrder, boolean>;
}

const AddRestaurant: React.FC = () => {
  const [open, setOpen] = useBoolean(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      waysToOrder: defaultWaysToOrder,
    },
    resolver: zodResolver(restaurantSchema),
  });
  const { useMutation, useContext } = useTRPC();
  const alert = useAlert();
  const utils = useContext();

  const waysToOrderChunks = Array(Math.ceil(waysToOrder.length / 2))
    .fill(undefined)
    .map((_, index) => index * 2)
    .map(begin => waysToOrder.slice(begin, begin + 2));

  const createRestaurantMutation = useMutation(['restaurant.create'], {
    onSuccess() {
      setOpen.off();
      alert.success('Estabelecimento criado!');
      utils.invalidateQueries(['restaurant.getAll']);
    },
    onError(error) {
      alert.error('Erro ao criar estabelecimento', error.message);
    },
  });

  const onSubmit = (data: RestaurantSubmitData) => {
    const selectedWaysToOrder: Array<WayToOrder> = [];

    Object.keys(data.waysToOrder).forEach(wayToOrder => {
      const castedWayToOrder = wayToOrder as WayToOrder;

      if (data.waysToOrder[castedWayToOrder]) {
        selectedWaysToOrder.push(castedWayToOrder);
      }
    });

    createRestaurantMutation.mutate({
      name: data.name,
      wayToOrder: selectedWaysToOrder,
    });
  };

  return (
    <Box w="100%" display="flex" justifyContent="flex-end" py={4}>
      <Button onClick={setOpen.on} colorScheme="green">
        + Adicionar
      </Button>

      {open && (
        <Modal size="md" isCentered isOpen={open} onClose={setOpen.off}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Adicionar estabelecimento</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                <VStack spacing={5} align="flex-start">
                  <FormInput placeholder="Nome do estabelecimento" name="name" control={control} />

                  <Box w="100%">
                    <Text fontSize="md" fontWeight={500} mb={2}>
                      Como pedir?
                    </Text>
                    {waysToOrderChunks.map((waysToOrderChunk, index) => (
                      <HStack spacing="20px" key={`variation_array_${index}`}>
                        {waysToOrderChunk.map(wayToOrder => (
                          <FormCheckbox name={`waysToOrder.${wayToOrder}`} key={wayToOrder} control={control}>
                            {wayToOrder}
                          </FormCheckbox>
                        ))}
                      </HStack>
                    ))}
                  </Box>
                </VStack>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={setOpen.off}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit(onSubmit)} colorScheme="green">
                Adicionar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default AddRestaurant;
