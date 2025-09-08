import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true, versionKey: false });

userSchema.method('toJSON', function() {
  const obj = this.toObject({ virtuals: true });
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.passwordHash;
  return obj;
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).exec();
};

// Compatibility helpers matching previous API
userSchema.statics.createUser = function({ name, email, passwordHash }) {
  const user = new this({ name, email, passwordHash });
  return user.save();
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);