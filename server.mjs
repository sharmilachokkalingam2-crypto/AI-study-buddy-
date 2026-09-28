import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// Change this line to import the default object directly:
import { GoogleGenAI } from '@google/genai'; 


// Load variables from your .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize the Google Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Check MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connection: SUCCESSFUL!'))
  .catch((err) => console.error('❌ MongoDB Connection: FAILED!', err.message));

// 2. Check Gemini API Connection via a test route
app.get('/api/test-gemini', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say hello and confirm you are online!',
    });
    res.json({ status: 'Gemini API is active!', response: response.text });
  } catch (error) {
    res.status(500).json({ status: 'Gemini API FAILED!', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is listening at http://localhost:${PORT}`);
  console.log(`🔗 Test Gemini API by visiting: http://localhost:${PORT}/api/test-gemini`);
});
