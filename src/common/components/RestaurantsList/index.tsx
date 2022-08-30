import { Box, Text, VStack } from '@chakra-ui/react';
import { useTRPC } from 'common/hooks/useTRPC';

const RestaurantsList: React.FC = () => {
  const { useQuery } = useTRPC();

  const { data: restaurants } = useQuery(['restaurant.getAll']);

  return (
    <Box>
      <VStack>
        {restaurants?.map(restaurant => (
          <Text key={restaurant.id}>{restaurant.name}</Text>
        ))}
      </VStack>
    </Box>
  );
};

export default RestaurantsList;
