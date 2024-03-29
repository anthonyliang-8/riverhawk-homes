import { Box, Heading, Text, Stack, Divider, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Dorm = ({ id, name, campus, price_range, rating, photo }) => {
  return (
    <Link to={`/dorm/${id}`}>
    <Box
      display="flex"
      width={"xs"}
      p={2}
      rounded="md"
      bg="white"
      border={"1px solid lightgrey"}
    >
      <Image rounded="md" w={'150px'} h={'auto'} src={photo} />
      <Stack marginLeft={"2em"} spacing={4}>
        <Heading fontSize="sm">{name}</Heading>
        <Divider />
        <Stack direction="column">
          <Text>{campus} Campus</Text>
          <Text>Avg. Rating: {rating}</Text>
          <Text>${price_range}</Text>
        </Stack>
      </Stack>
    </Box>
    </Link>
  );
};

export default Dorm;
