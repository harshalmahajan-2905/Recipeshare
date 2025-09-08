import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CommentForm = ({ onSubmit, loading }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await onSubmit(comment.trim());
      setComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="relative">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this recipe..."
          rows={4}
          className="textarea-field pr-12"
          disabled={loading}
        />
        
        <motion.button
          type="submit"
          disabled={loading || !comment.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-3 right-3 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </motion.button>
      </div>
      
      <div className="text-sm text-gray-500">
        <span className={`${comment.length > 500 ? 'text-red-500' : ''}`}>
          {comment.length}/500 characters
        </span>
      </div>
    </motion.form>
  );
};

export default CommentForm;