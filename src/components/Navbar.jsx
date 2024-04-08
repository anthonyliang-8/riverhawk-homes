import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Spacer, Image, Text } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import RiverhawkLogo from "../img/uml_riverhawk_logo.svg";

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
    <Box>
      <Flex pt={"1.5em"} pb={"1.5em"} alignItems="center" bgColor={"#0077b6"}>
        {/* this is the logo, probably need to replace this code with an svg of the logo and the text inside instead*/}
        <Box display={"flex"} alignItems={"center"} ml={"5em"}>
          <Image src={RiverhawkLogo} width={"5%"} height={"auto"}></Image>
          <Link to="/">
            <Text color={"white"} fontWeight={"bold"}>
              Riverhawk Homes
            </Text>
          </Link>
        </Box>
        <Spacer />
        <Box display={"flex"} alignItems={"center"} mr={"5em"}>
          {!isLoggedIn && (
            <Box marginRight={"1em"}>
              <Link to="/login">
                <Text color={"white"} fontWeight={"600"}>
                  Login
                </Text>
              </Link>
            </Box>
          )}
          {!isLoggedIn && (
            <Box
              border={"2px solid white"}
              borderRadius={"8px"}
              p={1}
              fontWeight={"600"}
              bg={"white"}
              color="#0077b6"
              transition={"all 0.3s ease-out"}
              _hover={{
                bg: "#0077b6",
                color: "white",
                transition: "all 0.3s",
              }}
            >
              <Link to="/signup">
                <Text>Sign Up</Text>
              </Link>
            </Box>
          )}
        </Box>

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
