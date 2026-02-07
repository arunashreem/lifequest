
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const COOLDOWN_KEY = 'lifequest_api_cooldown';

const getCooldownUntil = () => {
  const val = sessionStorage.getItem(COOLDOWN_KEY);
  return val ? parseInt(val) : 0;
};

const setQuotaCooldown = (seconds: number = 60) => {
  const until = Date.now() + (seconds * 1000);
  sessionStorage.setItem(COOLDOWN_KEY, until.toString());
};

const checkQuotaCooldown = () => {
  if (Date.now() < getCooldownUntil()) return true;
  return false;
};

// Utility to extract JSON from a string that might contain markdown or conversational filler
const extractJSON = (text: string) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonStr = text.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(jsonStr);
      } catch (e2) {
        console.error("Failed to parse extracted JSON block", e2);
      }
    }
    return null;
  }
};

// Utility for safe API calling with exponential backoff and global circuit breaker
const safeGenerateContent = async (callFn: () => Promise<any>, retries = 2): Promise<any> => {
  if (checkQuotaCooldown()) {
    return { error: 'QUOTA_REACHED', cooldown: true };
  }

  try {
    return await callFn();
  } catch (error: any) {
    const errorStr = JSON.stringify(error).toUpperCase();
    
    const isQuotaError = 
      errorStr.includes('429') || 
      errorStr.includes('RESOURCE_EXHAUSTED') || 
      errorStr.includes('QUOTA') ||
      error.status === 429;
    
    if (isQuotaError) {
      if (retries > 0) {
        const delay = (3 - retries) * 3000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return safeGenerateContent(callFn, retries - 1);
      }
      
      console.warn("Gemini Quota Exceeded. Activating Link Cooldown.");
      setQuotaCooldown(60);
      return { error: 'QUOTA_REACHED' };
    }
    
    console.error("Gemini API Error:", error);
    return null;
  }
};

// Tool Definitions
const addBossRaidTool: FunctionDeclaration = {
  name: 'add_boss_raid',
  parameters: {
    type: Type.OBJECT,
    description: 'Adds a major academic or life boss raid (deadline) to the users planner.',
    properties: {
      title: { type: Type.STRING, description: 'The name of the boss raid/assignment.' },
      dueDate: { type: Type.STRING, description: 'The deadline date in YYYY-MM-DD format.' }
    },
    required: ['title', 'dueDate']
  }
};

const addQuestTool: FunctionDeclaration = {
  name: 'add_quest',
  parameters: {
    type: Type.OBJECT,
    description: 'Adds a standard quest (task) to the users battlegrounds.',
    properties: {
      title: { type: Type.STRING, description: 'The name of the quest.' },
      category: { type: Type.STRING, description: 'The type of quest. Valid: Fitness, Study, School, Homework, Chores, Health, Social, Mindfulness, Reading' },
      difficulty: { type: Type.STRING, description: 'Challenge level. Valid: Easy, Medium, Hard, Epic' }
    },
    required: ['title', 'category', 'difficulty']
  }
};

const updateQuestTool: FunctionDeclaration = {
  name: 'update_quest',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates an existing quest/task in the quest log.',
    properties: {
      id: { type: Type.STRING, description: 'The unique ID of the quest to update.' },
      updates: {
        type: Type.OBJECT,
        description: 'The fields to update.',
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          completed: { type: Type.BOOLEAN }
        }
      }
    },
    required: ['id', 'updates']
  }
};

const updateHydrationTool: FunctionDeclaration = {
  name: 'update_hydration',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates the users water intake for the day.',
    properties: {
      amount_ml: { type: Type.NUMBER, description: 'The amount in milliliters to add (positive) or subtract (negative).' }
    },
    required: ['amount_ml']
  }
};

const deleteQuestTool: FunctionDeclaration = {
  name: 'delete_quest',
  parameters: {
    type: Type.OBJECT,
    description: 'Deletes a quest from the quest log.',
    properties: {
      id: { type: Type.STRING, description: 'The unique ID of the quest to remove.' }
    },
    required: ['id']
  }
};

