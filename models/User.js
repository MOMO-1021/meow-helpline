import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    role: {
      type: String,
      enum: ['student', 'helper'],
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent redefining the model
export default mongoose.models.User || mongoose.model('User', UserSchema);
