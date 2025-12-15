const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async generateQuiz(topic, difficulty, count = 5) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Generate ${count} unique and distinct MCQ questions on "${topic}".
Difficulty: ${difficulty}.
Return ONLY JSON like:
[
  {
    "questionText": "Question text here",
    "optionA": "Option A text",
    "optionB": "Option B text",
    "optionC": "Option C text",
    "optionD": "Option D text",
    "correctOption": "A", 
    "explanation": "Explanation here"
  }
]
Ensure "correctOption" is strictly one of "A", "B", "C", or "D".
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the text if it contains markdown code blocks
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error generating quiz with Gemini:", error);
      throw new Error("Failed to generate quiz questions.");
    }
  }
}

module.exports = new GeminiService();
