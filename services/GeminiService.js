const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  async generateQuiz(topic, difficulty, count = 5) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const prompt = `
Generate ${count} unique MCQ questions on "${topic}".
Difficulty: ${difficulty}.
Return ONLY a valid JSON array like:
[
  {
    "questionText": "",
    "optionA": "",
    "optionB": "",
    "optionC": "",
    "optionD": "",
    "correctOption": "A",
    "explanation": ""
  }
]
No extra text.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      console.log("RAW GEMINI RESPONSE:", text);

      // 🔥 SAFEST JSON EXTRACTION
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]") + 1;

      if (start === -1 || end === -1) {
        throw new Error("Invalid JSON returned from Gemini");
      }

      const jsonString = text.substring(start, end);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("GeminiService Error:", error.message);
      throw error; // IMPORTANT: let controller catch it
    }
  }
}

module.exports = new GeminiService();
