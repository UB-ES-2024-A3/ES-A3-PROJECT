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

const UserProfile = () => {
  const [reviews, setReviews] = useState<UserReviewCardProps[]>([]);
  const router = useRouter();
  const { userId } = router.query;
  const [username, setUsername] = useState('');
  const [follows, setFollows] = useState(false);
  const [followButton, setFollowButton] = useState({label: "Follow", style: ""});

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId == userId) {
        router.push("/profile")
    }
  }, []);

  useEffect(() => {
    if (userId && router.isReady){
        ReviewService.getUserReviews(String(userId))
        .then(reviewList => {
            setReviews(reviewList);
        })
        .catch(except => {
            console.log(except);
            setReviews([]);
        });
        UserService.getUsername(String(userId))
        .then(userName => {
            setUsername(userName);
        })
        .catch(except => {
            console.log(except);
            setUsername('');
        });
    }
}, [userId, router.isReady]);

const handleFollow = () => {
    setFollows(!follows);
    if (follows) {
        setFollowButton({label: "Follow", style: ""});
    }
    else{
        setFollowButton({label: "Unfollow", style: "secondaryButton"})
    }
    
}
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
                    <button onClick={handleFollow} className={followButton.style}>{followButton.label}</button>
                </header>
                <ProfileContents reviews={reviews}/>
            </div>
        </div>
    </NavBar>
  );
};

export default UserProfile;