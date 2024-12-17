import { useTimelineContext } from '@/contexts/TimelineContext';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import BookBar from '@/components/bookbar';
//TODO: temporal service
import ListService from '@/services/listService';

interface Book {
    id: string;
    title: string;
    author: string;
}

const ListContents: React.FC = () => {
    const [bookResults, setBookResults] = useState<Book[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    const {timelineState,setTimelineState} = useTimelineContext();
    // TODO: for the moment we use this query
    const router = useRouter();
    const { listId } = router.query;
    const name = router.query.name as string; 
    const [username, setUsername] = useState('');
    const [followButton, setFollowButton] = useState({state: false, label: '', class: ''});
    const [isLoadingFollow, setIsLoadingFollow] = useState(true);
    const isOtherUserList = router.pathname.startsWith('/timeline');

     
    const handleOpenBook = (id: string) =>{
      setBookResults([]);
      setTimelineState({page: "book", data: id});
      router.push("/timeline/book/"+ id)
    };

    const handleClickButton = async () => {
      setIsLoadingFollow(true);
      setFollowButton({...followButton, class: 'waiting'});
      const isFollowing = followButton.state;
      const id = listId as string;
      if (isFollowing) {
        ListService.unfollowList(id)
        .then(success => {
          if (success) {
            setFollowButton({state: false, label: 'Follow list', class: ''});
          } else {
            setFollowButton({...followButton, class: 'secondaryButton'});
          }
        })
        .catch(except => {
          console.log(except);
          setFollowButton({...followButton, class: 'secondaryButton'});
        })
        .finally(() => setIsLoadingFollow(false));
      } else {
        ListService.followList(id)
        .then(success => {
          if (success) {
            setFollowButton({state: true, label: 'Unfollow list', class: 'secondaryButton'});
          } else {
            setFollowButton({...followButton, class: ''});
          }
          setIsLoadingBooks(false);
        })
        .catch(except => {
          console.log(except);
          setFollowButton({...followButton, class: ''});
          setIsLoadingFollow(false);
        })
        .finally(() => setIsLoadingFollow(false));
      }
    };

    useEffect(() => {
      if(listId){
        setIsLoadingBooks(true);
        const id = listId as string;
        ListService.getBooksOfList(id)
        .then(result => {
          console.log(result)
          setUsername(result.username);
          setBookResults(result.books);
          setIsLoadingBooks(false);
        })
        .catch(except => {
            console.log(except);
            setBookResults([]);
            setIsLoadingBooks(false);
        });
        ListService.getIsListFollowed(id)
        .then(isFollowed => {
          if (isFollowed) {
            setFollowButton({state: true, label: 'Unfollow list', class: 'secondaryButton'});
          } else {
            setFollowButton({...followButton, label: 'Follow list'});
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => setIsLoadingFollow(false));
      } 
    }, [listId]);

    return(
        <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column'}}>
            {isOtherUserList && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', margin: '20px 33px 0px 0px' }}>
                <button
                    id="follow-list-btn"
                    className={followButton.class}
                    onClick={handleClickButton}
                    disabled={isLoadingFollow}
                >
                      {followButton.label}
                </button>
            </div>
            )}
            <div style={{ 
                margin: '20px', 
                textAlign: 'center', 
                fontSize: '2em', 
                display: 'flex', 
                justifyContent: 'center'
            }}>
                <span style={{flex: 1, textAlign: 'right'}}>{name}</span>
                <span style={{ margin: '0 30px', alignSelf: 'center', flex: 0}}>|</span>
                <span style={{flex: 1, textAlign: 'left'}}>{username}</span>
            </div>
            <div>
              {bookResults.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', margin: '0px 30px'}}>
                  {bookResults.map((book) => (
                    <div key={book.id} style={{margin: '3px'}}>
                      <BookBar key={book.id} id={book.id} title={book.title} author={book.author} showRating={false} rating={5} handleOpenBook={handleOpenBook}/>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '70vh', display: 'flex', flexDirection: 'column'}}> 
                  {isLoadingBooks ? (
                    <h2 style={{fontSize: '1.5em', color: 'grey'}}> Loading... </h2>
                  ):(
                    <h2 style={{fontSize: '1.5em', color: 'grey'}}> No books added </h2>
                  )}
                </div>
              )}
            </div>
        </div>

    );

};
export default ListContents;