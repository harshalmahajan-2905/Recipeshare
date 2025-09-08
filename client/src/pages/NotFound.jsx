import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center py-12"
    >
      <div className="max-w-md mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative mb-8"
        >
          <div className="inline-block p-8 bg-gradient-primary rounded-full">
            <ChefHat className="h-16 w-16 text-white" />
          </div>
          <motion.div
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center"
          >
            <span className="text-2xl">?</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Oops! The recipe you're looking for seems to have been eaten. 
            Don't worry, we have plenty more delicious options for you!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="flex items-center space-x-2 btn-primary"
              >
                <Home className="h-5 w-5" />
                <span>Go Home</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="flex items-center space-x-2 btn-outline"
              >
                <Search className="h-5 w-5" />
                <span>Browse Recipes</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-white rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Popular Categories
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Breakfast', 'Dinner', 'Dessert', 'Vegan', 'Snack'].map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Link
                    to={`/?category=${category}`}
                    className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                  >
                    {category}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;