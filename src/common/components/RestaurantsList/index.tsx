import Router from 'next/router';
import { FaSearch } from 'react-icons/fa';
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { useArrayQuery } from 'common/hooks/useArrayQuery';
import useAuth from 'common/hooks/useAuth';
import { useTRPC } from 'common/hooks/useTRPC';
import AddRestaurantModal from '../AddRestaurantModal';
import AverageText from '../AverageText';

const RestaurantsList: React.FC = () => {
  const { useQuery } = useTRPC();
  const { member } = useAuth();

  const [open, setOpen] = useBoolean(false);

  const { data: restaurants, isLoading } = useQuery(['restaurant.getAll']);

  const [filteredRestaurants, handleSearch] = useArrayQuery(restaurants || [], 'name');

  return (
    <Box>
      <Grid templateColumns="125px auto 180px" my={5}>
        {member ? (
          <Button onClick={setOpen.on} colorScheme="green">
            + Adicionar
          </Button>
        ) : (
          <div />
        )}
        <div />
        <InputGroup>
          <Input onChange={e => handleSearch(e.target.value)} placeholder="Pesquisar..." />
          <InputRightElement color="gray.500">
            <FaSearch />
          </InputRightElement>
        </InputGroup>
      </Grid>
      {isLoading ? (
        <VStack>
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={`skeleton_restaurant_${index}`} h="80px" w="100%" borderRadius="lg" />
          ))}
        </VStack>
      ) : (
        <VStack>
          {filteredRestaurants?.map(restaurant => (
            <Grid
              key={restaurant.id}
              w="100%"
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderStyle="solid"
              templateColumns={{ base: '130px auto 90px', lg: '200px auto 90px' }}
              _hover={{
                cursor: 'pointer',
                borderColor: 'gray.400',
                transition: '0.4s',
              }}
              onClick={() => Router.push(`/restaurants/${restaurant.id}`)}
            >
              <Center px={4}>
                <Text noOfLines={2} align="center" fontWeight="medium" fontSize="xl">
                  {restaurant.name}
                </Text>
              </Center>
              <Flex align="center">
                <VStack spacing={1} align="flex-start">
                  <Text fontWeight="semibold" ml={1}>
                    Reviews: {restaurant.reviewsAmount}
                  </Text>
                  <Flex flexFlow="wrap">
                    {restaurant.wayToOrder.map(wayToOrder => (
                      <Badge
                        as={Box}
                        borderRadius="md"
                        m={1}
                        px={2}
                        py={0.5}
                        key={`restaurant.id_${wayToOrder}`}
                      >
                        {wayToOrder}
                      </Badge>
                    ))}
                  </Flex>
                </VStack>
              </Flex>
              <Center>
                <AverageText average={restaurant.averageRating} fontSize="2xl" />
              </Center>
            </Grid>
          ))}
        </VStack>
      )}

      {open && <AddRestaurantModal open={open} onClose={setOpen.off} />}
    </Box>
  );
};

export default RestaurantsList;
