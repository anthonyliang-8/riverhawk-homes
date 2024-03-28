import React, { useState } from 'react';
import { Star as StarIcon } from "@phosphor-icons/react";
import { Box } from '@chakra-ui/react';

const RatingStars = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const handleClick = (newValue) => {
    onChange(newValue);
  };

  return (
    <Box display={'flex'}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label
            key={ratingValue}
            onMouseOver={() => handleMouseOver(ratingValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(ratingValue)}
            style={{ cursor: 'pointer' }}
          >
            <StarIcon
              weight={ratingValue <= (hoverValue || value) ? 'fill' : 'regular'}
              color={ratingValue <= (hoverValue || value) ? '#fbbf24' : '#e2e8f0'}
              size={24}
            />
          </label>
        );
      })}
    </Box>
  );
};

export default RatingStars;