import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChefHat } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import toast from 'react-hot-toast';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getFavorites();
      setFavorites(data);
    } catch (error) {
      toast.error('Failed to fetch favorite recipes');
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-full">
              <Heart className="h-8 w-8 text-white fill-current" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">My Favorite Recipes</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Your collection of saved recipes
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && favorites.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p className="text-gray-600">
                You have {favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((recipe, index) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  index={index} 
                />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="relative inline-block">
              <ChefHat className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <Heart className="h-8 w-8 text-gray-300" />
              </motion.div>
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring recipes and click the heart icon to save your favorites here. 
              Build your personal collection of go-to recipes!
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Discover Recipes
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;