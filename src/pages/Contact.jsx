import React from 'react';
import { Box, Flex, Heading, Input, Textarea, Button } from '@chakra-ui/react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Your form submission logic here
    alert('Thank you for submitting the form!');
  };

  return (
    <Flex align="center" justify="center" h="100vh">
      <Box bg="gray.100" p={8} borderRadius={8} boxShadow="md">
        <Heading mb={6}>Contact Us</Heading>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" mb={4}>
            <label htmlFor="firstName">First Name:</label>
            <Input id="firstName" name="firstName" required />
          </Flex>
          <Flex direction="column" mb={4}>
            <label htmlFor="lastName">Last Name:</label>
            <Input id="lastName" name="lastName" required />
          </Flex>
          <Flex direction="column" mb={4}>
            <label htmlFor="email">Email:</label>
            <Input id="email" name="email" type="email" required />
          </Flex>
          <Flex direction="column" mb={4}>
            <label htmlFor="message">Message:</label>
            <Textarea id="message" name="message" rows={4} required />
          </Flex>
          <Button type="submit" colorScheme="blue">
            Submit
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Contact;