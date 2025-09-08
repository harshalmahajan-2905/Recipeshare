import express from 'express';
import { Favorite } from '../models/Favorite.js';
import { Recipe } from '../models/Recipe.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user's favorite recipes
router.get('/me', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 }).exec();
    const recipeIds = favorites.map(f => f.recipe);
    const recipes = await Recipe.find({ _id: { $in: recipeIds } }).exec();
    const recipeMap = new Map(recipes.map(r => [r._id.toString(), r]));

    const favoriteRecipes = favorites.map(fav => {
      const recipe = recipeMap.get(fav.recipe.toString());
      return {
        id: recipe?.id,
        title: recipe?.title,
        description: recipe?.description,
        photoUrl: recipe?.photoUrl,
        avgRating: recipe?.avgRating,
        categories: recipe?.categories,
        author: recipe?.author,
        createdAt: recipe?.createdAt,
        favoritedAt: fav.createdAt
      };
    }).filter(Boolean);

    res.json(favoriteRecipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;