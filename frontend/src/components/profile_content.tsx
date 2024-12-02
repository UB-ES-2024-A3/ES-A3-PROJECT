import ProfileReviewCard from '@/components/profile_review_card';
import ProfileNavBar from '@/components/profile_navbar';
import { useState } from 'react';
import { UserReviewCardProps } from '@/pages/timeline/user/[userId]';

interface ProfileContentsProps {
    reviews: UserReviewCardProps[];
    isSelfUser: boolean;
  }

const ProfileContents: React.FC<ProfileContentsProps> = ({ reviews, isSelfUser }) => {
    const [activeTab, setActiveTab] = useState('reviews');
    const no_reviews_message = isSelfUser? "You have no reviews yet." : "This user has not made any reviews yet.";

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
            {reviews.length? (reviews.map(review => (
                <ProfileReviewCard
                    key={review.id}
                    bookTitle={review.title}
                    author={review.author}
                    rating={review.stars}
                    date={review.date}
                    time={review.time}
                    review={review.comment}
                    book_id={review.book_id}
                    review_id={review.id}
                    user_id={review.user_id}
                />
            ))):(
                <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                    <h2 style={{fontSize: '2em', color: 'grey'}}>{no_reviews_message}</h2>
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