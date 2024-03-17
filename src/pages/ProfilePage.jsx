import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase';
import { 
  Text,
  Box,
  Button,
  useToast,
  Input,
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

  // sign the user out and redirects them to the home page
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
  const handleNameChange = async () => {
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
  // QUALITY OF LIFE: Make window reload before toast pop up
  // handles the displaying of the welcome message, info, changes, and logout button
  // also contains the forms that are hidden/shown when a change button is pressed
  return (
    <Box maxW="md" mx="auto" mt={8} border={'1px solid lightgrey'} h={'md'} padding={5}>
      <Text mx="auto"><b>Welcome to your profile!</b></Text>

      <Box maxW="md" mx="auto" mt={8} border={'1px solid lightgrey'} padding={5}>
        <Text borderBottom="1px solid lightgrey" pb={2} mb={2}>
          <b>Display Name:</b> {displayName}
        </Text>
        <Text borderBottom="1px solid lightgrey" pb={2} mb={2}>
          <b>Email:</b> {email}
        </Text>

        {!hideNameForm ? (
          <Box>
            <Input value={firstName} placeholder="First Name" 
              onChange={(e) => setFirstName(e.target.value)}/>
            <Input value={lastName} placeholder="Last Name" 
              onChange={(e) => setLastName(e.target.value)} />
            <Button ml={4} mt={4} type="button" colorScheme="green" 
              onClick={handleNameChange} isLoading={isLoading}>
              Submit
            </Button>
            <Button mx={4} mt={4} type="button" colorScheme="red" 
              onClick={() => setHideNameForm(true)} isLoading={isLoading}>
              Cancel
            </Button>
          </Box>
          ) : ( 
          <Button ml={4} mt={4} type="button" colorScheme="teal" 
            onClick={() => setHideNameForm(false)}>
            Change Name
          </Button>
          )
        }
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