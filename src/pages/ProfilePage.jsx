import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Firebase';

const ProfilePage = () => {
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName);
      } else {
        setDisplayName('');
      }
    });

    return unsubscribe;
  }, []);

  // user log out logic 
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDisplayName('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <h2>Welcome, {displayName}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;