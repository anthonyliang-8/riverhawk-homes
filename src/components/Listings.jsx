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
      const data = docs.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDorms(data);
    };

    fetchData();
  }, []);

  return (
    <div className="dorms-container">  
      {dorms.map((dorm) => (
        <Dorm 
          key={dorm.id}
          name={dorm.name} 
          campus={dorm.campus} 
          price_range={dorm.price} 
          rating={dorm.rating} 
          photo={dorm.image_url}
        />
      ))}
    </div>
  );
}

export default Listings;
