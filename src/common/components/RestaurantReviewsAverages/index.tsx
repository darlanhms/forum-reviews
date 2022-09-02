import { useMemo } from 'react';
import { Center, HStack, VStack } from '@chakra-ui/react';
import Review from 'app/entities/Review';
import roundOneCase from 'app/utils/roundOneCase';
import AverageValue from './AverageValue';

interface RestaurantReviewsAveragesProps {
  reviews: Array<Review>;
}

const RestaurantReviewsAverages: React.FC<RestaurantReviewsAveragesProps> = ({ reviews }) => {
  const [serviceAverage, priceAverage, packageAverage, productAverage, waitTimeAverage] = useMemo(() => {
    const reviewsQuantity = reviews.length;

    const localServiceAverage =
      reviews.reduce((previous: number, review: Review) => previous + review.serviceRating, 0) /
      reviewsQuantity;

    const localPriceAverage =
      reviews.reduce((previous: number, review: Review) => previous + review.priceRating, 0) / reviewsQuantity;

    const localPackageAverage =
      reviews.reduce((previous: number, review: Review) => previous + review.packageRating, 0) /
      reviewsQuantity;

    const localProductAverage =
      reviews.reduce((previous: number, review: Review) => previous + review.productRating, 0) /
      reviewsQuantity;

    const localWaitTimeAverage =
      reviews.reduce((previous: number, review: Review) => previous + review.waitTimeRating, 0) /
      reviewsQuantity;

    return [
      roundOneCase(localServiceAverage || 0),
      roundOneCase(localPriceAverage || 0),
      roundOneCase(localPackageAverage || 0),
      roundOneCase(localProductAverage || 0),
      roundOneCase(localWaitTimeAverage || 0),
    ];
  }, [reviews]);

  return (
    <Center>
      <VStack gap="20px" borderWidth="1px" borderRadius="lg" p={5}>
        <HStack gap="40px">
          <AverageValue label="Atendimento" value={serviceAverage} />
          <AverageValue label="Preço" value={priceAverage} />
          <AverageValue label="Produto" value={productAverage} />
        </HStack>
        <HStack gap="40px">
          <AverageValue label="Embalagem" value={packageAverage} />
          <AverageValue label="Tempo de espera" value={waitTimeAverage} />
        </HStack>
      </VStack>
    </Center>
  );
};

export default RestaurantReviewsAverages;
