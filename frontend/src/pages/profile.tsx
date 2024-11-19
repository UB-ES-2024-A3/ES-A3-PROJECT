// Profile.tsx
import React, { useState, useEffect } from 'react';
import ProfileReviewCard from '@/components/profile_review_card';
import ProfileNavBar from '@/components/profile_navbar';
import NavBar from '@/components/navbar';
import { useRouter } from 'next/router';
import ReviewService from '@/services/reviewService';

const Profile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([])
  const [userId, setUserId] = useState<string | null>(null);

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
    ReviewService.getUserReviews(String(userId))
        .then(reviewList => {
            console.log("reviews", reviewList)
            setReviews(reviewList);
        })
        .catch(except => {
            console.log(except);
            setReviews([]);
        });
}, []);
  return (
    <NavBar>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '65%', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                <header style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: '500' }}>{username}</h1>
                    <button onClick={handleLogout}>Logout</button>
                </header>
                <div style={{ width: '100%', borderTop: '1px solid #ddd' }}>
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
                        <ProfileReviewCard key={index} bookTitle={review.title} author={review.author} rating={review.stars} date={review.date} time={review.time} review={review.comment}/>
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