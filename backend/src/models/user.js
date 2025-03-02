import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  nome: {
    type: String,
    required: true,
  },
  cargo: {
    type: String,
    required: true,
  },
  ativo: {
    type: Boolean,
    default: true,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
  collection: 'users'
});

export const User = mongoose.model('User', userSchema);