import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navbar';
import { useRouter } from 'next/router';
import ReviewService from '@/services/reviewService';
import UserService from '@/services/userService';
import ProfileContents, { ListProps } from '@/components/profile_content';
import FollowersService from '@/services/followersService';
import mockService from '@/services/mockService';

export interface UserReviewCardProps {
    title: string,
    author: string,
    stars: number,
    comment?: string,
    date?: string,
    time?: string,
    book_id: string,
    id: string,
    user_id: string
  }

const UserProfile = () => {
  const [reviews, setReviews] = useState<UserReviewCardProps[]>([]);
  const [ownLists, setOwnLists] = useState<ListProps[]>([]);
  const router = useRouter()
  let userId = router.query.userId as string;
  const [selfUserId, setSelfUserId] = useState('');
  const [userData, setUserData] = useState({"username": '', "followers": null, "following": null});
  const [follows, setFollows] = useState<boolean|null>(null);
  const [followButton, setFollowButton] = useState({label: "Follow", style: ""});

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') as string;
    setSelfUserId(storedUserId)
    if (storedUserId == userId) {
        router.push("/profile")
    }
  }, []);

  useEffect(() => {
    FollowersService.isFollower(selfUserId, userId)
        .then(isFollower => {
            if(isFollower){
                setFollows(true);
                setFollowButton({label: "Unfollow", style: "secondaryButton"})
            }
            else{
                setFollows(false);
                setFollowButton({label: "Follow", style: ""})
            }
        })
        .catch(except => {
            console.log(except);
        });
  }, [selfUserId, userId]);

  useEffect(() => {
    userId = router.query.userId as string;
  }, [router.query.userId]);

  useEffect(() => {
    if (userId && router.isReady){
        ReviewService.getUserReviews(userId)
        .then(reviewList => {
            setReviews(reviewList);
        })
        .catch(except => {
            console.log(except);
            setReviews([]);
        });
        UserService.getUser(userId)
        .then(userData => {
            setUserData(userData);
        })
        .catch(except => {
            console.log(except);
        });
        mockService.getUserLists(userId)
        .then(lists => {
            setOwnLists(lists);
        })
        .catch(except => {
            console.log(except);
            setOwnLists([]);
        });
    }
}, [userId, router.isReady, follows]);

const handleFollow = () => {
    if (follows) {
        FollowersService.unfollowUser(selfUserId, userId)
        .then(succeed => {
            if(succeed){
                setFollows(false);
                setFollowButton({label: "Follow", style: ""});
            }
        })
        .catch(except => {
            console.log(except);
        });
    }
    else{
        FollowersService.followUser(selfUserId, userId)
        .then(succeed => {
            if(succeed){
                setFollows(true);
                setFollowButton({label: "Unfollow", style: "secondaryButton"})
            }
        })
        .catch(except => {
            console.log(except);
        });
    }    
}
  return (
    <NavBar>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '65%', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                <header style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: '500' }}>{userData.username}</h1>
                        <div
                            style={{
                            display: 'flex',
                            marginTop: '8px',
                            gap: '10px'
                            }}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{userData.followers}</span>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Followers</span>
                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem', marginLeft: '10px' }}>{userData.following}</span>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Following</span>
                        </div>
                    </div>
                    {userId && selfUserId &&
                        <button onClick={handleFollow} id={"follow"} className={followButton.style}>{followButton.label}</button>
                    }
                </header>
                <ProfileContents reviews={reviews} ownLists={ownLists} isSelfUser={false} callback={() => {}}/>
            </div>
        </div>
    </NavBar>
  );
};

export default UserProfile;