
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyQuests = async (currentStats: any, category?: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 3 RPG-style "quests" for a 13-year-old student's life planner. 
    User current level: ${currentStats.level}. 
    Focus on School, Homework, Fitness, and Habits. 
    Use epic language (e.g., "Slay the History Exam", "Alchemy Lab Homework", "Knightly Posture Practice").
    Focus Category: ${category || 'General'}.
    Return in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Creative RPG quest name' },
            description: { type: Type.STRING, description: 'Actionable real-life task' },
            difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard', 'Epic'] },
            category: { type: Type.STRING, enum: ['School', 'Homework', 'Fitness', 'Study', 'Chores', 'Mindfulness'] }
          },
          required: ['title', 'description', 'difficulty', 'category']
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};

export const evaluateGrindSession = async (grindInput: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as the "Oracle of Effort". A 13-year-old user just finished a focused work session and said: "${grindInput}". 
    Judge their effort and value. 
    Assign an XP reward between 50 and 400. 
    Provide a short, 1-sentence epic feedback message (e.g., "Your focus in the English Archives has strengthened your intellectual blade!").
    Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          xp: { type: Type.NUMBER, description: 'XP reward based on input complexity' },
          feedback: { type: Type.STRING, description: 'Motivational feedback' },
          rank: { type: Type.STRING, description: 'Rank for the session, e.g., Iron, Gold, Diamond' }
        },
        required: ['xp', 'feedback', 'rank']
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { xp: 50, feedback: "You ground hard! The Oracle is pleased.", rank: "Bronze" };
  }
};

export const evaluateBookCompletion = async (bookTitle: string, bookAuthor: string, isOverLimit: boolean) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as the "Keeper of the Great Archive". A student just finished reading "${bookTitle}" by ${bookAuthor}.
    Evaluate the literary difficulty of this book for a 13-year-old (Year 8).
    Assign a difficulty: 'Easy', 'Medium', 'Hard', or 'Epic'.
    Assign an XP reward: 
    - Easy: 200
    - Medium: 500
    - Hard: 1000
    - Epic: 2500
    Gold is 50% of XP.
    ${isOverLimit ? "The user has exceeded their annual collection goal! Apply a 50% 'Scholar's Bonus' to these rewards." : ""}
    Provide a 1-sentence epic feedback on why this book expanded their wisdom.
    Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          xp: { type: Type.NUMBER },
          gold: { type: Type.NUMBER },
          difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard', 'Epic'] },
          feedback: { type: Type.STRING }
        },
        required: ['xp', 'gold', 'difficulty', 'feedback']
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { xp: 300, gold: 150, difficulty: 'Medium', feedback: "Your wisdom grows with every page turned." };
  }
};

export const getAIAdvice = async (tasks: any[]) => {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a legendary high-school RPG Oracle. Analyze this user's quest log: ${completed} completed, ${pending} pending. Give a punchy, 2-sentence motivational boost or "Study Strat" to help a 13-year-old level up.`,
  });

  return response.text;
};

const WEATHER_CACHE_KEY = 'lifequest_weather_v2';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export const getWeatherForecast = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Search BOM (Bureau of Meteorology) for current Sydney weather. I need the current temperature, feels like temp, max/min, summary, and rain range (e.g. 10-70mm). ALSO get the hourly forecast for the next 12 hours including time, icon type, temp, feels like, and rain amount. Return as a single JSON object.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            temp_current: { type: Type.STRING },
            feels_like: { type: Type.STRING },
            temp_min: { type: Type.STRING },
            temp_max: { type: Type.STRING },
            summary: { type: Type.STRING },
            rain_range: { type: Type.STRING },
            icon_type: { type: Type.STRING, enum: ['sun', 'cloud', 'rain', 'storm'] },
            hourly: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  temp: { type: Type.STRING },
                  feels_like: { type: Type.STRING },
                  rain_amount: { type: Type.STRING },
                  icon: { type: Type.STRING, enum: ['sun', 'cloud', 'rain', 'storm'] }
                },
                required: ['time', 'temp', 'feels_like', 'icon']
              }
            }
          },
          required: ['temp_current', 'feels_like', 'temp_min', 'temp_max', 'summary', 'rain_range', 'icon_type', 'hourly']
        }
      },
    });

    const data = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const weatherData = { ...data, sources };

    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
      data: weatherData,
      timestamp: Date.now()
    }));

    return weatherData;
  } catch (e: any) {
    console.error("Weather fetch failed", e);
    // Return partial error info to UI if quota is hit
    if (e?.message?.includes('429') || e?.message?.includes('RESOURCE_EXHAUSTED')) {
      return { error: 'QUOTA_REACHED' };
    }
    return null;
  }
};
