import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, min: 1, max: 5, required: true }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  author: { type: Object, required: true }, // denormalized author snapshot
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  photoUrl: { type: String, default: '' },
  categories: { type: [String], default: [] },
  ratings: { type: [ratingSchema], default: [] },
  avgRating: { type: Number, default: 0 }
}, { timestamps: true, versionKey: false });

recipeSchema.methods.addOrUpdateRating = function(userId, value) {
  const idx = this.ratings.findIndex(r => r.user.toString() === userId.toString());
  if (idx >= 0) {
    this.ratings[idx].value = value;
  } else {
    this.ratings.push({ user: userId, value });
  }
  this.updateAvgRating();
};

recipeSchema.methods.updateAvgRating = function() {
  if (this.ratings.length === 0) {
    this.avgRating = 0;
    return;
  }
  const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
  this.avgRating = Number((sum / this.ratings.length).toFixed(1));
};

recipeSchema.methods.getUserRating = function(userId) {
  const r = this.ratings.find(r => r.user.toString() === userId.toString());
  return r ? r.value : 0;
};

recipeSchema.method('toJSON', function() {
  const obj = this.toObject({ virtuals: true });
  obj.id = obj._id.toString();
  delete obj._id;
  return obj;
});

export const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);