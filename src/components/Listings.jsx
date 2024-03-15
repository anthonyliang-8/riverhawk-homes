import React, { useState, useEffect } from 'react';
import '../css/styles.css'
import Dorm from './Dorm';
import { db, storage } from '../Firebase'
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage'

function Listings() {
  const [dorms, setDorms] = useState([]);

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

  return (
    <div className="dorms-container">  
      {dorms.map((dorm) => (
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
  );
}

export default Listings;