export const getMapsInfo = async (query: string) => {
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: query,
    config: {
      tools: [{ googleMaps: {} }],
    },
  }));

  if (result?.error === 'QUOTA_REACHED') return { text: "Orbital sensors depleted. Neural link in cooldown.", grounding: [] };
  
  return {
    text: result?.text || "The Map is clouded.",
    grounding: result?.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

/**
 * Generates an RPG-style title for a conversation based on the first message
 */
export const generateChatTitle = async (firstMessage: string) => {
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a short (2-4 word) RPG-style title for a chat starting with: "${firstMessage}". 
    Examples: 'The Hydration Protocol', 'Academic Siege Strategy', 'Fitness Ascension'. 
    Return ONLY the title string.`,
  }));
  return result?.text?.trim().replace(/^"|"$/g, '') || "New Dialogue";
};

export const chatWithOracle = async (
  history: { role: 'user' | 'model', parts: { text?: string, inlineData?: { mimeType: string, data: string } }[] }[], 
  stats: any,
  tasks: any[],
  habits: any[]
) => {
  const activeQuests = tasks.filter(t => !t.completed).map(t => `- ${t.title} (ID: ${t.id}, ${t.category}, ${t.difficulty})`).join('\n');
  const completedToday = tasks.filter(t => t.completed).length;
  
  const attr = stats.attributes;
  const attributesSummary = `Str: ${attr.strength}, Int: ${attr.intelligence}, Wis: ${attr.wisdom}, Vit: ${attr.vitality}, Cha: ${attr.charisma}`;

  const formattedContents = history.map(h => ({
    role: h.role,
    parts: h.parts.map(p => {
      const part: any = {};
      if (p.text) part.text = p.text;
      if (p.inlineData) part.inlineData = p.inlineData;
      return part;
    })
  }));

  const result = await safeGenerateContent(async () => {
    return await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: formattedContents,
      config: {
        tools: [{ 
          functionDeclarations: [addBossRaidTool, addQuestTool, updateQuestTool, deleteQuestTool, updateHydrationTool] 
        }],
        systemInstruction: `You are the "Oracle of Destiny", the central intelligence for this life-planning RPG. 
        
        Direct State Authority:
        - If they mention drinking water, use 'update_hydration'.
        - If they mention a test or major deadline, use 'add_boss_raid'.
        - If they want to track a specific activity, use 'add_quest'.
        - If they finish something, use 'update_quest' to mark it complete.
        
        Context:
        - Rank: Level ${stats.level} Hero
        - Water: ${stats.dailyWater}ml / 2000ml goal.
        - Attributes: ${attributesSummary}
        - Momentum: ${completedToday} cleared today.
        
        Current Objectives:
        ${activeQuests || 'No active quests.'}
        
        Response Style: Epic, integrated, and cyber-fantasy. Reference stats and their journey frequently.`,
      }
    });
  });

  if (result?.error === 'QUOTA_REACHED') {
    return { text: "The Neural Link has overheated. Retreat for a moment, Traveler. (Cooldown Active)", grounding: [] };
  }
  
  return {
    text: result?.text || "Directives received.",
    functionCalls: result?.functionCalls,
    grounding: result?.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: "Transcribe the following audio precisely." },
        { inlineData: { mimeType, data: base64Audio } }
      ]
    },
  }));
  if (result?.error === 'QUOTA_REACHED') return "Link busy. Try again soon.";
  return result?.text || "Transcription failed.";
};

export const editImageWithPrompt = async (base64Image: string, mimeType: string, prompt: string) => {
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: mimeType } },
        { text: prompt },
      ]
    },
  }));

  if (result?.candidates?.[0]?.content?.parts) {
    for (const part of result.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};

export const generateDailyQuests = async (currentStats: any, category?: string) => {
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 3 RPG quests. Level: ${currentStats.level}. Cat: ${category || 'General'}. Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            difficulty: { type: Type.STRING, description: 'Easy, Medium, Hard, or Epic' },
            category: { type: Type.STRING, description: 'School, Homework, Fitness, Study, Chores, or Mindfulness' }
          },
          required: ['title', 'description', 'difficulty', 'category']
        }
      }
    }
  }));
  if (result?.error === 'QUOTA_REACHED') return null;
  try { return extractJSON(result.text); } catch (e) { return []; }
};

export const evaluateGrindSession = async (grindInput: string) => {
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Judge effort (50-400 XP) for: "${grindInput}". Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          xp: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          rank: { type: Type.STRING }
        },
        required: ['xp', 'feedback', 'rank']
      }
    }
  }));
  if (result?.error === 'QUOTA_REACHED') return { xp: 50, feedback: "Neural Link Busy. Baseline XP awarded.", rank: "Bronze" };
  try { return extractJSON(result.text); } catch (e) { return { xp: 50, feedback: "Effort recorded.", rank: "Bronze" }; }
};

export const analyzePosture = async (base64Image: string) => {
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: "Analyze posture. Score /10. Return JSON." },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          advice: { type: Type.STRING },
          rank: { type: Type.STRING }
        },
        required: ['score', 'feedback', 'advice', 'rank']
      }
    }
  }));
  if (result?.error === 'QUOTA_REACHED') return { score: 5, feedback: "Link Busy.", advice: "Try again later.", rank: "Unknown" };
  try { return extractJSON(result.text); } catch (e) { return { score: 5, feedback: "Form detected.", advice: "Sit straight.", rank: "Aware" }; }
};

export const evaluateBookCompletion = async (bookTitle: string, bookAuthor: string, isOverLimit: boolean) => {
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Evaluate difficulty for ${bookTitle}. Assign XP/Gold. Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          xp: { type: Type.NUMBER },
          gold: { type: Type.NUMBER },
          difficulty: { type: Type.STRING },
          feedback: { type: Type.STRING }
        },
        required: ['xp', 'gold', 'difficulty', 'feedback']
      }
    }
  }));
  if (result?.error === 'QUOTA_REACHED') return { xp: 100, gold: 50, difficulty: 'Medium', feedback: "Oracle busy. Standard lore recorded." };
  try { return extractJSON(result.text); } catch (e) { return { xp: 200, gold: 100, difficulty: 'Medium', feedback: "Lore absorbed." }; }
};

export const evaluateLoreCompletion = async (loreTitle: string, loreUrl: string) => {
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Evaluate study resource difficulty (Easy, Medium, Hard, Epic) for: "${loreTitle}" at ${loreUrl}. Assign XP (50-300). Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          xp: { type: Type.NUMBER },
          difficulty: { type: Type.STRING },
          feedback: { type: Type.STRING }
        },
        required: ['xp', 'difficulty', 'feedback']
      }
    }
  }));
  if (result?.error === 'QUOTA_REACHED') return { xp: 50, difficulty: 'Medium', feedback: "Link busy. Progress logged." };
  try { return extractJSON(result.text); } catch (e) { return { xp: 150, difficulty: 'Medium', feedback: "Lore mastered." }; }
};

export const getAIAdvice = async (tasks: any[]) => {
  if (checkQuotaCooldown()) return "Neural link recalibrating. Focus on your active objectives.";
  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Quest log: ${tasks.length} items. Give 2-sentence advice.`,
  }));
  return result?.text || "Maintain your momentum.";
};

