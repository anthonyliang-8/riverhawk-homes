import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      // Create user account using Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      // signup success
      // redirect user to home page here
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-div">
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
        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Render error message */} 
        <Button
          mt={4}
          colorScheme="teal"
          type="submit"
          isLoading={isLoading}
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}

export default SignUp;
