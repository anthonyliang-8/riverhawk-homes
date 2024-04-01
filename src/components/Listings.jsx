import React, { useState, useEffect } from 'react';
import '../css/styles.css'
import Dorm from './Dorm';
import { db, storage } from '../Firebase'
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage'
import { 
  Box, 
  Text,
  Flex, 
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Check } from "@phosphor-icons/react";

function Listings() {
  const [dorms, setDorms] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState([]);
  const [filteredDorms, setFilteredDorms] = useState([]);
  useEffect(() => {
    setFilteredDorms(dorms);
  }, [dorms]);

  const [maxPrice, setMaxPrice] = useState(12000);

  useEffect(() => {
    const fetchData = async () => {
      const dormsCollectionRef = collection(db, 'dorms'); 
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
      console.error('Error getting image URL:', error);
      return ''; // return an empty string if error caught
    }
  };

  const updateFilter = (campuses, maxPrice) => {
    let filteredDorms = dorms;

    if (campuses.length > 0) {
      filteredDorms = filteredDorms.filter(dorm => campuses.includes(dorm.campus));
    }

    filteredDorms = filteredDorms.filter(dorm => (parseInt(dorm.price) <= parseInt(maxPrice)));
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
    updateFilter(selectedCampus, maxPrice);
}, [selectedCampus, maxPrice]);

const updateMaxPrice = (maxPrice) => {
  setMaxPrice(maxPrice);
}

  return (
    <div>
      <Flex>
          <Box display={'flex'}
          flexDir={'column'}
          border={'1px solid grey'}
          position={'absolute'}
          left={'0'}
          mt={'3em'}
          ml={'3em'}
          maxW={'md'}
          p={'1em'}
          rounded={'md'}>
              <Text borderBottom="1px solid lightgrey" fontSize="1.3em" fontWeight="600">Filters</Text>
              <Text fontWeight="600">Location</Text>
              <Checkbox onChange={() => updateCheckboxes("North")}>North Campus</Checkbox>
              <Checkbox onChange={() => updateCheckboxes("South")}>South Campus</Checkbox>
              <Text mt='1em' fontWeight="600">Price</Text>
              <NumberInput defaultValue={0} min={0} max={12000} onChange={(value) => updateMaxPrice(parseInt(value))}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
          </Box>
          </Flex>

      <div className="dorms-container">  
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
      </div>
    </div>
  );
}

export default Listings;
