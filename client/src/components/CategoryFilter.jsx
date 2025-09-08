import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ selectedCategories, onCategoryChange }) => {
  const categories = [
    { name: 'All', value: '' },
    { name: 'Breakfast', value: 'Breakfast' },
    { name: 'Dinner', value: 'Dinner' },
    { name: 'Dessert', value: 'Dessert' },
    { name: 'Vegan', value: 'Vegan' },
    { name: 'Snack', value: 'Snack' }
  ];

  const getCategoryClass = (category) => {
    const isSelected = selectedCategories.includes(category.value) || 
                     (category.value === '' && selectedCategories.length === 0);
    
    return `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isSelected
        ? 'bg-primary-600 text-white shadow-lg'
        : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
    }`;
  };

  const handleCategoryClick = (category) => {
    if (category.value === '') {
      onCategoryChange([]);
    } else {
      const isSelected = selectedCategories.includes(category.value);
      if (isSelected) {
        onCategoryChange(selectedCategories.filter(cat => cat !== category.value));
      } else {
        onCategoryChange([...selectedCategories, category.value]);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category, index) => (
        <motion.button
          key={category.value || 'all'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCategoryClick(category)}
          className={getCategoryClass(category)}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;