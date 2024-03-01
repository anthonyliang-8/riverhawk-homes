import React, { useState, useEffect } from 'react';
import '../css/styles.css'
import Dorm from './Dorm';

function Listings() {
  const [dorms, setDorms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('../mock_data.json');
      const data = await response.json();
      setDorms(data);
    };

    fetchData();
  }, []);

  return (
    <div className="dorms-container">  
      {dorms.map((dorm) => (
        <Dorm 
          key={dorm.id}
          img={dorm.photo}
          name={dorm.dorm_name} 
          campus={dorm.campus} 
          price_range={dorm.price_range} 
          rating={dorm.rating} 
          photo={dorm.photo}
        />
      ))}
    </div>
  );
}

export default Listings;
