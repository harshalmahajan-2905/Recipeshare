import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, User, Heart, PlusCircle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-primary rounded-xl"
            >
              <ChefHat className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              RecipeShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/create"
                    className="flex items-center space-x-2 btn-primary"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Create Recipe</span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/favorites"
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Favorites</span>
                  </Link>
                </motion.div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="btn-outline">
                    Login
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="btn-primary">
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="p-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4 border-t border-gray-100">
            {user ? (
              <>
                <div className="flex items-center space-x-2 px-4 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                </div>
                
                <Link
                  to="/create"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Create Recipe</span>
                </Link>
                
                <Link
                  to="/favorites"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>Favorites</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;