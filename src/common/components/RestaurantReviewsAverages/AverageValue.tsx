import { Text, VStack } from '@chakra-ui/react';
import AverageText from '../AverageText';

interface AverageValueProps {
  label: string;
  value: number;
}

const AverageValue: React.FC<AverageValueProps> = ({ label, value }) => {
  return (
    <VStack>
      <Text fontWeight={600}>{label}</Text>
      <AverageText average={value} fontSize="2xl" />
    </VStack>
  );
};

export default AverageValue;
