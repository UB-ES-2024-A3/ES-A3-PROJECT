import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navbar';
import { useRouter } from 'next/router';
import ReviewService from '@/services/reviewService';
import UserService from '@/services/userService';
import { UserReviewCardProps } from './timeline/user/[userId]';
import ProfileContents from '@/components/profile_content';

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
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: '500' }}>{username}</h1>
                        <div
                            style={{
                            display: 'flex',
                            marginTop: '8px',
                            gap: '10px'
                            }}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>100</span>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Followers</span>
                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem', marginLeft: '10px' }}>100</span>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Following</span>
                        </div>
                    </div>                    
                    <button id="logout_button" onClick={handleLogout}>Logout</button>
                </header>
                <ProfileContents reviews={reviews} isSelfUser={true}/>
            </div>
        </div>
    </NavBar>
    );
};
export default Profile;