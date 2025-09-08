import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChefHat } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import CategoryFilter from '../components/CategoryFilter';
import toast from 'react-hot-toast';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchRecipes();
  }, [selectedCategories, sortBy]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRecipes();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = {
        q: searchTerm,
        category: selectedCategories.join(','),
        sort: sortBy
      };
      
      const data = await recipeService.getRecipes(params);
      setRecipes(data);
    } catch (error) {
      toast.error('Failed to fetch recipes');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block p-4 bg-white/10 rounded-full backdrop-blur-sm"
            >
              <ChefHat className="h-16 w-16 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-shadow-sm">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                RecipeShare
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Discover, share, and save amazing recipes from home cooks around the world
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto"
              >
                <a
                  href="#recipes"
                  className="inline-block w-full sm:w-auto btn-primary bg-white text-primary-600 hover:bg-gray-100"
                >
                  Explore Recipes
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-8">
            {/* Category Filter */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
              <CategoryFilter 
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
              />
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input-field pl-10"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <label htmlFor="sortBy" className="sr-only">Sort by</label>
                <select
                  id="sortBy"
                  aria-label="Sort by"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="input-field pl-10 pr-8 appearance-none bg-white"
                >
                  <option value="latest">Latest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section id="recipes" className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
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
          ) : recipes.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Delicious Recipes
                </h2>
                <p className="text-gray-600">
                  Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                  {selectedCategories.length > 0 && ` in ${selectedCategories.join(', ')}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe, index) => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    index={index} 
                  />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <ChefHat className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600 mb-8">
                {searchTerm || selectedCategories.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to share a recipe!'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategories([]);
                }}
                className="btn-outline"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default Home;