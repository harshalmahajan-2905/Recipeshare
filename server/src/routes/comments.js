import express from 'express';
import Joi from 'joi';
import { Comment } from '../models/Comment.js';
import { Recipe } from '../models/Recipe.js';
import { auth } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

const commentSchema = Joi.object({
  text: Joi.string().min(1).max(500).required()
});

// Get comments for a recipe
router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const comments = await Comment.find({ recipe: recipeId }).sort({ createdAt: -1 }).exec();
    res.json(comments.map(c => c.toJSON()));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/recipe/:recipeId', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).exec();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const { error, value } = commentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', details: error.details[0].message });

    const comment = await Comment.create({
      recipe: recipe._id,
      author: req.user.toJSON(),
      text: value.text
    });
    res.status(201).json(comment.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;