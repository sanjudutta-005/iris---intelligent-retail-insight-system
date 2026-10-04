import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client if API key is provided
let aiClient = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log('[IRIS Server] Google GenAI client initialized successfully.');
  } catch (err) {
    console.warn('[IRIS Server] Failed to initialize GoogleGenAI client:', err.message);
  }
} else {
  console.log('[IRIS Server] No GEMINI_API_KEY found in environment. Using in-store fallback engine.');
}

// Health check endpoint for Cloud Run, Docker, Kubernetes, etc.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'IRIS — Intelligent Retail Insight System',
    timestamp: new Date().toISOString(),
    geminiEnabled: Boolean(aiClient)
  });
});

// AI Store Assistant API
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  const query = message.trim();

  // If Gemini API is available, query Gemini model
  if (aiClient) {
    try {
      const systemInstruction = `You are IRIS, the AI-powered Intelligent Retail Insight System inside a flagship hypermarket store.
Store Inventory & Layout Context:
- Aisle 1-2: Rice, Atta (Tata Sampann, Aashirvaad), Whole Spices, Pulses, Cooking Oils.
- Aisle 3-4: Instant Noodles (Maggi 6-pack ₹78, 12-pack ₹145 - 18% OFF), Pasta, Lay's Chips, Biscuits, Snack bars.
- Aisle 5-6: Cold Beverages, Carbonated sodas, Tea (Tata Tea Gold), Coffee (Nescafe), Real Juices.
- Aisle 7-8: Oral Care (Colgate MaxFresh 150g ₹115 - 20% OFF on Shelf B Eye Level Bin 12; Colgate Strong Teeth 200g ₹92; Total 12 ₹160), Soaps, Shampoos (Dove 800ml ₹485 - 25% OFF), Skin care.
- Aisle 9-10: Detergents (Surf Excel Matic 2L ₹389 - 35% OFF), Dishwash, Floor Cleaners (Lizol).
- Aisle 11-12: Baby diapers (Pampers Medium 64s ₹849 - 15% OFF), Baby care, Wellness & Vitamins.
- Dairy Chiller Vault 1: Amul Pasteurised Butter 500g (₹275), Amul Pure Ghee 1L Tin (₹575, ₹65 FLAT OFF), Epigamia Greek Yogurt (₹160).
- Front Zone: 4 Express checkouts (<10 items), 6 Self-checkout kiosks (A-F), Lanes 5-10 for regular/trolley billing.
- User Cart: #BC-882 stationed near Aisle 4.

Answer the shopper directly, politely, and concisely in 1 to 3 sentences. State exact aisle, shelf/bay, current price or deal, and approximate walking distance.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemInstruction}\n\nShopper Query: "${query}"`
      });

      const replyText = response.text || '';
      return res.json({
        reply: replyText.trim(),
        source: 'gemini'
      });
    } catch (err) {
      console.warn('[IRIS Server] Gemini call error, falling back to local store matcher:', err.message);
    }
  }

  // Fallback intelligent retail matching
  const lower = query.toLowerCase();
  let reply = '';
  let targetProductId;

  if (lower.includes('colgate') || lower.includes('toothpaste') || lower.includes('brush')) {
    reply = 'Colgate MaxFresh Peppermint 150g is in Aisle 7, Shelf B (Eye Level, Bin 12). Today it has a 20% discount (₹115 instead of ₹145). Walking distance from your cart is ~45 meters.';
    targetProductId = 'prod-colgate-maxfresh';
  } else if (lower.includes('butter') || lower.includes('amul') || lower.includes('ghee')) {
    reply = 'Amul Pasteurised Butter 500g is at Dairy Chiller Vault 1, Shelf 1 (₹275). Amul Pure Ghee 1L Tin is right next to you at Aisle 4, Bay 2 (₹575, ₹65 FLAT OFF today!).';
    targetProductId = 'prod-amul-ghee';
  } else if (lower.includes('rice') || lower.includes('basmati')) {
    reply = 'India Gate Basmati Rice Classic 1kg is in Aisle 1, Shelf C, Bin 03 at ₹195 (Unit rate ₹19.50/100g). For maximum savings, the 5kg bag is ₹890 (₹17.80/100g).';
    targetProductId = 'prod-india-gate-rice';
  } else if (lower.includes('maggi') || lower.includes('noodle')) {
    reply = 'Maggi 2-Minute Masala Noodles 6-Pack is in Aisle 3, Shelf A at ₹78 (₹13/pack). The 12-Pack family saver is ₹145 (18% OFF).';
    targetProductId = 'prod-maggi-masala';
  } else if (lower.includes('offer') || lower.includes('deal') || lower.includes('discount')) {
    reply = 'Today we have 42 active Electronic Shelf Deals! Top picks: Surf Excel 2L Liquid (35% OFF in Aisle 9), Colgate MaxFresh (20% OFF in Aisle 7), and Maggi 12-pack (18% OFF in Aisle 3).';
  } else if (lower.includes('baby') || lower.includes('diaper')) {
    reply = 'Baby diapers and care items are in Aisle 11-12, Shelf B. Pampers All Round Protection (Medium 64s) has 15% OFF at ₹849.';
    targetProductId = 'prod-pampers-diapers';
  } else if (lower.includes('checkout') || lower.includes('pay') || lower.includes('counter')) {
    reply = 'Self-checkout kiosks (A–F) and Express Checkouts 1–4 (<10 items) are directly ahead at the front exit corridor with no waiting queue.';
  } else {
    reply = 'I found matching items in our store inventory. I can plot a turn-by-turn walking route from your current cart (#BC-882 at Aisle 4) or flash the physical shelf LED tag!';
  }

  return res.json({
    reply,
    targetProductId,
    source: 'in-store-engine'
  });
});

// Serve compiled static assets from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for React Router SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[IRIS Server] Running in production at http://0.0.0.0:${PORT}`);
});
