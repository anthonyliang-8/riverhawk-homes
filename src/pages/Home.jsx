import HomePageFilter from "../components/HomePageFilter";
import Listings from "../components/Listings";

import { Flex } from "@chakra-ui/react";

function Home() {
  return (
    <Flex>
      <Listings />
    </Flex>
  );
}

export default Home;
