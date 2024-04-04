import React, { useState } from "react";
import { db } from "../Firebase";
import { addDoc, collection } from "firebase/firestore";
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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the form data to Firestore
      const docRef = await addDoc(collection(db, "contact_forms"), formData);
      console.log("Document written with ID: ", docRef.id);

      toast({
        title: "Success!",
        description: "Your form has been submitted and will be reviewed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Error",
        description: "There was an error submitting your form. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };



  return (
    <Flex align="center" justify="center" m={5}>
      <Box bg="gray.100" p={8} borderRadius={8} minW={'sm'} boxShadow="md">
        <Heading color={'#0077B6'} mb={6}>Contact Us</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel htmlFor="firstName">First Name:</FormLabel>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              borderWidth={'2px'}
              required
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="lastName">Last Name:</FormLabel>
            <Input id="lastName" name="lastName" value={formData.lastName}
              borderWidth={'2px'}
              onChange={handleChange} required />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="email">Email:</FormLabel>
            <Input id="email" name="email" type="email" value={formData.email}
              borderWidth={'2px'}
              onChange={handleChange} required />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="message">Message:</FormLabel>
            <Textarea id="message" name="message" maxH={'sm'} rows={4}
              value={formData.message}
              borderWidth={'2px'}
              onChange={handleChange} required />
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
