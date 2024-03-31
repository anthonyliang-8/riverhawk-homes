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
  Checkbox
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

  const updateFilter = (stars) => { // function to display only the filtered reviews
    if (stars.length === 0) {
      setFilteredReviews(reviews);
    } else {
      const filteredReviews = reviews.filter(review => stars.includes(parseInt(review.rating)));
      setFilteredReviews(filteredReviews);
    }
  };

  const updateCheckbox = (star) => { // function to keep track of which filters are checked/unchecked
    const updatedStars = [...selectedStars];
    const index = updatedStars.indexOf(star);
    if (index === -1) {
      updatedStars.push(star);
    } else { 
      updatedStars.splice(index, 1);
    }

    setSelectedStars(updatedStars);
  }

  useEffect(() => {
    updateFilter(selectedStars);
  }, [selectedStars]);

  const drawCheckboxes = () => { // function to draw the checkboxes with the needed functionality for filtering
    const checkboxes = [];
    for (let i = 1; i <= 5; i++) {
        checkboxes.push( <Checkbox key={i} onChange={() => updateCheckbox(i)}>{i} Star</Checkbox> );
    }

    return checkboxes;
  };

  /* !! function to handle the counts of the thumbs ups and thumbs down */
  const handleReaction = async (reviewId, reaction) => {
    try {
      const reviewDocRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewDocRef);

      if (reviewDoc.exists()) {
        const reactionsRef = doc(
          db,
          "reviews",
          reviewId,
          "reactions",
          currentUID
        );
        const reactionDoc = await getDoc(reactionsRef);

        let updatedReactions = {
          thumbsUp: reviewDoc.data().thumbsUp || [],
          thumbsDown: reviewDoc.data().thumbsDown || [],
        };

        if (reactionDoc.exists()) {
          // User has already reacted, remove their reaction
          const existingReaction = reactionDoc.data().reaction;
          if (existingReaction === "thumbsUp") {
            updatedReactions.thumbsUp = updatedReactions.thumbsUp.filter(
              (uid) => uid !== currentUID
            );
          } else if (existingReaction === "thumbsDown") {
            updatedReactions.thumbsDown = updatedReactions.thumbsDown.filter(
              (uid) => uid !== currentUID
            );
          }
        }

        if (reaction === "thumbsUp") {
          updatedReactions.thumbsUp = arrayUnion(currentUID);
        } else if (reaction === "thumbsDown") {
          updatedReactions.thumbsDown = arrayUnion(currentUID);
        }

        await setDoc(reactionsRef, { reaction }, { merge: true });
        await updateDoc(reviewDocRef, updatedReactions);
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
        var newAvg =
          (dormData.rating * dormData.entries - reviewRating) /
          (dormData.entries - 1);
        newAvg = parseFloat(newAvg.toFixed(2));

        await updateDoc(dormDocRef, {
          rating: newAvg,
          entries: dormData.entries - 1,
        });
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
    return <div>Loading...</div>;
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
            <Text>Avg. Rating: {reviewListings.rating}</Text>
          </Container>

          <Button colorScheme="blue">
            <Link to={`/dorm/${id}/rate`}>Rate </Link>
          </Button>
        </Container>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Box display={'flex'}
          flexDir={'column'}
          border={'1px solid grey'}
          position={'absolute'}
          left={'0'}
          mt={'0'}
          ml={'3vw'}
          maxW={'md'}
          px={'1.5vw'}
          py={'1vw'}
          rounded="md">
            <Text borderBottom={"1px solid lightgrey"} mb={'0.5vw'} fontSize={'1.4em'}>Filter Reviews</Text>
            {drawCheckboxes()}
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
          <Box mt={".3em"} mb={".5em"}>
            <ReviewStars rating={parseInt(review.rating)} />
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
            <Warning size={28} color="#0432ff" weight="duotone" />
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