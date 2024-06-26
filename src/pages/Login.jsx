import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Box,
  Link,
  Text,
  Flex
} from "@chakra-ui/react";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName);
      } else {
        setDisplayName("");
      }
    });
    return unsubscribe;
  }, [displayName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Success!",
        description: "Redirecting to home page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      setError(error.message);
      toast({
        title: "Login Failed.",
        description: "Incorrect email or password entered.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // function to handle password reset
  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address to reset your password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Email sent!",
        description: "A link to reset your password if your email address exists.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setError(error.message);
      toast({
        title: "Failed to Reset Password.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Box boxSize={'sm'} margin={'auto auto'} mt={'2em'} mb={'2em'}>
      <Box mb={"2em"}>
        <Text fontWeight={"bold"} fontSize={"40px"} textAlign={"center"}>
          Login
        </Text>
        <Text fontWeight={"300"} textAlign={"center"}>
          Log back into your account.
        </Text>
      </Box>
      {/* shows display name if logged in */}
      {displayName ? (
        <Box marginRight={"1em"}>
          <Link to="/profile">{displayName}</Link>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
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
          <Box display={'flex'} alignItems={'center'} mt={5} justifyContent={'space-between'}>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              Log In
            </Button>
            <Button variant="link" onClick={handleResetPassword} colorScheme="blue">
              Forgot Password?
            </Button>
          </Box>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </form>
      )}
    </Box>
  );
}

export default Login;
