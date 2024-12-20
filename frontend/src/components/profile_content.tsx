import ProfileReviewCard from '@/components/profile_review_card';
import ProfileNavBar from '@/components/profile_navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserReviewCardProps } from '@/pages/timeline/user/[userId]';
import CreateListButton from './create_list_button';
import { useTimelineContext } from '@/contexts/TimelineContext';
import ListBar from './listbar';

interface ProfileContentsProps {
    reviews: UserReviewCardProps[];
    ownLists: ListProps[];
    followedLists: ListProps[];
    isSelfUser: boolean;
    deleteReviewCallback: (id: string) => void;
    createListCallback: () => void;
  }

export interface ListProps { // TODO: should be moved to the visualize review page
    id: string;
    name: string;
    username?: string;
    list_id?: string;
    user_id: string;
}

const ProfileContents: React.FC<ProfileContentsProps> = ({ reviews, ownLists, followedLists, isSelfUser, deleteReviewCallback: deleteCallback, createListCallback }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('reviews');
    const [reviewList, setReviewList] = useState(reviews);
    const [ownListsList, setOwnListsList] = useState<ListProps[]>(ownLists);
    const no_reviews_message = isSelfUser? "You have no reviews yet." : "This user has not made any reviews yet.";
    const user_no_lists_message = isSelfUser? "You have no lists yet." : "This user has not made any lists yet.";
    const followed_no_lists_message = isSelfUser? "No lists followed." : "This user doesn't follow any lists.";
    const {setTimelineState} = useTimelineContext();
    
    useEffect(() => {
        setReviewList(reviews);
    }, [reviews]);

    useEffect(() => {
        setOwnListsList(ownLists);
    }, [ownLists]);

    const handleOpenList = (id: string, name: string, username: string | undefined, user_id: string) => {
        const storedUserId = localStorage.getItem('userId');
        if ((!username && isSelfUser) || (!isSelfUser && user_id == storedUserId)) {
            const combinedData = `${id}|${name}`;
            setTimelineState({ page: "list_profile", data: combinedData }); 
            router.push(`/profile/list/${id}?name=${encodeURIComponent(name)}`); 
        }
        else {
            const combinedData = `${id}|${name}`;
            setTimelineState({ page: "list_timeline", data: combinedData }); 
            router.push(`/timeline/list/${id}?name=${encodeURIComponent(name)}`); 
        }
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
                    callback={deleteCallback}
                />
            ))):(
                <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                    <h2 style={{fontSize: '2em', color: 'grey'}}>{no_reviews_message}</h2>
                </div>
            )}
            </div>
        ) }
        {activeTab === 'created-lists' && (
            <>  
                { isSelfUser? (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                        <CreateListButton callback={createListCallback}></CreateListButton>
                    </div>
                ):(
                    <></>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                {ownListsList.length ? (ownListsList.map(list => (
                    <div key={list.id} style={{ margin: '3px' }}>
                        <ListBar
                            key={list.id}
                            id={list.id}
                            name={list.name}
                            user_id={list.user_id}
                            handleOpenList={handleOpenList}
                        />
                    </div>
                ))):(
                    <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                        <h2 id="user_no_lists_message" style={{fontSize: '2em', color: 'grey'}}>{user_no_lists_message}</h2>
                    </div>
                )}
                </div>
            </>
        )}
        {activeTab === 'followed-lists' && (
            <>  
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                {followedLists.length ? (followedLists.map(list => (
                    <div key={list.id} style={{ margin: '3px' }}>
                        <ListBar
                            key={list.id}
                            id={list.id}
                            username= {list.username}
                            name={list.name}
                            user_id={list.user_id}
                            handleOpenList={handleOpenList}
                        />
                    </div>
                ))):(
                    <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                        <h2 id="followed_no_lists_message" style={{fontSize: '2em', color: 'grey'}}>{followed_no_lists_message}</h2>
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