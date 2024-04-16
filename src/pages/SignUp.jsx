import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const auth = getAuth(); // Get the auth instance
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile immediately after creating the user
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      console.log(
        "Profile updated successfully:",
        userCredential.user.displayName
      );
      navigate("/");
      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      mt={"2em"}
      mb={"2em"}
    >
      {/* styling container for header and bottom text */}
      <Box mb={"2em"}>
        <Text fontWeight={"bold"} fontSize={"40px"} textAlign={"center"}>
          Sign Up
        </Text>
        <Text fontWeight={"300"} textAlign={"center"}>
          Sign up to start rating dorms and reviews.
        </Text>
      </Box>
      <Box boxSize={"sm"} mb={"5em"}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <Button mt={4} colorScheme="blue" type="submit" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default SignUp;
