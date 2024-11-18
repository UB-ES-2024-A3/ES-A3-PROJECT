
import { useState } from 'react'
import { Star } from 'lucide-react'
import ReviewService from '@/services/reviewService'

interface AddReviewButtonFields {
  author: string,
  title: string,
  bookId: string,
  callback: (review: ReviewResponseData) => void
}

export interface ReviewResponseData {
  stars: number,
  comment?: string,
  date?: string,
  time?: string
}

const AddReviewButton: React.FC<AddReviewButtonFields> = ({title, author, bookId, callback}) =>{
  const [isOpen, setIsOpen] = useState(false)
  const [review, setReview] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [showError, setShowError] = useState(false)
  const maxChars = 1000

  const sendReviewRequest = async () => {
    return ReviewService.createReviewRequest(
      rating,
      review,
      bookId
    )
    .then(result => {
      callback(result);
      return true;
    })
    .catch(errorMsg => {
      console.log(errorMsg);
      return false;
    });
  };

  const  handleSubmit = async () => {
    const success = await sendReviewRequest();
    if (success === true) {
      setIsOpen(false);
      setReview('');
      setRating(0);
    }
    else {
      setShowError(true);
    }
    
  }
  
  const handleCancelReview = () => {
    setIsOpen(false);
    setReview('');
    setRating(0);
  }

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={() => setIsOpen(true)}>
        Add a Review
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',}}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', height: 'fit-content', maxWidth: '50%'}}>
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                Review for &quot;{title}&quot; by &quot;{author}&quot;
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className='secondaryButton'
                  >
                    <Star style={{ width: '1.5rem', height: '1.5rem', color: star <= (hoveredRating || rating) ? 'var(--star-yellow)' : 'var(--star-gray)', fill: star <= (hoveredRating || rating) ? 'var(--star-yellow)' : 'var(--star-gray)' }}/>
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <textarea
                  value={review}
                  onChange={(e) => {
                    if (e.target.value.length <= maxChars) {
                      setReview(e.target.value)
                    }
                  }}
                  placeholder="Write your review..."
                  style={{ width: '100%', height: '200px', padding: '0.75rem', border: '1px solid black', borderRadius: '0.375rem', outline: 'none', resize: 'none' }}
                  maxLength={maxChars}
                />
                <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', fontSize: '0.875rem', color: review.length >= maxChars-10? 'red': 'gray'}}>
                  {review.length}/{maxChars}
                </div>
              </div>
              {showError && (
                <p className="mt-1 text-sm text-red-500">{"There have been an error submiting your review. Please try again later."}</p>
              )}

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={handleCancelReview}
                  className='secondaryButton'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!rating}
                  style={{ cursor: rating ? 'pointer' : 'not-allowed', opacity: rating ? '1' : '0.5' }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddReviewButton;