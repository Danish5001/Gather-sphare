import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// AI Gathering & Monetization Concept Generator
app.post("/api/gemini/generate-gathering", async (req, res) => {
  const { city, category, vibe, targetAudience, priceRange } = req.body || {};

  const ai = getAi();
  if (!ai) {
    // Intelligent curated fallback if no API key is set
    const fallbackIdeas = [
      {
        title: "Sunset Rooftop Founders & Creators Supper",
        tagline: "8 curated minds, hand-crafted pasta, and candid revenue breakdowns.",
        category: "Dining & Supper Clubs",
        suggestedTicketPrice: 65,
        maxAttendees: 10,
        venueType: "Private Penthouse Terrace",
        vibe: "Intimate & Inspiring",
        agenda: [
          "6:30 PM: Welcome Aperitivo & Icebreaker pairing",
          "7:15 PM: Family-style Sicilian dinner",
          "8:15 PM: Round-robin mastermind: 1 challenge & 1 win",
          "9:00 PM: Digestifs & private group contact exchange",
        ],
        icebreakers: [
          "What is one contrarian belief you hold in your industry?",
          "What project currently excites you so much you lose track of time?",
          "If you could launch any wild community project next week, what would it be?",
        ],
        projectedGross: 650,
        platformTakeRate: 15,
        ownerCut: 97.5,
        hostNet: 552.5,
        monetizationTips: "High margins on curated dinners: partner with private chefs or BYOB venues for 70%+ host profit margins.",
      },
      {
        title: "Sunday Sunrise Urban Trail & Espresso Club",
        tagline: "Walk, talk, and build genuine friendships before the city wakes up.",
        category: "Outdoors & Active",
        suggestedTicketPrice: 18,
        maxAttendees: 20,
        venueType: "Scenic Ridge Trailhead & Specialty Coffee Bar",
        vibe: "Energizing & Welcoming",
        agenda: [
          "8:00 AM: Meet at trailhead, quick name & energy check-in",
          "8:15 AM: 4-mile guided scenic loop with rotating walking buddies",
          "9:45 AM: Reserved seating at local roastery with artisan pastries",
          "10:30 AM: Optional book/podcast swap & weekend plans chat",
        ],
        icebreakers: [
          "What has been the unexpected highlight of your week?",
          "What is your favorite low-key spot in the city that tourists miss?",
          "What habit are you experimenting with right now?",
        ],
        projectedGross: 360,
        platformTakeRate: 15,
        ownerCut: 54,
        hostNet: 306,
        monetizationTips: "Ultra low overhead: zero venue rent, high repeat booking rate with recurring VIP passes.",
      },
      {
        title: "Acoustic Wine & Ceramics: Hands-on Clay Workshop",
        tagline: "Craft your own ceramic coffee mug while listening to live acoustic indie tracks.",
        category: "Creative Workshops",
        suggestedTicketPrice: 55,
        maxAttendees: 12,
        venueType: "Sunlit Artisan Pottery Loft",
        vibe: "Creative Flow & Playful",
        agenda: [
          "5:00 PM: Natural wine tasting & clay prep basics",
          "5:30 PM: Pinch & coil mug sculpting masterclass",
          "6:45 PM: Glaze customization and personalized stamp initials",
          "7:30 PM: Kiln firing drop-off voucher & group photo",
        ],
        icebreakers: [
          "What was the last creative thing you made with your hands?",
          "If you had 3 free months with zero responsibilities, what would you learn?",
          "What song always resets your mood?",
        ],
        projectedGross: 660,
        platformTakeRate: 15,
        ownerCut: 99,
        hostNet: 561,
        monetizationTips: "Great for weekend afternoons. Add a VIP glazing kit upsell for extra $15/attendee.",
      },
    ];

    const randomPick = fallbackIdeas[Math.floor(Math.random() * fallbackIdeas.length)];
    return res.json({
      success: true,
      gathering: randomPick,
      source: "curated_template",
    });
  }

  try {
    const prompt = `Generate an innovative, highly appealing in-person group gathering concept that brings 6 to 20 people together and is optimized for high ticket sales and repeat community engagement.
Location/City: ${city || "Metropolitan City"}
Category: ${category || "General Social & Networking"}
Desired Vibe: ${vibe || "Warm, engaging, and meaningful"}
Target Audience: ${targetAudience || "Ambitious locals, creators, foodies, or hobbyists"}
Price Expectation: ${priceRange || "$25 - $75 per person"}

Provide your response in JSON format with the following keys:
- title: string (catchy, elegant)
- tagline: string (one sentence punchy hook)
- category: string
- suggestedTicketPrice: number (in USD)
- maxAttendees: number (between 8 and 25)
- venueType: string
- vibe: string
- agenda: string[] (3-5 timeline bullet points)
- icebreakers: string[] (3 deep, fun conversational icebreakers)
- projectedGross: number (suggestedTicketPrice * maxAttendees)
- platformTakeRate: number (15)
- ownerCut: number (projectedGross * 0.15)
- hostNet: number (projectedGross * 0.85)
- monetizationTips: string (strategic advice on how the host or platform makes maximum profit from this event)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    return res.json({
      success: true,
      gathering: data,
      source: "gemini",
    });
  } catch (error: any) {
    console.error("Gemini generation error:", error);
    return res.status(500).json({
      error: "Failed to generate gathering concept",
      message: error?.message,
    });
  }
});

// AI Icebreaker & Matchmaker Spark
app.post("/api/gemini/smart-sparks", async (req, res) => {
  const { eventTitle, attendeeCount, interests } = req.body || {};

  const ai = getAi();
  if (!ai) {
    return res.json({
      sparks: [
        "What is the most serendipitous connection you've made in the last year?",
        "If you were giving a 10-minute TED talk right now with no slides, what would you talk about?",
        "What's a micro-habit that genuinely changed your daily life?",
        "What's something you are quietly learning or working on behind the scenes?",
      ],
      tableGroupingAdvice: "Pair guests who share complementary skills (e.g., creative + technical, or founder + marketer) to generate instant conversational spark.",
    });
  }

  try {
    const prompt = `For an in-person event titled "${eventTitle || "Community Mixer"}" with ${attendeeCount || 10} attendees interested in ${interests || "general networking, food, and culture"}, generate 4 fun, thought-provoking icebreaker questions that avoid awkward small talk, plus 1 piece of advice for the host on seating or breakout arrangements to spark genuine bonds.

Format as JSON with keys:
- sparks: string[] (4 questions)
- tableGroupingAdvice: string`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error("Smart sparks error:", err);
    return res.status(500).json({ error: "Failed to generate sparks" });
  }
});

// Set up Vite or Static File Serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const cwdDist = path.join(process.cwd(), "dist");
    const dirDist = typeof __dirname !== "undefined" ? __dirname : cwdDist;
    const distPath = fs.existsSync(path.join(cwdDist, "index.html"))
      ? cwdDist
      : (fs.existsSync(path.join(dirDist, "index.html")) ? dirDist : cwdDist);

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gathering & Revenue Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
