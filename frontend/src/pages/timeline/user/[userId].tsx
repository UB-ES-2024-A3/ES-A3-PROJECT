import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navbar';
import { useRouter } from 'next/router';
import ReviewService from '@/services/reviewService';
import UserService from '@/services/userService';
import ProfileContents from '@/components/profile_content';

export interface UserReviewCardProps {
    title: string,
    author: string,
    stars: number,
    comment?: string,
    date?: string,
    time?: string,
    book_id: string
  }

const Profile = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<UserReviewCardProps[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  useEffect(() => {
    if (userId){
        ReviewService.getUserReviews(userId)
        .then(reviewList => {
            setReviews(reviewList);
        })
        .catch(except => {
            console.log(except);
            setReviews([]);
        });
        UserService.getUsername(userId)
        .then(userName => {
            console.log(userName)
            setUsername(userName);
        })
        .catch(except => {
            console.log(except);
            setUsername('');
        });
    }
}, [userId]);
  return (
    <NavBar>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '65%', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                <header style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: '500' }}>{username}</h1>
                    <button onClick={handleLogout}>Logout</button>
                </header>
                <ProfileContents reviews={reviews}/>
            </div>
        </div>
    </NavBar>
  );
};

export default Profile;