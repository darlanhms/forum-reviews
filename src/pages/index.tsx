import type { NextPage } from 'next';
import { Container } from '@chakra-ui/react';
import AddRestaurant from 'common/components/AddRestaurant';
import Navbar from 'common/components/Navbar';
import RestaurantsList from 'common/components/RestaurantsList';
import useAuth from 'common/hooks/useAuth';

const Home: NextPage = () => {
  const { member } = useAuth();

  return (
    <>
      <Navbar />
      <Container maxW="container.lg">
        {member && <AddRestaurant />}
        <RestaurantsList />
      </Container>
    </>
  );
};

export default Home;
