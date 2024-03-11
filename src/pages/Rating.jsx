import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {
  Box,
  Image,
  Text,
  Container,
  Divider,
  Button,
  RadioGroup,
  Radio,
  Stack,
  Textarea,
} from "@chakra-ui/react";

function Rating() {
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
      // convert storage path to a reference
      const storageRef = getStorage();
      const imageRef = ref(storageRef, imagePath);

      // create download URL for the image
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
    <div>
      <Container>
        <RadioGroup>
          <Stack direction="row">
            <Radio value="1">Single</Radio>
            <Radio value="2">Double</Radio>
            <Radio value="3">Triple</Radio>
            <Radio value="4">Quad</Radio>
          </Stack>
        </RadioGroup>
        <Box
          marginTop={"2em"}
          border={"1px solid lightgrey"}
          borderRadius={"8px"}
          padding={"1em"}
        >
          <Text>Title</Text>
          <Textarea
            size={"sm"}
            h={""}
            placeholder="Disappointing..."
            resize={"none"}
          ></Textarea>
        </Box>
        <Box
          marginTop={"1em"}
          border={"1px solid lightgrey"}
          borderRadius={"8px"}
          padding={"1em"}
        >
          <Text>Write a Review</Text>
          <Textarea
            size={"sm"}
            h={"10em"}
            placeholder="This is the worst room I have ever lived in. There were so many..."
            resize={"none"}
          ></Textarea>
        </Box>
        <Container>
          <Box></Box>
          <Box></Box>
        </Container>
      </Container>
    </div>
  );
}

export default Rating;
