import type { NextPage } from 'next';
import { Container } from '@chakra-ui/react';
import Navbar from 'common/components/Navbar';
import RestaurantsList from 'common/components/RestaurantsList';

const Home: NextPage = () => {
  return (
    <>
      <Navbar />
      <Container maxW="container.lg">
        <RestaurantsList />
      </Container>
    </>
  );
};

export default Home;
