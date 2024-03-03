import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Spacer, Button, useColorMode } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box boxShadow="md" borderRadius={"12px"}>
      <Flex p="4" alignItems="center">
        <Box>
          <Link to="/">Riverhawk Homes</Link>
        </Box>
        <Spacer />
        <Box >
          <Link to="/login">Login</Link>
        </Box>
        <Box>
          <Link to="/signup">Sign Up</Link>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
