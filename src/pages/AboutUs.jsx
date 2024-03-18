import React from "react";
import anthony from "../img/anthony.jpg";
import dylan from "../img/dylan.jpg";
import kevin from "../img/kevin.jpg";
import kristina from "../img/kristina.jpg"
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Divider,
  Container,
} from "@chakra-ui/react";

const AboutUs = () => {
  return (
    <div>
      <Box bg="gray.100" py={8} mt={8}>
        <Heading as="h1" textAlign="center" mb={4}>
          About Us
        </Heading>
        <Text textAlign="center" maxW="600px" mx="auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </Box>
      <Flex justifyContent={"center"} mt={8}>
        <Box
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          mx={5}
          mb={8}
        >
          <Image
            src={anthony}
            alt="Anthony Liang"
            w={"150px"}
            borderRadius="full"
            mb={4}
          />
          <Heading as="h2" size="md" mb={2}>
            Anthony Liang
          </Heading>
          <Divider mb={2} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </Box>
        <Box
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          mx={5}
          mb={8}
        >
          <Image
            src={dylan}
            alt="Dylan Silk"
            w={"150px"}
            h={"200px"}
            borderRadius="full"
            mb={4}
          />
          <Heading as="h2" size="md" mb={2}>
            Dylan Silk
          </Heading>
          <Divider mb={2} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </Box>
        <Box
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          mx={5}
          mb={8}
        >
          <Image
            src={kristina}
            alt="Kristina Russell"
            w={"150px"}
            h={"200px"}
            borderRadius="full"
            mb={4}
          />
          <Heading as="h2" size="md" mb={2}>
            Kristina Russell
          </Heading>
          <Divider mb={2} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </Box>
        <Box
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          mx={5}
          mb={8}
        >
          <Image
            src={kevin}
            alt="Kevin Sree"
            w={"150px"}
            borderRadius="full"
            mb={4}
          />
          <Heading as="h2" size="md" mb={2}>
            Kevin Sree
          </Heading>
          <Divider mb={2} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </Box>
      </Flex>
    </div>
  );
};

export default AboutUs;
