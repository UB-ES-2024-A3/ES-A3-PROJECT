import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navbar';
import { useRouter } from 'next/router';
import ReviewService from '@/services/reviewService';
import UserService from '@/services/userService';
import { UserReviewCardProps } from './timeline/user/[userId]';
import ProfileContents, { ListProps } from '@/components/profile_content';
import ListService from '@/services/listService';
import FollowersFollowingPopup from '@/components/followers_following_popup';


const Profile = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<UserReviewCardProps[]>([]);
  const [ownLists, setOwnLists] = useState<ListProps[]>([]);
  const [followedLists, setFollowedLists] = useState<ListProps[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState({"username": '', "followers": null, "following": null});
  const [newList, setNewList] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId); 
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const deleteReviewCallback = (review_id: string) => {
    const reviewIndex = reviews.findIndex((review) => {
        return review.id === review_id;
    });
    setReviews(reviews.slice(0, reviewIndex).concat(reviews.slice(reviewIndex + 1)));
  };

  const updateLists = () => {
    setNewList(!newList);
  };

  function getOwnLists(userId: string) {
    ListService.getUserLists(userId)
    .then(lists => {
      setOwnLists(lists);
    })
    .catch(except => {
      console.log(except);
      setOwnLists([]);
    });
  }

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
        UserService.getUser(userId)
        .then(userData => {
            setUserData(userData);
        })
        .catch(except => {
            console.log(except);
        });
        getOwnLists(userId);
        ListService.getFollowedLists(userId)
        .then((lists: ListProps[]) => {
            const updatedLists = lists
                ?.filter(list => list.list_id !== undefined) 
                .map(list => ({
                    ...list,
                    id: list.list_id as string, 
                }));
    
            console.log(updatedLists);
            if (updatedLists) {
                setFollowedLists(updatedLists as ListProps[]); 
            }
        })
        .catch(except => {
            console.log(except);
            setFollowedLists([]);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (userId)
      getOwnLists(userId);
  }, [newList]);

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
                            <FollowersFollowingPopup amount={userData.followers} _tabSelected='Followers' userId={userId}></FollowersFollowingPopup>
                            <FollowersFollowingPopup amount={userData.following} _tabSelected='Following' userId={userId}></FollowersFollowingPopup>
                        </div>
                    </div>                    
                    <button id="logout_button" onClick={handleLogout}>Logout</button>
                </header>
                <ProfileContents
                    reviews={reviews}
                    ownLists={ownLists}
                    followedLists={followedLists}
                    isSelfUser={true}
                    deleteReviewCallback={deleteReviewCallback}
                    createListCallback={updateLists}
                />
            </div>
        </div>
    </NavBar>
    );
};
export default Profile;