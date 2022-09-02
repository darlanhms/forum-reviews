import { Button, Flex } from '@chakra-ui/react';

interface RatingPickerProps {
  name: string;
  selected?: number;
  onChange(value?: number): void;
}

const RatingPicker: React.FC<RatingPickerProps> = ({ name, selected, onChange }) => {
  const handleRatingClick = (rating: number) => {
    if (selected === rating) {
      onChange(undefined);
    } else {
      onChange(rating);
    }
  };

  return (
    <Flex flexFlow="wrap">
      {Array.from({ length: 11 }).map((_, index) => (
        <Button
          onClick={() => handleRatingClick(index)}
          m={0.5}
          w="40px"
          key={`${name}_rating_${index}`}
          colorScheme={selected === index ? 'pink' : 'blue'}
        >
          {index}
        </Button>
      ))}
    </Flex>
  );
};

export default RatingPicker;
