import React from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Container display={"flex"} justifyContent={"center"} mt={5}>
      <Box mr={5}>
        <Link to="/about-us">About Us</Link>
      </Box>
      <Link to="/contact">Contact</Link>
    </Container>
  );
}

export default Footer;
