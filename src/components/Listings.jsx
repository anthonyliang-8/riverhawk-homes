import React, { useState, useEffect } from "react";
import { Box, Text, Flex, Checkbox, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import Dorm from "./Dorm";
import { db, storage } from "../Firebase";

function Listings() {
  const [dorms, setDorms] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState([]);
  const [filteredDorms, setFilteredDorms] = useState([]);
  const [currentPriceRange, setCurrentPriceRange] = useState([8710, 12000]);
  const [selectedRatings, setSelectedRatings] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const dormsCollectionRef = collection(db, "dorms");
      const docs = await getDocs(dormsCollectionRef);
      const data = docs.docs.map(async (doc) => {
        const dormData = doc.data();
        const imageURL = await getImageURL(dormData.img_path);
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

  // added this function to deal with RHV's price range, since RHV's price is stored as a string var in the Firebase db
  const parsePrice = (price) => {
    if (typeof price === 'string' && price.includes('-')) {
      const [min, max] = price.split('-').map(Number);
      return { min, max };
    } else {
      const value = Number(price);
      return { min: value, max: value };
    }
  };

  const updateFilter = () => {
    let filtered = dorms.filter(dorm => {
      const { min: dormMinPrice, max: dormMaxPrice } = parsePrice(dorm.price);
      const [filterMinPrice, filterMaxPrice] = currentPriceRange;

      const matchesCampus = selectedCampus.length === 0 || selectedCampus.includes(dorm.campus);
      const matchesPrice = dormMaxPrice >= filterMinPrice && dormMinPrice <= filterMaxPrice;
      const matchesRating = selectedRatings.size === 0 || [...selectedRatings].some(rating =>
        dorm.rating >= rating && dorm.rating < rating + 1);

      return matchesCampus && matchesPrice && matchesRating;
    });
    setFilteredDorms(filtered);
  };

  useEffect(() => {
    updateFilter();
  }, [dorms, selectedCampus, currentPriceRange, selectedRatings]);

  const handleRatingChange = (rating) => {
    const newRatings = new Set(selectedRatings);
    if (newRatings.has(rating)) {
      newRatings.delete(rating);
    } else {
      newRatings.add(rating);
    }
    setSelectedRatings(newRatings);
    updateFilter();
  };

  const updateCheckboxes = (campus) => {
    const updatedCampus = [...selectedCampus];
    const index = updatedCampus.indexOf(campus);
    if (index === -1) {
      updatedCampus.push(campus);
    } else {
      updatedCampus.splice(index, 1);
    }
    setSelectedCampus(updatedCampus);
  };

  return (
    <Flex ml={'5em'} mr={'5em'} mb={'3em'}>
      <Box
        display={"flex"}
        flexDir={"column"}
        border={"1px solid lightgrey"}
        mt={"3em"}
        mr={"3em"}
        minW={"16em"}
        minH={"10em"}
        maxH={"25em"}
        borderRadius={'6px'}
      >
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
        <Box p={'.5em'} display={'flex'} flexDir={'column'}>
          <Text fontWeight="600">Location</Text>
          <Checkbox onChange={() => updateCheckboxes("North")}>North Campus</Checkbox>
          <Checkbox onChange={() => updateCheckboxes("South")}>South Campus</Checkbox>
          <Text mt="1em" fontWeight="600">Price</Text>
          <RangeSlider
            defaultValue={[8710, 12000]}
            min={8710}
            max={12000}
            step={100}
            onChange={(val) => setCurrentPriceRange(val)}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <Text>${currentPriceRange[0]} - ${currentPriceRange[1]}</Text>
          <Text mt="1em" fontWeight="600">Rating</Text>
          {[1, 2, 3, 4, 5].map(rating => (
            <Checkbox
              key={rating}
              isChecked={selectedRatings.has(rating)}
              onChange={() => handleRatingChange(rating)}
            >
              {rating} Star
            </Checkbox>
          ))}
        </Box>
      </Box>

      <Box
        display={"flex"}
        flexDir={"row"}
        flexWrap={"wrap"}
        mt={'2em'}
        ml={'6em'}
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
