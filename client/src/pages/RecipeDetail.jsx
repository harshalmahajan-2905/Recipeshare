import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Edit, 
  Trash2, 
  User, 
  Clock, 
  ChefHat,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import TabbedPanel from '../components/TabbedPanel';
import RatingStars from '../components/RatingStars';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import toast from 'react-hot-toast';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetchRecipe();
    fetchComments();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getRecipe(id);
      setRecipe(data);
    } catch (error) {
      toast.error('Recipe not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const data = await recipeService.getComments(id);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleRating = async (rating) => {
    if (!user) {
      toast.error('Please login to rate recipes');
      return;
    }

    try {
      await recipeService.rateRecipe(id, rating);
      setRecipe(prev => ({
        ...prev,
        userRating: rating,
        avgRating: (prev.avgRating * prev.ratings.length + rating) / (prev.ratings.length + 1)
      }));
      toast.success('Rating submitted!');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to favorite recipes');
      return;
    }

    try {
      const response = await recipeService.toggleFavorite(id);
      setRecipe(prev => ({
        ...prev,
        userHasFavorited: response.favorited
      }));
      toast.success(response.message);
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await recipeService.deleteRecipe(id);
      toast.success('Recipe deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
  };

  const handleCommentSubmit = async (commentText) => {
    setSubmittingComment(true);
    try {
      const newComment = await recipeService.addComment(id, commentText);
      setComments(prev => [newComment, ...prev]);
      setRecipe(prev => ({
        ...prev,
        commentsCount: prev.commentsCount + 1
      }));
    } catch (error) {
      throw error;
    } finally {
      setSubmittingComment(false);
    }
  };

  const getCategoryClass = (category) => {
    const categoryLower = category.toLowerCase();
    return `category-chip ${categoryLower}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  const isOwner = user && user.id === recipe.author?.id;

  const tabs = [
    {
      label: `Ingredients (${recipe.ingredients.length})`,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll need</h3>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium mt-1">
                  {index + 1}
                </div>
                <span className="text-gray-700 leading-relaxed">{ingredient}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )
    },
    {
      label: `Instructions (${recipe.instructions.length} steps)`,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Let's cook!</h3>
          <div className="space-y-6">
            {recipe.instructions.map((instruction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex space-x-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed">{instruction}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to recipes</span>
        </motion.button>

        {/* Recipe Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Recipe Image */}
          <div className="relative h-96">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}
            <img
              src={recipe.photoUrl || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg'}
              alt={recipe.title}
              className={`w-full h-full object-cover ${imageLoaded ? 'fade-in-image loaded' : 'fade-in-image'}`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              {user && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFavorite}
                  className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
                    recipe.userHasFavorited
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${recipe.userHasFavorited ? 'fill-current' : ''}`} />
                </motion.button>
              )}
              
              {isOwner && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(`/edit/${recipe.id}`)}
                    className="p-3 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-blue-600 rounded-full transition-colors"
                  >
                    <Edit className="h-6 w-6" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="p-3 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-600 rounded-full transition-colors"
                  >
                    <Trash2 className="h-6 w-6" />
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* Recipe Info */}
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.categories.map((category, index) => (
                <span
                  key={index}
                  className={getCategoryClass(category)}
                >
                  {category}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {recipe.title}
            </h1>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {recipe.description}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 border-t pt-6">
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{recipe.author?.name || 'Anonymous Chef'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatDate(recipe.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>{recipe.commentsCount} comments</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <RatingStars
                  rating={recipe.userRating || 0}
                  onRatingChange={user ? handleRating : undefined}
                  readonly={!user}
                  size="lg"
                />
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {recipe.avgRating > 0 ? recipe.avgRating.toFixed(1) : 'New'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {recipe.ratings?.length > 0 ? `${recipe.ratings.length} rating${recipe.ratings.length !== 1 ? 's' : ''}` : 'No ratings yet'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recipe Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <TabbedPanel tabs={tabs} />
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="h-6 w-6 text-gray-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              Comments ({recipe.commentsCount})
            </h3>
          </div>

          {user ? (
            <div className="mb-8">
              <CommentForm 
                onSubmit={handleCommentSubmit}
                loading={submittingComment}
              />
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600 mb-4">Want to share your thoughts?</p>
              <Link to="/login" className="btn-primary">
                Login to Comment
              </Link>
            </div>
          )}

          <CommentList 
            comments={comments} 
            loading={commentsLoading} 
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RecipeDetail;