import { Text, TextProps } from '@chakra-ui/react';
import { MINIMUM_AVERAGE } from 'app/core/consts';

interface AverageTextProps extends Omit<TextProps, 'children'> {
  average: number;
}

const AverageText: React.FC<AverageTextProps> = ({ average, ...rest }) => {
  const isNegativeValue = average < MINIMUM_AVERAGE;

  return (
    <Text {...rest} color={isNegativeValue ? 'red' : 'green'}>
      {average}
    </Text>
  );
};

export default AverageText;
