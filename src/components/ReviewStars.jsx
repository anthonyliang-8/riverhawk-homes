import React from 'react';
import { Box } from '@chakra-ui/react';
import { Star } from '@phosphor-icons/react';

const ReviewStars = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      weight={index < rating ? 'fill' : 'regular'}
      color={index < rating ? '#fbbf24' : '#e2e8f0'}
      size={24}
    />
  ));

  return <Box display={'flex'}>{stars}</Box>;
};

export default ReviewStars;