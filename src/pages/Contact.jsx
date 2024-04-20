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
        description:
          "There was an error submitting your form. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" mt={"3em"} mb={"3em"}>
      <Box bg="#0077b6" color={"white"} p={8} borderRadius={8} boxShadow="md">
        <Heading mb={6}>Contact Us</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel htmlFor="firstName">First Name:</FormLabel>
            <Input
              bgColor={"white"}
              color={"black"}
              id="firstName"
              name="firstName"
              required
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="lastName">Last Name:</FormLabel>
            <Input
              bgColor={"white"}
              color={"black"}
              id="lastName"
              name="lastName"
              required
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="email">Email:</FormLabel>
            <Input
              bgColor={"white"}
              color={"black"}
              id="email"
              name="email"
              type="email"
              required
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="message">Message:</FormLabel>
            <Textarea
              bgColor={"white"}
              color={"black"}
              id="message"
              name="message"
              rows={4}
              required
              onChange={handleChange}
            />
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
