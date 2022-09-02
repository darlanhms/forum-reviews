import { useEffect } from 'react';
import Router from 'next/router';
import { Text, Grid, GridItem, Container, Box, useBoolean, Spinner } from '@chakra-ui/react';
import LoginModal from 'common/components/LoginModal';
import useAuth from 'common/hooks/useAuth';

const Navbar: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useBoolean(false);
  const { member, isFetching } = useAuth();

  useEffect(() => {
    if (member) {
      setLoginModalOpen.off();
    }
  }, [member]);

  return (
    <Box w="100%" h="50px" bg="teal.500" display="flex" alignItems="center">
      <Container maxW="container.lg">
        <Grid templateColumns="190px 1fr auto" alignItems="center">
          <GridItem onClick={() => Router.push('/')} cursor="pointer">
            <Text size="2xl" fontWeight={600} color="white">
              Forum reviews
            </Text>
          </GridItem>
          <GridItem></GridItem>
          {isFetching ? (
            <Spinner color="white" />
          ) : member ? (
            <Text color="white">Salve, {member.name}</Text>
          ) : (
            <GridItem>
              <Text
                onClick={setLoginModalOpen.on}
                cursor="pointer"
                color="white"
                _hover={{ color: 'teal.50', transition: '0.2s' }}
              >
                Login
              </Text>
            </GridItem>
          )}
        </Grid>
      </Container>

      <LoginModal open={loginModalOpen} onClose={setLoginModalOpen.off} />
    </Box>
  );
};

export default Navbar;
