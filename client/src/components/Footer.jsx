import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Heart, Users, BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-xl">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">RecipeShare</span>
            </div>
            <p className="text-gray-400 text-sm">
              Share, discover, and save amazing recipes from home cooks around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-400 hover:text-white transition-colors">
                  Create Recipe
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-white transition-colors">
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=Breakfast" className="text-gray-400 hover:text-white transition-colors">
                  Breakfast
                </Link>
              </li>
              <li>
                <Link to="/?category=Dinner" className="text-gray-400 hover:text-white transition-colors">
                  Dinner
                </Link>
              </li>
              <li>
                <Link to="/?category=Dessert" className="text-gray-400 hover:text-white transition-colors">
                  Dessert
                </Link>
              </li>
              <li>
                <Link to="/?category=Vegan" className="text-gray-400 hover:text-white transition-colors">
                  Vegan
                </Link>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Community</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <BookOpen className="h-5 w-5" />
                <span>Thousands of recipes</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="h-5 w-5" />
                <span>Growing community</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Heart className="h-5 w-5" />
                <span>Made with love</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 RecipeShare. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;