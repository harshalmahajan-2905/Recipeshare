import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import CreateEditRecipe from './pages/CreateEditRecipe';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <CreateEditRecipe />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit/:id" 
                element={
                  <ProtectedRoute>
                    <CreateEditRecipe isEdit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;