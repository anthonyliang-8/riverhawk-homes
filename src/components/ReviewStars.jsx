import React from "react";
import { Box } from "@chakra-ui/react";
import { Star } from "@phosphor-icons/react";

{
  /* Displays stars for the review components */
}
const ReviewStars = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      /* ternary operator to switch between weight types and color types*/
      weight={index < rating ? "fill" : "regular"}
      color={index < rating ? "#fbbf24" : "#e2e8f0"}
      size={18}
    />
  ));

  return <Box display={"flex"}>{stars}</Box>;
};

export default ReviewStars;
