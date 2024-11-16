import React from 'react';
import genreColors from '../styles/genreColors'
import { useEffect, useState } from 'react';
import ShowBookService from '@/services/showBookService';
import { renderStars } from './stars_rating';

interface BookInformationFields {
    id: string
}

interface Book{
    id: string,
    title: string,
    author: string,
    description: string,
    genres: string[],
    stars: number
}

const defaultGenreColor = '#e5e7eb';

const BookInformation: React.FC<BookInformationFields> = ({ id }) => { 
    const [book, setBook] = useState<Book>({author: "", title: "", description: "", genres: [], id:"", stars: 0});
    const reviews = [
        {
            username: "avid.reader",
            rating: 4,
            date: '11/02/22',
            time: '13:30:28',
            review: ''
        },
        {
            username: "tomatoface",
            rating: 5,
            date: '11/02/22',
            time: '14:00:03',
        },
        {
            username: "hater",
            rating: 1,
            date: '11/2/22',
            time: '13:30:28',
            review: 'Didn\'t like it one bit.'
        },
    ];
    const avgStars = 3.3;
 
    useEffect(() => {
        ShowBookService.getBookRequest(id)
            .then(result => {
                console.log(result);
                // TODO: Provisional
                result['stars'] = avgStars;
                setBook(result);
            })
            .catch(errorMsgs => {
                console.error(errorMsgs);
                setBook({ author: "", title: "", description: "", genres: [], id: "", stars: 0 });
            });
    }, [id]);
    

    return (
        <div style={{
        display: 'flex',
        height:'fit-content',
        justifyContent: 'center',
        width: '100%',
        padding: '1.5rem',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '70%',  
                backgroundColor: 'white',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '0.5rem',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                marginBottom: '0.5rem'
                            }}>
                                {book.title}
                            </h2>
                            <p style={{
                                fontSize: '1.5rem',
                                color: '#4b5563',
                                marginBottom: '1rem'
                            }}>
                                {book.author}
                            </p>
                        </div>
                        <div style={{ display: 'flex', marginRight: '32px' }}>
                            { renderStars(book.stars) }
                        </div>
                    </div>
                    <div>
                        <div style={{
                        height: 'auto',
                        overflowY: 'auto',
                        marginBottom: '2rem'
                        }}>
                            <p style={{
                                fontSize: '1rem',
                                lineHeight: '1.5'
                            }}>
                                {book.description}
                            </p>
                        </div>
                        <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginTop: '1rem'
                        }}>
                        {book.genres && book.genres.length > 0 && book.genres.map((genre) => (
                            <span key={genre} style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: genreColors[genre] || defaultGenreColor,
                            color: '#1f2937',
                            fontSize: '1rem',
                            fontWeight: 500,
                            borderRadius: '9999px'
                            }}>
                            {genre}
                            </span>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
  
  export default BookInformation;
  