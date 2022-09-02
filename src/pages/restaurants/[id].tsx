import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FaPencilAlt, FaPlus, FaTrashAlt } from 'react-icons/fa';
import {
  Center,
  Container,
  Flex,
  Grid,
  Heading,
  IconButton,
  Skeleton,
  Spinner,
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import AverageText from 'common/components/AverageText';
import DeleteReviewModal from 'common/components/DeleteReviewModal';
import Navbar from 'common/components/Navbar';
import RestaurantReviewsAverages from 'common/components/RestaurantReviewsAverages';
import ReviewModal from 'common/components/ReviewModal';
import ReviewsTable from 'common/components/ReviewsTable';
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
        <Grid templateColumns="80% 20%" py={4}>
          <Flex align="center">
            <Heading fontSize="3xl" fontWeight="normal">
              {restaurant.name}
            </Heading>
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

        <VStack spacing={4}>
          <Grid
            w="100%"
            templateColumns={{ base: '1fr', md: '3fr 6fr' }}
            templateRows={{ base: "'1fr' '1fr'", md: '1fr' }}
            my={4}
            gridGap={4}
          >
            <Center>
              <VStack>
                <Text>Média geral</Text>
                <AverageText average={restaurant.averageRating} fontSize="5xl" />
              </VStack>
            </Center>
            <RestaurantReviewsAverages reviews={reviews || []} />
          </Grid>

          <ReviewsTable reviews={reviews || []} />
        </VStack>

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
