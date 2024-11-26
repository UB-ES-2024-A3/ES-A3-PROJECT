import ProfileReviewCard from '@/components/profile_review_card';
import ProfileNavBar from '@/components/profile_navbar';
import { useState } from 'react';
import { UserReviewCardProps } from '@/pages/timeline/user/[userId]';

interface ProfileContentsProps {
    reviews: UserReviewCardProps[];
  }

const ProfileContents: React.FC<ProfileContentsProps> = ({ reviews }) => {
    const [activeTab, setActiveTab] = useState('reviews');

  return (
    <>
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
    </>
  );
};

export default ProfileContents;