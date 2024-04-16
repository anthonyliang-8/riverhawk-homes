import React from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Box display={"flex"} alignItems={'center'} justifyContent={"center"} bg={'#0077b6'} pt={'1.5em'} pb={'1.5em'}>
      <Box mr={5}>
        <Link to="/about-us"><Text color={'white'} fontWeight={'600'}>About Us</Text></Link>
      </Box>
      <Link to="/contact"><Text color={'white'} fontWeight={'600'}>Contact</Text></Link>
    </Box>
  );
}

export default Footer;
