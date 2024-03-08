import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Box, Image, Text } from "@chakra-ui/react";


function Reviews() {
  const { id } = useParams();
  const [reviewListings, setReviewListings] = useState(null);

  useEffect(() => {
    const getReviewDetails = async () => {
      try {
        const dormDocRef = doc(db, "dorms", id);
        const dormSnapshot = await getDoc(dormDocRef);
        if (dormSnapshot.exists()) {
          const dormData = dormSnapshot.data();
          const imageURL = await getImageURL(dormData.img_path);
          setReviewListings({ ...dormData, img_url: imageURL });
        } else {
          console.log("No such dorm exists!");
        }
      } catch (error) {
        console.error("Error fetching dorm details:", error);
      }
    };

    getReviewDetails();
  }, [id]);

  const getImageURL = async (imagePath) => {
    try {
      // Convert storage path to a reference
      const storageRef = getStorage();
      const imageRef = ref(storageRef, imagePath);
      
      // Generate download URL for the image
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return ""; // Return an empty string if there's an error
    }
  };

  if (!reviewListings) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      maxW="lg"
      maxH={'lg'}
      border={"1px"}
      borderRadius={"8px"}
      borderColor={"lightgrey"}
      display={'flex'}
      flexDirection={'row'}
    >
      <Image
        rounded="md"
        w={"150px"}
        h={"auto"}
        src={reviewListings.img_url}
      />
      <Text fontSize={"18px"} as={"b"}>
        {reviewListings.name}
      </Text>
      <Text>Campus: {reviewListings.campus}</Text>
      <Text>Price Range: ${reviewListings.price}</Text>
      <Text>Average Rating: {reviewListings.rating}</Text>
    </Box>
  );
}

export default Reviews;
