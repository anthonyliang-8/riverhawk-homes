import ReviewStars from "./ReviewStars";
import { Box, Heading, Text, Stack, Divider, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Dorm = ({ id, name, campus, price_range, rating, photo }) => {
  const rndDormRating = (rating) => {
    var decimal = parseFloat(rating) % 1; // grab the decimal portion of the #
    if (decimal >= 0.5) {
      return parseInt(rating) + 1;
    }

    return parseInt(rating);
  }

  return (
    <Link to={`/dorm/${id}`}>
    <Box
      display="flex"
      width={"xs"}
      mt={'1em'}
      height={"11em"}
      p={2}
      rounded="md"
      bg="white"
      border={"1px solid lightgrey"}
    >
      <Image rounded="md" w={'150px'} h={'auto'} src={photo} />
      <Stack marginLeft={"1em"} spacing={4}>
        <Heading fontSize="sm">{name}</Heading>
        <Divider />
        <Stack direction="column">
          <Text>{campus} Campus</Text>
          <Stack direction="row">
            <ReviewStars rating={rndDormRating(rating)} />
            <Text>{rating}</Text>
          </Stack>
          <Text>${price_range}</Text>
        </Stack>
      </Stack>
    </Box>
    </Link>
  );
};

export default Dorm;
