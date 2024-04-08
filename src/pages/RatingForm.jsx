import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RatingStars from "../components/RatingStars";
import {
  Box,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  useToast, // Import useToast from Chakra UI
} from "@chakra-ui/react";
import { storage, db, auth } from "../Firebase"; // Import auth from Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged

// Function to update the avg rating. It updates the database whenever a rating is submitted
// I added some imports to make this work.
async function updateAvgRating(db, id, rating) {
  try {
    const dormDocRef = doc(db, "dorms", id);
    const dormSnapshot = await getDoc(dormDocRef);

    if (dormSnapshot.exists()) {
      const dormData = dormSnapshot.data();
      var newAvg =
        (dormData.rating * dormData.entries + rating) / (dormData.entries + 1);
      newAvg = parseFloat(newAvg.toFixed(2));

      await updateDoc(dormDocRef, {
        rating: newAvg,
        entries: dormData.entries + 1,
      }); // update db
    } else {
      console.log("No such dorm exists!");
    }
  } catch (error) {
    console.error("Error updating average:", error);
  }
}

const RatingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication
  const toast = useToast();

  useEffect(() => {
    // Listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Update the authentication state
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrls = [];

    if (!isAuthenticated) {
      // show a Toast notification if the user is not authenticated
      toast({
        title: "Submission Error: ",
        description: "You need to be logged in to submit a review.",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
      return; // exit function
    }

    // upload images to Firebase Storage
    for (const image of images) {
      const storageRef = ref(storage, `reviews/${id}/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.log("Error uploading image:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            imageUrls.push(downloadURL);
            resolve();
          }
        );
      });
    }
    try {
      // add review data to Firestore
      const reviewsCollection = collection(db, "reviews");
      const newReview = await addDoc(reviewsCollection, {
        dormId: id,
        title,
        description,
        imageUrls,
        rating,
      });
      console.log("Review added with ID:", newReview.id);
      await updateAvgRating(db, id, parseInt(rating)); // update avg rating of dorm
      toast({
        title: "Success! ",
        description: "Redirecting to home page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/"); // redirect back to home
    } catch (error) {
      console.error("Error adding review:", error);
    }
    // TODO: Save review data (title, description, imageUrls) to Firestore
    console.log("Image URLs:", imageUrls);
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Great dorm!"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Review Rating</FormLabel>
          <RatingStars
            value={rating}
            onChange={(newRating) => setRating(newRating)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Review Description</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="I really liked this dorm..."
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Upload Image</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={
            images.length > 0 && uploadProgress > 0 && uploadProgress < 100
          }
        >
          {uploadProgress === 0
            ? "Submit"
            : `Uploading ${uploadProgress.toFixed(0)}%`}
        </Button>
      </form>
    </Box>
  );
};

export default RatingForm;
