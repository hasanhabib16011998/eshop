import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingsProps {
    rating?: number;
}

const Ratings = ({ rating = 0 }: RatingsProps) => {
    // Ensure the rating stays between 0 and 5
    const safeRating = Math.max(0, Math.min(5, rating));
    
    // Calculate star distributions
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.1; // Treat anything above .1 as a half star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center space-x-1" title={`${safeRating.toFixed(1)} out of 5 stars`}>
            {/* Render Full Stars */}
            {[...Array(fullStars)].map((_, i) => (
                <Star 
                    key={`full-${i}`} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                />
            ))}

            {/* Render Half Star (Stacked on top of an empty star for the gray background) */}
            {hasHalfStar && (
                <div className="relative w-4 h-4">
                    <Star className="absolute top-0 left-0 w-4 h-4 text-gray-300" />
                    <StarHalf className="absolute top-0 left-0 w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
            )}

            {/* Render Empty Stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <Star 
                    key={`empty-${i}`} 
                    className="w-4 h-4 text-gray-300" 
                />
            ))}

            {/* Optional: Numerical Rating Display */}
            <span className="ml-1 text-xs text-gray-500 font-medium pt-[2px]">
                ({safeRating.toFixed(1)})
            </span>
        </div>
    );
};

export default Ratings;