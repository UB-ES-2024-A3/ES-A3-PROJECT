import React from 'react';
import genreColors from '../styles/genreColors'

interface BookInformationFields {
    title: string;
    author: string;
    description: string;
    genres: string[];
}



const defaultGenreColor = '#e5e7eb';

const BookInformation: React.FC<BookInformationFields> = ({ title, author, description, genres }) => {  
    return (
        <div style={{
        display: 'flex',
        height:"fit-content",
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
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                    }}>
                        {title}
                    </h2>
                    <p style={{
                        fontSize: '1.5rem',
                        color: '#4b5563',
                        marginBottom: '1rem'
                    }}>
                        {author}
                    </p>
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
                                {description}
                            </p>
                        </div>
                        <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginTop: '1rem'
                        }}>
                        {genres && genres.length > 0 && genres.map((genre) => (
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
  