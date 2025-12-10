import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.API_KEY || '';

// Initialize client securely
// Note: In a real production app, you might proxy this through a backend to keep the key hidden,
// but for this client-side demo we use the process.env injection.
const genAI = new GoogleGenerativeAI(apiKey);

export const generateBusinessInsight = async (
  industry: string,
  challenge: string
): Promise<{ text: string }> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });
    
    const prompt = `
      Act as a senior AI consultant for "Entropy AI". 
      The user works in the "${industry}" industry and is facing this challenge: "${challenge}".
      
      Provide a concise, high-impact 3-sentence strategic response on how Artificial Intelligence can solve this specific problem.
      Focus on value, efficiency, or prediction. 
      Do not be generic. Be specific to the industry.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { text: text || "Unable to generate insight at this time." };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Our AI systems are currently experiencing high entropy. Please try again later." };
  }
};
