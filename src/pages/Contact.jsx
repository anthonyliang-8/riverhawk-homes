import React from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Textarea,
  Button,
  useToast,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const Contact = () => {
  const toast = useToast();
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Your form has been submitted and will be reviewed.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Flex align="center" justify="center" mt={'3em'} mb={'3em'}>
      <Box bg="#0077b6" color={'white'} p={8} borderRadius={8} boxShadow="md">
        <Heading mb={6}>Contact Us</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel htmlFor="firstName">First Name:</FormLabel>
            <Input bgColor={'white'} color={'black'} id="firstName" name="firstName" required />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="lastName">Last Name:</FormLabel>
            <Input bgColor={'white'} color={'black'} id="lastName" name="lastName" required />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="email">Email:</FormLabel>
            <Input bgColor={'white'} color={'black'} id="email" name="email" type="email" required />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="message">Message:</FormLabel>
            <Textarea bgColor={'white'} color={'black'} id="message" name="message" rows={4} required />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Submit
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Contact;
