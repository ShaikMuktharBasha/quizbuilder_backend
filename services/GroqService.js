const Groq = require("groq-sdk");

class GroqService {
  constructor() {
    this.groq = null;
  }

  initialize() {
    if (process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    } else {
      console.warn("GROQ_API_KEY is missing in environment variables.");
    }
  }

  async generateQuiz(topic, difficulty, count = 5) {
    if (!this.groq) {
      this.initialize();
      if (!this.groq) {
        throw new Error("GROQ_API_KEY is missing. Please check your environment variables.");
      }
    }

    const prompt = `
Generate ${count} unique MCQ questions on "${topic}".
Difficulty: ${difficulty}.
Return ONLY a valid JSON array like:
[
  {
    "questionText": "Question here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOption": "A", // Or B, C, D (Must be the letter index of the correct option in the options array. 0->A, 1->B ...) 
    "explanation": "Brief explanation"
  }
]
IMPORTANT format requirements:
1. "options" must be an array of 4 strings.
2. "correctOption" should be the *letter* corresponding to the correct answer (A, B, C, or D).
   - "A" corresponds to options[0]
   - "B" corresponds to options[1]
   - "C" corresponds to options[2]
   - "D" corresponds to options[3]
3. The response must be valid JSON. Do not include any markdown formatting like \`\`\`json. Just the JSON array.
`;

    // Note: the original GeminiService expected specific fields: optionA, optionB... 
    // But frontend might expect something else.
    // Let's check what QuizService or Frontend expects.
    // GeminiService sample in previous read had:
    // "optionA": "", "optionB": "", "optionC": "", "optionD": "", "correctOption": "A"
    
    // I should strictly follow the schema used in GeminiService to ensure compatibility.
    
    const promptRefined = `
Generate ${count} unique MCQ questions on "${topic}".
Difficulty: ${difficulty}.
Return ONLY a valid JSON array like:
[
  {
    "questionText": "Question text here",
    "optionA": "Option A text",
    "optionB": "Option B text",
    "optionC": "Option C text",
    "optionD": "Option D text",
    "correctOption": "A", 
    "explanation": "Short explanation"
  }
]
"correctOption" must be one of "A", "B", "C", "D".
Do not include any markdown or code block markers. Return strictly the JSON array.
`;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: promptRefined,
          },
        ],
        model: "llama-3.3-70b-versatile", 
        temperature: 0.5, // slightly creative but deterministic enough for JSON
      });

      const text = chatCompletion.choices[0]?.message?.content || "";
      console.log("RAW GROQ RESPONSE:", text);

      // JSON Extraction Logic (same as GeminiService)
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]") + 1;

      if (start === -1 || end === -1) {
        throw new Error("Invalid JSON returned from Groq API");
      }

      const jsonString = text.substring(start, end);
      return JSON.parse(jsonString);

    } catch (error) {
      console.error("GroqService Error:", error.message);
      throw error;
    }
  }
}

module.exports = new GroqService();
