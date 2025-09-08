import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';

const CreateEditRecipe = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    categories: [],
    photo: null
  });
  
  const [currentImage, setCurrentImage] = useState('');

  const categories = ['Breakfast', 'Dinner', 'Dessert', 'Vegan', 'Snack'];

  useEffect(() => {
    if (isEdit && id) {
      fetchRecipe();
    }
  }, [isEdit, id]);

  const fetchRecipe = async () => {
    try {
      setInitialLoading(true);
      const recipe = await recipeService.getRecipe(id);
      
      // Check if user owns this recipe
      if (recipe.author?.id !== user?.id) {
        toast.error('You can only edit your own recipes');
        navigate('/');
        return;
      }
      
      setFormData({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        categories: recipe.categories,
        photo: null
      });
      setCurrentImage(recipe.photoUrl);
    } catch (error) {
      toast.error('Recipe not found');
      navigate('/');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (index, value, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayItem = (index, arrayName) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
      }));
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(cat => cat !== category)
        : [...prev.categories, category]
    }));
  };

  const handleImageChange = (file) => {
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a recipe title');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please enter a recipe description');
      return;
    }
    
    if (formData.ingredients.some(ing => !ing.trim()) || formData.ingredients.length === 0) {
      toast.error('Please fill in all ingredients');
      return;
    }
    
    if (formData.instructions.some(inst => !inst.trim()) || formData.instructions.length === 0) {
      toast.error('Please fill in all instructions');
      return;
    }
    
    if (formData.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData object
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('ingredients', JSON.stringify(formData.ingredients.filter(ing => ing.trim())));
      submitData.append('instructions', JSON.stringify(formData.instructions.filter(inst => inst.trim())));
      submitData.append('categories', JSON.stringify(formData.categories));
      
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      let recipe;
      if (isEdit) {
        recipe = await recipeService.updateRecipe(id, submitData);
        toast.success('Recipe updated successfully!');
      } else {
        recipe = await recipeService.createRecipe(submitData);
        toast.success('Recipe created successfully!');
      }

      navigate(`/recipe/${recipe.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} recipe`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900">
            {isEdit ? 'Edit Recipe' : 'Create New Recipe'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update your recipe details' : 'Share your delicious creation with the community'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Grandma's Chocolate Chip Cookies"
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your recipe, what makes it special, and any tips..."
                    rows={4}
                    className="textarea-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                Categories *
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <motion.label
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer transition-colors ${
                      formData.categories.includes(category)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="hidden"
                    />
                    <span>{category}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                Recipe Photo
              </h2>
              <ImageUploader
                onImageChange={handleImageChange}
                currentImage={currentImage}
              />
            </div>

            {/* Ingredients */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                Ingredients *
              </h2>
              <div className="space-y-4">
                {formData.ingredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleArrayInputChange(index, e.target.value, 'ingredients')}
                      placeholder="e.g. 2 cups all-purpose flour"
                      className="input-field flex-1"
                      required
                    />
                    {formData.ingredients.length > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeArrayItem(index, 'ingredients')}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addArrayItem('ingredients')}
                  className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Ingredient</span>
                </motion.button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                Instructions *
              </h2>
              <div className="space-y-4">
                {formData.instructions.map((instruction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start space-x-3"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-2">
                      {index + 1}
                    </span>
                    <textarea
                      value={instruction}
                      onChange={(e) => handleArrayInputChange(index, e.target.value, 'instructions')}
                      placeholder="Describe this step in detail..."
                      rows={3}
                      className="textarea-field flex-1"
                      required
                    />
                    {formData.instructions.length > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeArrayItem(index, 'instructions')}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2"
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addArrayItem('instructions')}
                  className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Step</span>
                </motion.button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>{isEdit ? 'Update Recipe' : 'Create Recipe'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateEditRecipe;