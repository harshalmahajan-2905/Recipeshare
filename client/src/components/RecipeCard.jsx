import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, User, Star } from 'lucide-react';
import RatingStars from './RatingStars';

const RecipeCard = ({ recipe, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryClass = (category) => {
    const categoryLower = category.toLowerCase();
    return `category-chip ${categoryLower}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="recipe-card card overflow-hidden group"
    >
      <Link to={`/recipe/${recipe.id}`}>
        <div className="relative h-48 overflow-hidden">
          {!imageError ? (
            <>
              <div 
                className={`absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse ${imageLoaded ? 'hidden' : ''}`}
              />
              <img
                src={recipe.photoUrl || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg'}
                alt={recipe.title}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'fade-in-image loaded' : 'fade-in-image'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(true);
                }}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <div className="text-center text-primary-600">
                <ChefHat className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Recipe Image</p>
              </div>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {recipe.categories.slice(0, 2).map((category, idx) => (
              <span
                key={idx}
                className={getCategoryClass(category)}
              >
                {category}
              </span>
            ))}
            {recipe.categories.length > 2 && (
              <span className="category-chip bg-gray-100 text-gray-600">
                +{recipe.categories.length - 2} more
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {recipe.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{recipe.author?.name || 'Anonymous Chef'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{formatDate(recipe.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <RatingStars rating={recipe.avgRating} readonly size="sm" />
            <span className="text-sm text-gray-500">
              {recipe.avgRating > 0 ? recipe.avgRating.toFixed(1) : 'New'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;