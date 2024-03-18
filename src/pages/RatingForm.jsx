import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { storage, db } from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from 'firebase/firestore';

const RatingForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrls = [];

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
      // Add review data to Firestore
      const reviewsCollection = collection(db, 'reviews');
      const newReview = await addDoc(reviewsCollection, {
        dormId: id,
        title,
        description,
        imageUrls,
      });
      console.log('Review added with ID:', newReview.id);
    } catch (error) {
      console.error('Error adding review:', error);
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
