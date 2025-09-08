import React from 'react';
import { motion } from 'framer-motion';
import { User, MessageCircle } from 'lucide-react';

const CommentList = ({ comments, loading }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        return 'Just now';
      }
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!comments.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex space-x-3"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900">
                {comment.author?.name || 'Anonymous'}
              </h4>
              <span className="text-sm text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{comment.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CommentList;