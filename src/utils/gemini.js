import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeTransaction = async (text, apiKey) => {
    if (!apiKey) throw new Error("API Key is missing");

    // Basic mock for "gemini-pro" if the user hasn't set a key yet but wants to try the UI logic with a fake key.
    // Actually, let's just use the real SDK.

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    const prompt = `
    You are a financial assistant. Analyze the following transaction text:
    "${text}"
    
    Extract:
    1. amount (number, positive)
    2. category (one of: 'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Housing', 'Rent', 'Salary', 'Others')
    3. date (ISO string YYYY-MM-DD. Today is ${new Date().toISOString().split('T')[0]}. If not mentioned, use today)
    
    Return strictly valid JSON. No markdown formatting.
    Example: { "amount": 25, "category": "Food", "date": "2024-05-20" }
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();
        // Remove markdown code blocks if present
        textResponse = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        return JSON.parse(textResponse);
    } catch (e) {
        console.warn("Gemini API failed, falling back to local parsing:", e);

        // Fallback: Simple Regex Parsing
        const amountMatch = text.match(/(\d+(\.\d+)?)/);
        const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

        let category = "Others";
        const lowerText = text.toLowerCase();
        if (lowerText.match(/food|lunch|dinner|coffee|tea|bread|meal|饭|面|粉|茶|咖啡/)) category = "Food";
        else if (lowerText.match(/taxi|bus|train|uber|subway|车|铁|通/)) category = "Transport";
        else if (lowerText.match(/shop|buy|clothes|shoes|买|衣|鞋/)) category = "Shopping";
        else if (lowerText.match(/movie|game|play|fun|玩|影|游/)) category = "Entertainment";
        else if (lowerText.match(/rent|housing|house|flat|apartment|房|租/)) category = "Rent";

        return {
            amount,
            category,
            date: new Date().toISOString().split('T')[0]
        };
    }
};

