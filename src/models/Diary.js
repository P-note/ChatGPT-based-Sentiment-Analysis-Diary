// src/models/Diary.js

import mongoose from 'mongoose';

const diarySchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  date:      { type: Date, default: Date.now },
  analysis:  { type: String }, // Choose to store or not
}, { timestamps: true });

const Diary = mongoose.models.Diary || mongoose.model('Diary', diarySchema);

export default Diary;
