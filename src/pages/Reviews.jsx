import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReviewStars from "../components/ReviewStars";
import { db } from "../Firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Box, Image, Text, Container, Divider, Button } from "@chakra-ui/react";
import { Trash, ThumbsDown, ThumbsUp, Warning } from "@phosphor-icons/react";

function Reviews() {
  const { id } = useParams();
  const [reviewListings, setReviewListings] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUID, setCurrentUID] = useState(null);
  const [thumbsDownColor, setThumbsDownColor] = useState(false);
  const [thumbsUpColor, setThumbsUpColor] = useState(false);

  /* hook to get all user IDs, implemented this just so
  we can seperate it from the admin UID */
  useEffect(() => {
    const fetchUserUID = () => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUID(user.uid);
        } else {
          setCurrentUID(null);
        }
      });
    };

    fetchUserUID();
    const getReviewDetails = async () => {
      try {
        // fetch dorm details
        const dormDocRef = doc(db, "dorms", id);
        const dormSnapshot = await getDoc(dormDocRef);

        if (dormSnapshot.exists()) {
          const dormData = dormSnapshot.data();
          const imageURL = await getImageURL(dormData.img_path);
          setReviewListings({ ...dormData, img_url: imageURL });

          // fetch reviews for the current dorm
          const reviewsQuery = query(
            collection(db, "reviews"),
            where("dormId", "==", id)
          );
          const querySnapshot = await getDocs(reviewsQuery);
          const reviews = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReviews(reviews);
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
      return ""; // return an empty string if there's an error
    }
  };

  /* !! function to handle removing the review */
  const deleteReview = async (reviewId, reviewRating) => {
    try {
      // reference doc in review collection
      const reviewDocRef = doc(db, "reviews", reviewId);

      // remove review doc
      await deleteDoc(reviewDocRef);

      // update dorm avg rating
      const dormDocRef = doc(db, "dorms", id);
      const dormSnapshot = await getDoc(dormDocRef);
      if (dormSnapshot.exists()) {
        const dormData = dormSnapshot.data();
        var newAvg = ((dormData.rating * dormData.entries) - reviewRating) / (dormData.entries - 1);
        newAvg = parseFloat(newAvg.toFixed(2));

        await updateDoc(dormDocRef, {rating: newAvg, entries: (dormData.entries - 1)});
      } else {
        console.log("No such dorm exists!");
      }

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleThumbsDown = () => {
    setThumbsDownColor(!thumbsDownColor)
  };

  const handleThumbsUp = () => {
    setThumbsUpColor(!thumbsUpColor)
  };

  // !! TODO: Replace with spinner, this is just temporary to show routing
  if (!reviewListings) {
    return <div>Loading...</div>;
  }

  return (
    <Container minH="100vh">
      <Box
        maxW="lg"
        maxH={"lg"}
        border={"1px"}
        borderRadius={"8px"}
        borderColor={"lightgrey"}
        marginTop={"2em"}
        paddingTop={"1em"}
        paddingBottom={"1em"}
      >
        <Container display={"flex"} flexDir={"row"} alignItems={"center"}>
          <Image
            rounded="md"
            w={"150px"}
            h={"auto"}
            src={reviewListings.img_url}
          />
          <Container display={"flex"} flexDir={"column"}>
            <Text fontSize={"18px"} as={"b"}>
              {reviewListings.name}
            </Text>
            <Divider />
            <Text>{reviewListings.campus} Campus</Text>
            <Text>Price Range: ${reviewListings.price}</Text>
            <Text>Avg. Rating: {reviewListings.rating}</Text>
          </Container>

          <Button colorScheme="blue">
            <Link to={`/dorm/${id}/rate`}>Rate </Link>
          </Button>
        </Container>
      </Box>
      {reviews.map((review) => (
        <Box
          border={"1px solid lightgrey"}
          borderRadius={"8px"}
          padding={"5px"}
          key={review.id}
          my={4}
        >
          <Text fontSize="xl" fontWeight="bold">
            {review.title}
          </Text>
          <Divider />
          <Box>
            <ReviewStars rating={parseInt(review.rating)} />
          </Box>
          <Text>{review.description}</Text>
          {review.imageUrls.map((imageUrl) => (
            <Image
              w={"150px"}
              h={"auto"}
              key={imageUrl}
              src={imageUrl}
              alt="Review Image"
            />
          ))}
          <Box display={"flex"} alignItems={"center"} flexDir={"row-reverse"}>
            {/*admin UID here, the hook seperates this from the rest*/}
            {currentUID === "Wb85k2s2pXeiZcnAKZwmU10joRM2" && (
              <Trash
                cursor={"pointer"}
                size={28}
                color="#ff2600" 
                weight="fill"
                onClick={() => deleteReview(review.id, review.rating)}
              />
            )}
            <Warning size={28} color="#0432ff" weight="duotone" />
            {/*on click should change colors, default should be black */}
            <ThumbsDown size={28} color={thumbsDownColor ? "#ff2600" : "#000000"} weight="duotone" />
            <ThumbsUp size={28} color="#00f900" weight="duotone" />
          </Box>
        </Box>
      ))}
    </Container>
  );
}

export default Reviews;
