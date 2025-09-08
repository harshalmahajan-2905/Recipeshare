import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  author: { type: Object, required: true }, // denormalized author snapshot
  text: { type: String, required: true, maxlength: 500 },
}, { timestamps: true, versionKey: false });

commentSchema.method('toJSON', function() {
  const obj = this.toObject({ virtuals: true });
  obj.id = obj._id.toString();
  delete obj._id;
  return obj;
});

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);