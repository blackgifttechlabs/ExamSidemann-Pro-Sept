
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Helper to extract JSON from markdown/text if the model includes reasoning or search citations.
 */
const extractJSON = (text: string) => {
    try {
        const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
        console.error("JSON Extraction Error:", e);
        return null;
    }
};

/**
 * Structures raw text into educational content blocks based on a strategy.
 */
export const structureNotes = async (rawText: string, strategy: string, isCustomTagged: boolean = false) => {
    let prompt = "";
    
    if (isCustomTagged) {
        prompt = `
            TASK: Parse the following text which contains formatting tags in curly braces {}.
            TAGS: {h1}, {h2}, {text}, {list}, {table}, {callout}.
            
            RULES:
            1. Extract text between tags and assign the tag as the 'type'.
            2. For {list}, ensure items are newline separated starting with "- ".
            3. For {table}, format as a Markdown pipe table.
            4. Return a JSON array of objects: { "type": string, "data": string }.
            
            INPUT: ${rawText}
        `;
    } else {
        prompt = `
            TASK: Reorganize the provided academic text into structured educational content.
            STRATEGY: ${strategy}
            
            BLOCK TYPES: 
            - "h1": Main Heading
            - "h2": Sub-heading
            - "text": Standard paragraph
            - "list": Bulleted list (start items with "- ")
            - "table": Markdown pipe table
            - "callout": Important highlight box
            
            RULES:
            1. Preserve original information accurately.
            2. Structure into a logical flow.
            3. Return ONLY a valid JSON array of objects: [{ "type": "type_name", "data": "content_string" }].
            
            TEXT: ${rawText}
        `;
    }

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
            }
        });
        return extractJSON(response.text || "[]");
    } catch (e) {
        console.error(e);
        return [];
    }
};

/**
 * Generates an MCQ quiz based on specific content blocks.
 */
export const generateQuizFromContent = async (blocks: any[], count: number, subject: string) => {
    const context = blocks.map(b => b.data).join('\n');
    const prompt = `
        TASK: Generate a ${count}-question Multiple Choice Quiz for ${subject} based on the context below.
        
        RULES:
        1. Each question must have 4 options.
        2. Identify the exactly correct answer.
        3. Ensure questions test understanding, not just recall.
        
        CONTEXT: ${context}
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswer: { type: Type.STRING }
                        },
                        required: ["question", "options", "correctAnswer"]
                    }
                }
            }
        });
        return extractJSON(response.text || "[]");
    } catch (e) {
        console.error(e);
        return [];
    }
};

/**
 * Generates formatted study material (legacy support)
 */
export const generateFormattedStudyMaterial = async (
  type: 'quiz' | 'exam' | 'summary', 
  subject: string, 
  topic: string, 
  count: number,
  sourceText: string
): Promise<string> => {
  const ai = getAI();
  const prompt = `Create a ${type} for ${subject} on ${topic}. Questions bolded. Horizontal lines between sections. Source: ${sourceText.slice(0, 4000)}`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text || "";
  } catch (error) {
    return "Error generating content.";
  }
};

/**
 * General purpose study material generation
 */
export const generateStudyMaterial = async (type: 'quiz' | 'exam' | 'summary', subject: string, topic: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a ${type} for ${subject}: ${topic}. Use plain text only.`
  });
  return response.text || "";
};

/**
 * Live search for school info
 */
export const generateSchoolInfo = async (name: string, type: string, province: string) => {
    const prompt = `SEARCH THE WEB for details of "${name}" in "${province}", Zimbabwe. Return JSON: motto, location, coordinates: {lat, lng}, curriculums: [], phone, email, website, isBoarding, isDay, fees: {amount, currency, period}, description.`;
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{googleSearch: {}}] }
        });
        const data = extractJSON(response.text || "");
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web?.uri).filter(Boolean) || [];
        return data ? { ...data, sources } : null;
    } catch (e) { return null; }
};

/**
 * Bulk school discovery
 */
export const generateBulkSchoolsInfo = async (type: string, province: string, existingNames: string[]) => {
    const prompt = `SEARCH THE WEB for 20 real "${type}" schools in "${province}", Zimbabwe. Exclude: ${existingNames.join(',')}. Return JSON array of objects with name, motto, location, coordinates, phone, email, website, isBoarding, isDay, fees, description.`;
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{googleSearch: {}}] }
        });
        return extractJSON(response.text || "[]");
    } catch (e) { return []; }
};

export const gradeSubmission = async (questionText: string, studentAnswer: string): Promise<{ score: number, feedback: string }> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Grade this. Q: ${questionText} A: ${studentAnswer}. Return JSON: {score, feedback}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};
