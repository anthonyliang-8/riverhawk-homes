import React from "react";
import anthony from "../img/anthony.jpg";
import dylan from "../img/dylan.jpg";
import kevin from "../img/kevin.jpg";
import kristina from "../img/kristina.jpg";
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
      <Box bg="#0067B1" py={8} mt={8}>
        <Heading color={"white"} as="h1" textAlign="center" mb={4}>
          About Us
        </Heading>
        <Text color={'white'} fontWeight={500} textAlign="center" maxW="50%" mt={'2em'} mx="auto">
          Our goal is to create an online space where incoming, current, and
          past students are able to view and leave reviews about their living
          experiences for various dorms on campus.
        </Text>
      </Box>
      <Flex justifyContent={"center"} mt={10}>
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
            Senior studying Computer Science with interests in web development and computer graphics.
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
            I'm a senior with a computer science major, and I'm constantly bouncing between projects based off what I'm interested in.
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
            I'm a senior with a computer science major, and I'm interested in game dev, and various other things.
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
