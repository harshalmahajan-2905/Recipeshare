import express from 'express';
import Joi from 'joi';
import { Recipe } from '../models/Recipe.js';
import { Comment } from '../models/Comment.js';
import { Favorite } from '../models/Favorite.js';
import { auth, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

const router = express.Router();

const createRecipeSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  ingredients: Joi.array().items(Joi.string().min(1)).min(1).required(),
  instructions: Joi.array().items(Joi.string().min(1)).min(1).required(),
  categories: Joi.array().items(Joi.string().valid('Dessert', 'Dinner', 'Vegan', 'Breakfast', 'Snack')).min(1).required()
});

// Coerce multipart string fields (JSON) into arrays before validation
function coerceArraysFromBody(body) {
  const result = { ...body };
  const fields = ['ingredients', 'instructions', 'categories'];
  for (const f of fields) {
    const v = result[f];
    if (typeof v === 'string') {
      try {
        const parsed = JSON.parse(v);
        result[f] = Array.isArray(parsed) ? parsed : [];
      } catch {
        result[f] = [];
      }
    }
  }
  return result;
}

const ratingSchema = Joi.object({
  value: Joi.number().integer().min(1).max(5).required()
});

// Get all recipes with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, q, sort } = req.query;
    const filters = {};
    if (category) filters.categories = { $in: category.split(',') };
    if (q) filters.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];

    const sortSpec = sort === 'rating' ? { avgRating: -1 } : { createdAt: -1 };
    const recipes = await Recipe.find(filters).sort(sortSpec).exec();

    const recipeCards = recipes.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      photoUrl: r.photoUrl,
      avgRating: r.avgRating,
      categories: r.categories,
      author: r.author,
      createdAt: r.createdAt
    }));
    res.json(recipeCards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single recipe
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).exec();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const commentsCount = await Comment.countDocuments({ recipe: recipe._id });

    let userHasFavorited = false;
    let userRating = 0;
    if (req.user) {
      const favorite = await Favorite.findOne({ user: req.user._id, recipe: recipe._id }).exec();
      userHasFavorited = !!favorite;
      userRating = recipe.getUserRating(req.user._id);
    }

    res.json({
      ...recipe.toJSON(),
      commentsCount,
      userHasFavorited,
      userRating
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create recipe
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const coerced = coerceArraysFromBody(req.body);
    const { error, value } = createRecipeSchema.validate(coerced);
    if (error) return res.status(400).json({ message: 'Validation error', details: error.details[0].message });

    const ingredients = value.ingredients;
    const instructions = value.instructions;
    const categories = value.categories;

    let photoUrl = '';
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploaded = await cloudinary.uploader.upload(base64, { folder: 'recipeshare' });
      photoUrl = uploaded.secure_url;
    }

    const recipe = await Recipe.create({
      author: req.user.toJSON(),
      title: value.title,
      description: value.description,
      ingredients,
      instructions,
      categories,
      photoUrl
    });

    res.status(201).json(recipe.toJSON());
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update recipe
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).exec();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.author.id !== req.user.id) return res.status(403).json({ message: 'Not authorized to update this recipe' });

    const coerced = coerceArraysFromBody(req.body);
    const { error, value } = createRecipeSchema.validate(coerced);
    if (error) return res.status(400).json({ message: 'Validation error', details: error.details[0].message });

    const ingredients = value.ingredients;
    const instructions = value.instructions;
    const categories = value.categories;

    const updateData = { title: value.title, description: value.description, ingredients, instructions, categories };
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploaded = await cloudinary.uploader.upload(base64, { folder: 'recipeshare' });
      updateData.photoUrl = uploaded.secure_url;
    }

    const updated = await Recipe.findByIdAndUpdate(req.params.id, updateData, { new: true }).exec();
    res.json(updated.toJSON());
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).exec();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.author.id !== req.user.id) return res.status(403).json({ message: 'Not authorized to delete this recipe' });

    await Comment.deleteMany({ recipe: recipe._id }).exec();
    await Favorite.deleteMany({ recipe: recipe._id }).exec();
    await Recipe.findByIdAndDelete(req.params.id).exec();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate recipe
router.post('/:id/ratings', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).exec();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const { error, value } = ratingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', details: error.details[0].message });

    recipe.addOrUpdateRating(req.user._id, value.value);
    await recipe.save();
    res.json({ message: 'Rating added successfully', avgRating: recipe.avgRating, userRating: value.value });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle favorite
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).exec();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const existing = await Favorite.findOne({ user: req.user._id, recipe: recipe._id }).exec();
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id }).exec();
      return res.json({ favorited: false, message: 'Recipe removed from favorites' });
    }
    await Favorite.create({ user: req.user._id, recipe: recipe._id });
    res.json({ favorited: true, message: 'Recipe added to favorites' });
  } catch (error) {
    if (error.code === 11000) return res.json({ favorited: true, message: 'Recipe already favorited' });
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;