import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FaPencilAlt, FaPlus, FaTrashAlt } from 'react-icons/fa';
import {
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Skeleton,
  Spinner,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import DeleteReviewModal from 'common/components/DeleteReviewModal';
import Navbar from 'common/components/Navbar';
import ReviewModal from 'common/components/ReviewModal';
import useAuth from 'common/hooks/useAuth';
import { useTRPC } from 'common/hooks/useTRPC';

const RestaurantPage: NextPage = () => {
  const { id } = useRouter().query;
  const { useQuery } = useTRPC();
  const { member } = useAuth();
  const [modalOpen, setModalOpen] = useBoolean(false);
  const [deleteModalOpen, setDeleteModalOpen] = useBoolean(false);

  const { data: restaurant } = useQuery(['restaurant.getOne', id as string]);

  const { data: reviews, isLoading } = useQuery(['review.getByRestaurant', id as string]);

  if (!restaurant) {
    return (
      <Center h="400px">
        <Spinner size="lg" />
      </Center>
    );
  }

  const reviewAlreadyAdded = reviews?.find(review => review.member === member?.name);

  return (
    <>
      <Navbar />
      <Container maxW="container.lg">
        <Grid templateColumns="80% 20%" p={4}>
          <Flex align="center">
            <Heading fontSize="xl">{restaurant.name}</Heading>
          </Flex>
          {member && (
            <Flex gap="5px" justify="flex-end">
              {!reviewAlreadyAdded && (
                <IconButton
                  onClick={setModalOpen.on}
                  size="sm"
                  colorScheme="green"
                  backgroundColor="green.400"
                  aria-label="Adicionar review"
                >
                  <FaPlus size={15} />
                </IconButton>
              )}
              {reviewAlreadyAdded && (
                <>
                  <IconButton onClick={setModalOpen.on} size="sm" colorScheme="blue" aria-label="Editar review">
                    <FaPencilAlt size={15} />
                  </IconButton>
                  <IconButton
                    onClick={setDeleteModalOpen.on}
                    size="sm"
                    colorScheme="red"
                    aria-label="Excluir review"
                  >
                    <FaTrashAlt size={15} />
                  </IconButton>
                </>
              )}
            </Flex>
          )}
        </Grid>
        <Divider borderColor="gray.300" />
        {isLoading ? (
          <VStack>
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={`skeleton_review_${idx}`} h="50px" w="100%" />
            ))}
          </VStack>
        ) : (
          <></>
        )}
        {modalOpen && (
          <ReviewModal
            restaurantId={restaurant.id}
            open={modalOpen}
            onClose={setModalOpen.off}
            reviewToUpdate={reviewAlreadyAdded}
          />
        )}
        {Boolean(deleteModalOpen && reviewAlreadyAdded) && (
          <DeleteReviewModal
            open={deleteModalOpen}
            onClose={setDeleteModalOpen.off}
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            reviewId={reviewAlreadyAdded?.id as string}
          />
        )}
      </Container>
    </>
  );
};

export default RestaurantPage;
