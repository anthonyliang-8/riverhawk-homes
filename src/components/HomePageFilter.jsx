import React from "react";
import { 
    Box, 
    Text,
    Flex, 
    Checkbox,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
  } from '@chakra-ui/react';
import { Check } from "@phosphor-icons/react";

function HomePageFilter() {
    return(
        <Flex>
        <Box display={'flex'}
        flexDir={'column'}
        border={'1px solid grey'}
        position={'absolute'}
        left={'0'}
        mt={'3em'}
        ml={'3em'}
        maxW={'md'}
        p={'1em'}>
            <Text borderBottom="1px solid lightgrey" fontSize="1.3em" fontWeight="600">Filters</Text>
            <Text fontWeight="600">Location</Text>
            <Checkbox>North Campus</Checkbox>
            <Checkbox>South Campus</Checkbox>
            <Text mt='1em' fontWeight="600">Price</Text>
            <RangeSlider aria-label={['min', 'max']} defaultValue={[8710, 12000]}>
                <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
            </RangeSlider>
        </Box>
        </Flex>
    )
}

export default HomePageFilter;