const WEATHER_CACHE_KEY = 'lifequest_weather_v2';
const CACHE_TTL = 30 * 60 * 1000; 

export const getWeatherForecast = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }
  }

  // Persist check inside tool calling function
  if (checkQuotaCooldown()) return { error: 'QUOTA_REACHED' };

  const result = await safeGenerateContent(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Search current Sydney weather. Return ONLY a valid JSON object. IMPORTANT: Temperature fields (temp_current, feels_like, temp_min, temp_max) MUST be strings containing ONLY the whole number (e.g. '22'). Do NOT include units, signs, or descriptive text in those fields. summary should be a short 3-word status. icon_type must be one of: sun, cloud, rain, storm.",
    config: {
      tools: [{googleSearch: {}}],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          temp_current: { type: Type.STRING },
          feels_like: { type: Type.STRING },
          temp_min: { type: Type.STRING },
          temp_max: { type: Type.STRING },
          rain_range: { type: Type.STRING },
          summary: { type: Type.STRING },
          icon_type: { type: Type.STRING },
          hourly: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                temp: { type: Type.STRING },
                icon: { type: Type.STRING }
              }
            }
          }
        }
      }
    },
  }));

  if (result?.error === 'QUOTA_REACHED') {
    return { error: 'QUOTA_REACHED' };
  }

  if (result?.text) {
    try {
      const weatherData = extractJSON(result.text);
      if (!weatherData) return null;
      
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        weatherData.grounding_urls = chunks.map((c: any) => c.web?.uri).filter(Boolean);
      }
      localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: weatherData
      }));
      return weatherData;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const isApiCooldownActive = checkQuotaCooldown;
