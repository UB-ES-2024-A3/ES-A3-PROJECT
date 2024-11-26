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
                    <button onClick={handleLogout}>Logout</button>
                </header>
                <div style={{ width: '100%', borderTop: '1px solid #bbb' }}>
                    <ProfileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <main style={{ flex: 1, padding: '16px' }}>
                {activeTab === 'reviews' ? (
                    <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        overflowY: 'visible',
                        paddingRight: '16px',
                    }}
                    >
                    {reviews.length? (reviews.map((review, index) => (
                        <ProfileReviewCard key={index} bookTitle={review.title} author={review.author} rating={review.stars} date={review.date} time={review.time} review={review.comment} book_id={review.book_id}/>
                    ))):(
                        <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                            <h2 style={{fontSize: '2em', color: 'grey'}}>You have no reviews yet.</h2>
                        </div>
                    )}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                </main>
            </div>
        </div>
    </NavBar>
  );
};

export default Profile;