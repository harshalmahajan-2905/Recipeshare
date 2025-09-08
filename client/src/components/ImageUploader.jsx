import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ onImageChange, currentImage, className = '' }) => {
  const [preview, setPreview] = useState(currentImage || '');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();

  const handleImageChange = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageChange(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const clearImage = () => {
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageChange) {
      onImageChange(null);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Recipe Photo
      </label>
      
      {preview ? (
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={preview}
              alt="Recipe preview"
              className="w-full h-64 object-cover"
            />
            <motion.button
              type="button"
              onClick={clearImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <motion.div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.02 }}
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">
              Drag and drop your recipe photo here
            </p>
            <p className="text-sm text-gray-500">
              or click to browse files
            </p>
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Choose File</span>
            </motion.button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Supports: JPG, PNG, GIF (Max 5MB)
          </p>
        </motion.div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;