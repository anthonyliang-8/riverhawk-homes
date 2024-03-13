import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";

const Navbar = () => {
  const [displayName, setDisplayName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(
          user.displayName ? user.displayName.split(" ")[0] : "UserTest"
        );
        setIsLoggedIn(true);
      } else {
        setDisplayName("");
        setIsLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Box boxShadow="md" borderRadius={"12px"}>
      <Flex p="4" alignItems="center">
        <Box>
          <Link to="/">Riverhawk Homes</Link>
        </Box>
        <Spacer />
        {!isLoggedIn && (
          <Box marginRight={"1em"}>
            <Link to="/login">Login</Link>
          </Box>
        )}
        {!isLoggedIn && (
          <Box>
            <Link to="/signup">Sign Up</Link>
          </Box>
        )}
        {isLoggedIn && displayName && (
          <Box marginRight={"1em"}>
            <Link to="/profile">{displayName}</Link>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
