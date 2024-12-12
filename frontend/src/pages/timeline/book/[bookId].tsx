import Head from 'next/head';
import NavBar from '@/components/navbar';
import SearchBar from '@/components/searchbar';
import BookInformation from '@/components/book_information';
import { useEffect, useState } from 'react';
import ShowBookService from '@/services/showBookService';
import { useTimelineContext } from '@/contexts/TimelineContext';
import BookReviewSection from '@/components/book_review_section';
import AddToListsButton, { ListCheckboxProps } from '@/components/add_to_lists';
import mockService from '@/services/mockService';

export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    genres: string[];
    avgstars: number;
    numreviews: number;
}

const BookPage = () => {
  const {timelineState} = useTimelineContext();
  const  bookId  = timelineState.data;

  const [book, setBook] = useState<Book>({author: "", title: "", description: "", genres: [], id:"", avgstars:0, numreviews: 0 });
  const [newReview, setNewReview] = useState<boolean>(false);

  const [lists, setLists] = useState<ListCheckboxProps[]>([]);
 
  useEffect(() => {
      ShowBookService.getBookRequest(bookId)
          .then(result => {
              setBook(result);
          })
          .catch(errorMsgs => {
              console.error(errorMsgs);
              setBook({ author: "", title: "", description: "", genres: [], id: "", avgstars:0, numreviews: 0 });
          });
  }, [bookId, newReview]);

  useEffect(() => {
    mockService.getListsWithBook(bookId)
      .then(retLists => {
        setLists(retLists);
      })
      .catch(except => {
        console.log(except);
        setLists([]);
      });
  }, [bookId]);

  const newReviewCallback = () => {
    setNewReview(!newReview);
  }

  return (
    <>
      <Head>
        <title>{book.title} | Rebook</title>
      </Head>
      <NavBar>
          <SearchBar placeholder="Search..." buttonLabel="Search" id='searchbar'>
            <>
                <BookInformation book={book} />
                <AddToListsButton lists={lists} callback={() => {}} />
                <BookReviewSection book={book} callback={newReviewCallback} />
            </>
          </SearchBar>
      </NavBar>
    </>
  );
};

export default BookPage;
