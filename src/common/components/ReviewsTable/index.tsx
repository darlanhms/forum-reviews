import { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import Review from 'app/entities/Review';
import roundOneCase from 'app/utils/roundOneCase';

interface ReviewsTableProps {
  reviews: Array<Review>;
}

const calculateAverage = (review: Review) => {
  return roundOneCase(
    (review.serviceRating +
      review.priceRating +
      review.packageRating +
      review.productRating +
      review.waitTimeRating) /
      5,
  );
};

const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews }) => {
  const [observation, setObservation] = useState<string>();

  return (
    <Box w="100%" borderWidth="1px" borderRadius="lg" p={3}>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Membro</Th>
              <Th textAlign="center">Atendimento</Th>
              <Th textAlign="center">Preço</Th>
              <Th textAlign="center">Produto</Th>
              <Th textAlign="center">T. Espera</Th>
              <Th textAlign="center">Embalagem</Th>
              <Th textAlign="center">Média</Th>
              <Th textAlign="center">Obs.</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reviews.map(review => (
              <Tr key={`review_${review.id}`}>
                <Td>{review.member}</Td>
                <Td textAlign="center">{review.serviceRating}</Td>
                <Td textAlign="center">{review.priceRating}</Td>
                <Td textAlign="center">{review.productRating}</Td>
                <Td textAlign="center">{review.waitTimeRating}</Td>
                <Td textAlign="center">{review.packageRating}</Td>
                <Td textAlign="center">{calculateAverage(review)}</Td>
                <Td textAlign="center">
                  {review.additionalInfo ? (
                    <Button colorScheme="blue" size="sm" onClick={() => setObservation(review.additionalInfo)}>
                      Ver
                    </Button>
                  ) : (
                    <></>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal
        isCentered
        isOpen={!!observation}
        onClose={() => setObservation(undefined)}
        scrollBehavior="inside"
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Observação da review</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text fontSize="lg">{observation}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReviewsTable;
