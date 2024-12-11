import ProfileReviewCard from '@/components/profile_review_card';
import ProfileNavBar from '@/components/profile_navbar';
import { useEffect, useState } from 'react';
import { UserReviewCardProps } from '@/pages/timeline/user/[userId]';
import CreateListButton from './create_list_button';
import ListBar from './listbar';

interface ProfileContentsProps {
    reviews: UserReviewCardProps[];
    isSelfUser: boolean;
    callback: (id: string) => void;
  }

interface ListProps {
    id: string;
    name: string;
}

const lists: ListProps[] = [
    {
        id: 'list1',
        name: 'Fantasy and magic'
    },
    {
        id: 'list2',
        name: '3 a.m. reading'
    }
];

const ProfileContents: React.FC<ProfileContentsProps> = ({ reviews, isSelfUser, callback }) => {
    const [activeTab, setActiveTab] = useState('reviews');
    const [reviewList, setReviewList] = useState(reviews);
    const no_reviews_message = isSelfUser? "You have no reviews yet." : "This user has not made any reviews yet.";
    const no_lists_message = isSelfUser? "You have no lists yet." : "This user has not made any lists yet.";
    
    useEffect(() => {
        setReviewList(reviews);
    }, [reviews]);

    const handleOpenList = (id: string) => {
        console.log("Clicked list " + id);
    };

  return (
    <>
        <div style={{ width: '100%', borderTop: '1px solid #ddd' }}>
            <ProfileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <main style={{ flex: 1, padding: '16px' }}>
        {activeTab === 'reviews' && (
            <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflowY: 'visible',
                paddingRight: '16px',
            }}
            >
            {reviewList.length? (reviewList.map(review => (
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
                    callback={callback}
                />
            ))):(
                <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                    <h2 style={{fontSize: '2em', color: 'grey'}}>{no_reviews_message}</h2>
                </div>
            )}
            </div>
        ) }
        {activeTab === 'lists' && (
            <>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                    <CreateListButton></CreateListButton>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                {lists.length ? (lists.map(list => (
                    <div key={list.id} style={{ margin: '3px' }}>
                        <ListBar
                            key={list.id}
                            id={list.id}
                            name={list.name}
                            handleOpenList={handleOpenList}
                        />
                    </div>
                ))):(
                    <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                        <h2 style={{fontSize: '2em', color: 'grey'}}>{no_lists_message}</h2>
                    </div>
                )}
                </div>
            </>
        )}
        </main>
    </>
  );
};

export default ProfileContents;