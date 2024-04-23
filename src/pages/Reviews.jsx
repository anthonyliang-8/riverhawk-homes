import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReviewStars from "../components/ReviewStars";
import useColorState from "../hooks/useColorState";
import { db } from "../Firebase";
import {
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Box,
  Image,
  Text,
  Container,
  Divider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  useToast,
  Stack,
  Spinner
} from "@chakra-ui/react";
import { Trash, ThumbsDown, ThumbsUp, Warning } from "@phosphor-icons/react";

function Reviews() {
  const { id } = useParams();
  const [reviewListings, setReviewListings] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUID, setCurrentUID] = useState(null);
  const [thumbsUpColors, setThumbsUpColors] = useColorState(
    "thumbsUpColors",
    {}
  );
  const [thumbsDownColors, setThumbsDownColors] = useColorState(
    "thumbsDownColors",
    {}
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const [selectedStars, setSelectedStars] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  useEffect(() => {
    setFilteredReviews(reviews);
  }, [reviews]);

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
            thumbsUpColor: false, // Initialize thumbsUpColor for each review
            thumbsDownColor: false, // Initialize thumbsDownColor for each review
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

  const filteredReviewsParse = (stars) => { // this line would've been used in a lot of places. function is to neaten code
    return reviews.filter((review) => stars.includes(parseInt(review.rating)));
  }

  const starsFilter = (stars) => { // old update filter function, used to handle specific stars
    if (stars.length === 0) {
      setFilteredReviews(reviews);
    } else {
      const filteredReviews = filteredReviewsParse(stars);
      setFilteredReviews(filteredReviews);
    }
  };

  const highToLow = (filteredReviews) => { // used to neaten code again
    return filteredReviews.sort((a, b) => b.rating - a.rating);
  };

  const lowToHigh = (filteredReviews) => {
    return filteredReviews.sort((a, b) => a.rating - b.rating);
  };

  const updateFilter = (stars) => {
    let filteredReviews = [...reviews]; // create a copy of the original reviews array
  
    if (stars.includes(6) && (stars.length - 1) !== 0) { // if we have high->low and other filters.
      filteredReviews = filteredReviewsParse(stars);
      filteredReviews = highToLow(filteredReviews);
    } else if (stars.includes(7) && (stars.length - 1) !== 0) { // if we have low->high and other filters
      filteredReviews = filteredReviewsParse(stars);
      filteredReviews = lowToHigh(filteredReviews);
    }

    if (stars.includes(6)) {
      filteredReviews = highToLow(filteredReviews);
    } else if (stars.includes(7)) {
      filteredReviews = lowToHigh(filteredReviews);
    } else {
      filteredReviews = filteredReviewsParse(stars);
    }
  
    if (stars.length === 0) {
      setFilteredReviews(reviews); // !! here was the fix, reset to original reviews if they aren't checked
    } else {
      setFilteredReviews(filteredReviews);
    }
  };

  const updateCheckbox = (boxNum) => { // function to keep track of which filters are checked/unchecked
    const selectedBoxes = [...selectedStars];
    const index = selectedBoxes.indexOf(boxNum);
    if (index === -1) {
      selectedBoxes.push(boxNum);
    } else { 
      selectedBoxes.splice(index, 1);
    }

    setSelectedStars(selectedBoxes);
  }

  useEffect(() => {
    updateFilter(selectedStars);
  }, [selectedStars]);

  const drawCheckboxes = () => {
    // function to draw the checkboxes with the needed functionality for filtering
    let checkboxes = [];
    for (let i = 1; i <= 5; i++) {
      checkboxes.push(
        <Checkbox key={i} onChange={() => updateCheckbox(i)} style={{width: '100%', display: 'block'}}>
          {i} Star
        </Checkbox>
      );
    }
    checkboxes.push(
      <Checkbox key={6} onChange={() => updateCheckbox(6)}>
        Highest to Lowest
      </Checkbox>
    );
    checkboxes.push(
      <Checkbox key={7} onChange={() => updateCheckbox(7)}>
        Lowest to Highest
      </Checkbox>
    );
    return checkboxes;
  };

  /* !! function to handle the counts of the thumbs ups and thumbs down */
  const handleReaction = async (reviewId, reaction) => {
    try {
      const reviewDocRef = doc(db, "reviews", reviewId);
      const reactionsRef = doc(db, "reviews", reviewId, "reactions", currentUID);
  
      const reviewDoc = await getDoc(reviewDocRef);
      const reactionDoc = await getDoc(reactionsRef);
  
      if (reviewDoc.exists()) {
        let { thumbsUp, thumbsDown } = reviewDoc.data();
  
        thumbsUp = thumbsUp || [];
        thumbsDown = thumbsDown || [];
  
        let newReaction = null;
        let updatedReactions = {
          thumbsUp,
          thumbsDown,
        };
  
        if (reactionDoc.exists() && reactionDoc.data().reaction === reaction) {
          // user is toggling off their reaction
          updatedReactions[reaction] = updatedReactions[reaction].filter(uid => uid !== currentUID);
        } else {
          // add new reaction or toggle to different reaction
          if (reaction === "thumbsUp") {
            updatedReactions.thumbsUp = [...new Set([...thumbsUp, currentUID])];
            updatedReactions.thumbsDown = thumbsDown.filter(uid => uid !== currentUID);
          } else if (reaction === "thumbsDown") {
            updatedReactions.thumbsDown = [...new Set([...thumbsDown, currentUID])];
            updatedReactions.thumbsUp = thumbsUp.filter(uid => uid !== currentUID);
          }
          newReaction = reaction;
        }
  
        await updateDoc(reviewDocRef, updatedReactions);
        await setDoc(reactionsRef, { reaction: newReaction }, { merge: true });
      } else {
        console.log("No such review exists!");
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
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

        if (dormData.entries - 1 === 0) {
          await updateDoc(dormDocRef, {
            rating: 0,
            entries: 0,
          });
        } else {
          var newAvg =
            (dormData.rating * dormData.entries - reviewRating) /
            (dormData.entries - 1);
          newAvg = parseFloat(newAvg.toFixed(2));

          await updateDoc(dormDocRef, {
            rating: newAvg,
            entries: dormData.entries - 1,
          });
        }
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

  {
    /* states for the thumbs up and thumbs down buttons 
will need to add logic in Firebase so that the amount of upvotes and downvotes
can be displayed*/
  }
  const handleThumbsUp = async (reviewId) => {
    await handleReaction(reviewId, "thumbsUp");
    setThumbsUpColors((prevColors) => ({
      ...prevColors,
      [reviewId]: !prevColors[reviewId],
    }));
    setThumbsDownColors((prevColors) => ({
      ...prevColors,
      [reviewId]: false,
    }));
    const updatedReviews = await fetchUpdatedReviews(id);
    setReviews(updatedReviews);
  };

  const handleThumbsDown = async (reviewId) => {
    await handleReaction(reviewId, "thumbsDown");
    setThumbsDownColors((prevColors) => ({
      ...prevColors,
      [reviewId]: !prevColors[reviewId],
    }));
    setThumbsUpColors((prevColors) => ({
      ...prevColors,
      [reviewId]: false,
    }));
    const updatedReviews = await fetchUpdatedReviews(id);
    setReviews(updatedReviews);
  };

  const fetchUpdatedReviews = async (dormId) => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("dormId", "==", dormId)
      );
      const querySnapshot = await getDocs(reviewsQuery);
      const updatedReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return updatedReviews;
    } catch (error) {
      console.error("Error fetching updated reviews:", error);
      return [];
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsOpen(true);
  };

  const onClose = () => setIsOpen(false);

  // !! TODO: Replace with spinner, this is just temporary to show routing
  if (!reviewListings) {
    return (
      <Box top={'50%'} textAlign={'center'}><Spinner size={'xl'}/></Box>
  );
  }

  const rndDormRating = (rating) => {
    var decimal = parseFloat(rating) % 1; // grab the decimal portion of the #
    if (decimal >= 0.5) {
      return parseInt(rating) + 1;
    }

    return parseInt(rating);
  }

  return (
    <Container minH="100vh">
      {/* !! This first Box is to store the basic info about the dorm itself */}
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
            <Stack direction="row">
              <ReviewStars rating={rndDormRating(reviewListings.rating)} />
              <Text>{reviewListings.rating}</Text>
            </Stack>
          </Container>

          <Button colorScheme="blue">
            <Link
              to={`/dorm/${id}/rate`}
              onClick={(e) => {
                if (!currentUID) {
                  e.preventDefault();
                  toast({
                    title: "Error: ",
                    description: "Please log in to rate this dorm.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }}
            >
              Rate
            </Link>
          </Button>
        </Container>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Box
          display={"flex"}
          flexDir={"column"}
          border={"1px solid grey"}
          position={"absolute"}
          left={"0"}
          mt={"0"}
          ml={"3vw"}
          maxW={"md"}
          pb={"1vw"}
          rounded="md"
        >
          <Text
            fontSize="1.3em"
            fontWeight="600"
            bgColor={'#0077b6'}
            color={'white'}
            borderTopRadius={'6px'}
            p={'.5em'}
          >
            Filter Reviews
          </Text>
          <Box 
            px={"1.5vw"}
            py={".5vw"}
            display={"flex"}
            flexDir={"column"} 
            maxW={"15em"}
            alignItems={"center"}
          >
            {drawCheckboxes()}
          </Box>
        </Box>
      </Box>
      {/* Review components are mapped and displayed here */}
      {filteredReviews.map((review) => (
        <Box
          border={"1px solid lightgrey"}
          borderRadius={"8px"}
          padding={"1em"}
          key={review.id}
          my={4}
        >
          {/* Title for review */}
          <Text fontWeight="bold">{review.title}</Text>
          <Divider mt={".3em"} mb={".3m"} />
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mt={".3em"} mb={".5em"}>
            <ReviewStars rating={parseInt(review.rating)} />
            <Text>Dorm type: <Text as={'b'}> {review.selectedOption}</Text></Text>
          </Box>

          {/* Review description text*/}
          <Text mb={".5em"}>{review.description}</Text>
          <Box display={"flex"} flexDir={"row"} overflowX={"auto"}>
            {review.imageUrls.map((imageUrl) => (
              <Image
                w={"150px"}
                h={"auto"}
                key={imageUrl}
                src={imageUrl}
                alt="Review Image"
                pr=".5em"
                onClick={() => handleImageClick(imageUrl)}
              />
            ))}
          </Box>
          {/* Container to store review buttons (thumbs up/down, report, delete) */}
          <Box
            mt={".5em"}
            display={"flex"}
            alignItems={"center"}
            flexDir={"row-reverse"}
          >
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
            {/*on click should change colors, default should be black */}
            {currentUID ? (
              <>
                <ThumbsDown
                  size={28}
                  color={thumbsDownColors[review.id] ? "#ff2600" : "#000000"}
                  weight="duotone"
                  onClick={() => handleThumbsDown(review.id)}
                />
                <Text ml={2}>
                  {review.thumbsDown ? review.thumbsDown.length : 0}
                </Text>
                <ThumbsUp
                  size={28}
                  color={thumbsUpColors[review.id] ? "#00f900" : "#000000"}
                  weight="duotone"
                  onClick={() => handleThumbsUp(review.id)}
                />
                <Text ml={2}>
                  {review.thumbsUp ? review.thumbsUp.length : 0}
                </Text>
              </>
            ) : (
              <>
                <ThumbsDown
                  size={28}
                  color="#000000"
                  weight="duotone"
                  isdisabled="true"
                />
                <Text ml={2}>
                  {review.thumbsDown ? review.thumbsDown.length : 0}
                </Text>
                <ThumbsUp
                  size={28}
                  color="#000000"
                  weight="duotone"
                  isdisable="true"
                />
                <Text ml={2}>
                  {review.thumbsUp ? review.thumbsUp.length : 0}
                </Text>
              </>
            )}
          </Box>
        </Box>
      ))}
      {/* !! This is the pop up for the images
      https://chakra-ui.com/docs/components/modal/usage
      */}
      <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />{" "}
          {/* shortened since a title probably isn't needed + styling*/}
          <ModalCloseButton />
          <ModalBody>
            <Image
              src={selectedImage}
              alt="Review Image"
              maxW="100%"
              maxH="100%"
            />
          </ModalBody>
          <ModalFooter />{" "}
          {/* shortened, description of image prob not needed + styling*/}
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default Reviews;
