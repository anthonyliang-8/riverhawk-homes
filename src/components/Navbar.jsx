import React from "react";
import { Link } from "react-router-dom";
import {
    Box,
    Flex,
    Spacer,
    Button,
    useColorMode,
} from "@chakra-ui/react";

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode(); {/*https://chakra-ui.com/docs/styled-system/color-mode#usecolormode*/ }

    return (
        <Box boxShadow="md" borderRadius={"12px"}>
            <Flex p="4" alignItems="center">
                <Box>
                    <Link to="/">Riverhawk Homes</Link>
                </Box>
                <Spacer />
                <Box>
                    <Link to="/login">Login</Link>
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? "Dark" : "Light"} {/* replace with icons */}
                    </Button>
                </Box>
            </Flex>
        </Box>
    );
};

export default Navbar;