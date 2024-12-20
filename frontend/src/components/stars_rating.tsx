import { Star } from 'lucide-react';

export const getRatingStars = (rating: number) => {
    let validRating = true;

    // If the rating value is incorrect, we assign 0 to rating
    if (rating < 0 || rating > 5) {
        rating = 0;
        validRating = false;
    }
    let fullStars = Math.floor(rating);
    const starDecimals = rating - fullStars;

    // Adjust logic for half stars
    const hasHalfStar = 0.25 <= starDecimals && starDecimals < 0.75;
    if (starDecimals >= 0.75) {
        fullStars += 1;
    }

    return { fullStars, hasHalfStar, validRating };
};

export const renderStars = (rating: number) => {
    const stars = [];
    const { fullStars, hasHalfStar, validRating } = getRatingStars(rating);

    if (!validRating) {
        stars.push(
            <div key="no-reviews">
                {"No reviews"}
            </div>
        );
    } else {
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star 
                    key={`full-${i}`} 
                    style={{ width: "24px", height: "24px", color: 'var(--star-yellow)', fill: 'var(--star-yellow)' }} 
                />
            );
        }

        // Half star
        if (hasHalfStar) {
            stars.push(
                <div key="half" style={{ position: "relative", display: "inline-block" }}>
                    <Star style={{ width: "24px", height: "24px", color: 'var(--star-gray)' }} />
                    <div style={{ position: "absolute", inset: "0", overflow: "hidden", width: "50%" }}>
                        <Star style={{ width: "24px", height: "24px", color: 'var(--star-yellow)', fill: 'var(--star-yellow)' }} />
                    </div>
                </div>
            );
        }

        // Empty stars
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star 
                    key={`empty-${i}`} 
                    style={{ width: "24px", height: "24px", color: 'var(--star-gray)' }} 
                />
            );
        }
    }

    return stars;
};
