// Profile.tsx
import React, { useState } from 'react';
import ProfileReviewCard from './profile_review_card';
import ProfileNavBar from './profile_navbar';

interface ProfileProps {
  handleLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ handleLogout }) => {
  const [activeTab, setActiveTab] = useState('reviews');
  // SAMPLE DATA
  const bookTitle = "Book title";
  const author = "Author";
  const rating = 3.5;
  const review = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const date = "23/11/2023";
  const time = "14:30:45";
  const reviews = [
    {
        bookTitle: bookTitle,
        author: author,
        rating: rating,
        review: review,
        date: date,
        time: time
    },
    {
        bookTitle: bookTitle,
        author: author,
        rating: rating,
        date: date,
        time: time
    },
    {
        bookTitle: bookTitle,
        author: author,
        rating: rating,
        review: review
    },
    {
        bookTitle: bookTitle,
        author: author,
        rating: rating
    }
  ]
  //
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '65%', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <header style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '500' }}>username</h1>
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
                <ProfileReviewCard key={index} bookTitle={review.bookTitle} author={review.author} rating={review.rating} date={review.date} time={review.time} review={review.review}/>
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
  );
};

export default Profile;
