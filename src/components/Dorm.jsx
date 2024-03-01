import { Box, Heading, Text, Stack, Divider, Image } from "@chakra-ui/react";

const Dorm = ({ name, campus, price_range, rating, photo }) => {
  return (
    <Box
      display="flex"
      width={'xs'}
      p={4}
      rounded="md"
      bg="white"
      border={"1px solid grey"}
    >
      <Image src={photo} />
      <Stack marginLeft={'2em'} spacing={4}>
        <Heading fontSize="sm">{name}</Heading>
        <Divider />
        <Stack direction="column">
          <Text>{campus}</Text>

          <Text>Avg. Rating: {rating}</Text>
          <Text>${price_range}</Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Dorm;
