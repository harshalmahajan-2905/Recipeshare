import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true },
}, { timestamps: true, versionKey: false });

favoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

favoriteSchema.method('toJSON', function() {
  const obj = this.toObject({ virtuals: true });
  obj.id = obj._id.toString();
  delete obj._id;
  return obj;
});

export const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);