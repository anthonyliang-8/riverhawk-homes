import React from "react";
import { Box, Text } from "@chakra-ui/react";

function HomePageFilter() {
    return(
        <Box display={'flex'}
        flexDir={'column'}
        border={'1px solid grey'}
        h={'md'}>
            <Text>Filters</Text>
        </Box>
    )
}

export default HomePageFilter;