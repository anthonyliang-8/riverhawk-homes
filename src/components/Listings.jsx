import React, { useState, useEffect } from "react";
import "../css/styles.css";
import Dorm from "./Dorm";
import { db, storage } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import {
  Box,
  Text,
  Flex,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";

function Listings() {
  const [dorms, setDorms] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState([]);
  const [filteredDorms, setFilteredDorms] = useState([]);
  const [currentPriceRange, setCurrentPriceRange] = useState([8710, 12000]);
  const [selectedRatingRange, setSelectedRatingRange] = useState([0, 5]);

  useEffect(() => {
    setFilteredDorms(dorms);
  }, [dorms]);

  const [maxPrice, setMaxPrice] = useState(12000);

  useEffect(() => {
    const fetchData = async () => {
      const dormsCollectionRef = collection(db, "dorms");
      const docs = await getDocs(dormsCollectionRef);
      const data = docs.docs.map(async (doc) => {
        const dormData = doc.data();
        const imageURL = await getImageURL(dormData.img_path); //img_path holds path to image in Firebase storage
        return { ...dormData, id: doc.id, img_url: imageURL };
      });
      Promise.all(data).then(setDorms);
    };

    fetchData();
  }, []);

  const getImageURL = async (imagePath) => {
    const imageRef = ref(storage, imagePath);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return ""; // return an empty string if error caught
    }
  };

  const updateFilter = (campuses, minPrice, maxPrice, ratingRange) => {
    let filteredDorms = dorms;

    if (campuses.length > 0) {
      filteredDorms = filteredDorms.filter((dorm) =>
        campuses.includes(dorm.campus)
      );
    }

    filteredDorms = filteredDorms.filter(
      (dorm) =>
        parseInt(dorm.price) >= parseInt(minPrice) &&
        parseInt(dorm.price) <= parseInt(maxPrice) &&
        (ratingRange === undefined ||
          (dorm.rating >= ratingRange[0] && dorm.rating <= ratingRange[1]))
    );
    setFilteredDorms(filteredDorms);
  };

  const updateCheckboxes = (campus) => {
    console.log(campus);
    const updatedCampus = [...selectedCampus];
    const index = updatedCampus.indexOf(campus);

    if (index === -1) {
      updatedCampus.push(campus);
    } else {
      updatedCampus.splice(index, 1);
    }

    setSelectedCampus(updatedCampus);
  };

  useEffect(() => {
    updateFilter(selectedCampus, 8710, maxPrice, selectedRatingRange);
  }, [selectedCampus, maxPrice, selectedRatingRange]);

  const updateMaxPrice = (range) => {
    const [minPrice, maxPrice] = range;
    setCurrentPriceRange(range);
    updateFilter(selectedCampus, minPrice, maxPrice);
  };

  return (
    <Flex ml={'5em'} mr={'5em'} mb={'3em'}>
      {/* flexbox for filter component */}

      <Box
        display={"flex"}
        flexDir={"column"}
        border={"1px solid lightgrey"}
        mt={"3em"}
        mr={"3em"}
        minW={"16em"}
        minH={"10em"}
        maxH={"20em"}
        borderRadius={'6px'}
      >
        {/* header for top of container */}
        <Text
          fontSize="1.3em"
          fontWeight="600"
          bgColor={'#0077b6'}
          color={'white'}
          borderTopRadius={'6px'}
          p={'.5em'}
        >
          Filters
        </Text>
        <Box
          p={'.5em'} display={'flex'}
          flexDir={'column'}> {/* container for bottom of filter */}
          <Text fontWeight="600">Location</Text>
          <Checkbox onChange={() => updateCheckboxes("North")}>
            North Campus
          </Checkbox>
          <Checkbox onChange={() => updateCheckboxes("South")}>
            South Campus
          </Checkbox>
          {/* probably need to implement filtering by rating/stars here */}
          <Text mt="1em" fontWeight="600">
            Price
          </Text>
          {/* slider to handle filtering the dorms by price */}
          <RangeSlider
            defaultValue={[8710, 12000]}
            min={8710}
            max={12000}
            step={100}
            onChange={(val) => updateMaxPrice(val)}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <Text>
            ${currentPriceRange[0]} - ${currentPriceRange[1]}
          </Text>
          <Text mt="1em" fontWeight="600">Rating</Text>
          <RangeSlider
            defaultValue={[0, 5]}
            min={0}
            max={5}
            step={0.1}
            value={selectedRatingRange}
            onChange={(val) => setSelectedRatingRange(val)}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <Text>Rating: {selectedRatingRange[0]} - {selectedRatingRange[1]}</Text>
        </Box>
      </Box>

      <Box
        display={"flex"}
        flexDir={"row"}
        flexWrap={"wrap"}
        mt={"2em"} // set to 2em since the dorm component has mt=1em
        alignItems={"center"}
        justifyContent={"space-evenly"}
      >
        {filteredDorms.map((dorm) => (
          <Dorm
            key={dorm.id}
            id={dorm.id}
            name={dorm.name}
            campus={dorm.campus}
            price_range={dorm.price}
            rating={dorm.rating}
            photo={dorm.img_url}
          />
        ))}
      </Box>
    </Flex>
  );
}

export default Listings;
