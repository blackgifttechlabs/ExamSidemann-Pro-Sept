
import { requestGeminiCompletion } from './gemini';

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
        const text = await requestGeminiCompletion({
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
        });
        return extractJSON(text || "[]");
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
        4. Return ONLY a valid JSON array: [{ "question": string, "options": string[], "correctAnswer": string }]
        
        CONTEXT: ${context}
    `;

    try {
        const text = await requestGeminiCompletion({
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.4,
        });
        return extractJSON(text || "[]");
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
  const prompt = `Create a ${type} for ${subject} on ${topic}. Questions bolded. Horizontal lines between sections. Source: ${sourceText.slice(0, 4000)}`;
  try {
    return await requestGeminiCompletion({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });
  } catch (error) {
    return "Error generating content.";
  }
};

/**
 * General purpose study material generation
 */
export const generateStudyMaterial = async (type: 'quiz' | 'exam' | 'summary', subject: string, topic: string): Promise<string> => {
  return requestGeminiCompletion({
    messages: [{ role: 'user', content: `Create a ${type} for ${subject}: ${topic}. Use plain text only.` }],
    temperature: 0.5,
  });
};

/**
 * Live search for school info
 */
export const generateSchoolInfo = async (name: string, type: string, province: string) => {
    const prompt = `Find details of "${name}" school in "${province}", Zimbabwe. Return JSON: motto, location, coordinates: {lat, lng}, curriculums: [], phone, email, website, isBoarding, isDay, fees: {amount, currency, period}, description.`;
    try {
        const text = await requestGeminiCompletion({
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
        });
        return extractJSON(text || "");
    } catch (e) { return null; }
};

/**
 * Bulk school discovery
 */
export const generateBulkSchoolsInfo = async (type: string, province: string, existingNames: string[]) => {
    const prompt = `List 20 real "${type}" schools in "${province}", Zimbabwe. Exclude: ${existingNames.join(',')}. Return JSON array of objects with name, motto, location, coordinates, phone, email, website, isBoarding, isDay, fees, description.`;
    try {
        const text = await requestGeminiCompletion({
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
        });
        return extractJSON(text || "[]");
    } catch (e) { return []; }
};

export const gradeSubmission = async (questionText: string, studentAnswer: string): Promise<{ score: number, feedback: string }> => {
    const prompt = `Grade this submission. Question: ${questionText}\nStudent Answer: ${studentAnswer}\nReturn ONLY valid JSON: {"score": number, "feedback": string}`;
    try {
        const text = await requestGeminiCompletion({
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
        });
        return JSON.parse(text || "{}");
    } catch {
        return { score: 0, feedback: "Could not grade submission." };
    }
};

