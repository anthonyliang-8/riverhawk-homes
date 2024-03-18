import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase';
import '../css/styles.css'
import { 
  Text,
  Box,
  Button,
  useToast,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const ProfilePage = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hideNameForm, setHideNameForm] = useState(true);
  const [hidePasswordForm, setHidePasswordForm] = useState(true);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName);
        setEmail(user.email);
      } else {
        setDisplayName("");
        setEmail("");
      }
    });

    return unsubscribe;
  }, []);

  // QUALITY OF LIFE TODO: Make window reload before toast pop up
  // sign the user out and redirect them to the home page
  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await signOut(auth);
      setDisplayName("");
      toast({
        title: "Logout Successful!",
        description: "Redirecting to login page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout Failed!",
        description: "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // concats the first and last name into a display name
  // and then alerts the user to a success or failure
  const handleNameChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`
      });
      setDisplayName(newDisplayName);
      setNewDisplayName("");
      setHideNameForm(true);
      window.location.reload();
      toast({
        title: "Name Change Successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error when updating the display name: ", error);
      toast({
        title: "Change Failed!",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // handles the displaying of the welcome message, info, changes, and logout button
  // also contains the forms that are hidden/shown when a change button is pressed
  return (
    <Box maxW="md" mx="auto" mt={8} border={'1px solid lightgrey'} padding={5}>
      <Text mx="auto"><b>Welcome to your profile!</b></Text>

      <Box maxW="md" ml="auto" mt={4} border={'1px solid lightgrey'} padding={5}>
        <Text pb={3}>
          <b>Display Name:</b> {displayName}
          {!hideNameForm ? (
            <form onSubmit={handleNameChange}>
              <FormControl isRequired>
                <FormLabel mt={2}>First Name</FormLabel>
                  <Input value={firstName} placeholder="John"
                    onChange={(e) => setFirstName(e.target.value)}/>
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={5}>Last Name</FormLabel>
                  <Input value={lastName} placeholder="Doe" 
                    onChange={(e) => setLastName(e.target.value)} />
              </FormControl>

              <Button ml="auto" mt={4} type="submit" colorScheme="green" isLoading={isLoading}>
                Submit
              </Button>

              <Button ml={5} mt={4} type="cancel" colorScheme="red" 
                onClick={() => setHideNameForm(true)} isLoading={isLoading}>
                Cancel
              </Button>
            </form>
            ) : ( 
            <Button ml={4} size="xs" type="button" colorScheme="teal" 
              onClick={() => setHideNameForm(false)}>
              Change Name
            </Button>
            )
          }
        </Text>
        <Text borderTop="1px solid lightgrey" mt={4} pt={5} mb={2}>
          <b>Email:</b> {email}
        </Text>
      </Box>

      <Button mx="auto" mt={4} type="button" 
        colorScheme="teal" onClick={handleLogout} isLoading={isLoading}>
        Logout
      </Button>
    </Box>
  );
};

/*
To be implemented in the future

<Button ml={4} type="button" colorScheme="teal" 
  onClick={handlePasswordChange} isLoading={isLoading}>
  Change Password
</Button>
*/

export default ProfilePage;