import React from "react";
import {
    Box,
    Flex,
    Spacer,
    Link,
    Button,
    useColorMode
} from "@chakra-ui/react";

const Navbar = () => {
    {/*https://chakra-ui.com/docs/styled-system/color-mode#usecolormode*/}
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box boxShadow="md" borderRadius={"12px"}>
            <Flex p="4" alignItems="center">
                <Box>
                    <Link href="/" fontSize="xl" fontWeight="bold">
                        RateMyHousing
                    </Link>
                </Box>
                <Spacer />
                <Box>
                    <Link href="/login" mr="4">
                        Login
                    </Link>
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? "Dark" : "Light"} {/* replace with icons */}
                    </Button>
                </Box>
            </Flex>
        </Box>
    );
};

export default Navbar;