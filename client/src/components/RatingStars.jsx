import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const RatingStars = ({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 'md' 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= rating;
        
        return (
          <motion.button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            disabled={readonly}
            whileHover={!readonly ? { scale: 1.2 } : undefined}
            whileTap={!readonly ? { scale: 0.9 } : undefined}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
          >
            <Star
              className={`${sizes[size]} transition-colors ${
                isFilled
                  ? 'text-yellow-400 fill-current star-rating'
                  : 'text-gray-300 star-rating empty'
              } ${!readonly && 'hover:text-yellow-400'}`}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

export default RatingStars;