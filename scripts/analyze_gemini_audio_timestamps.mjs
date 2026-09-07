import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , audioArg] = process.argv;
if (!audioArg) throw new Error('Usage: node analyze_gemini_audio_timestamps.mjs <audio.mp3>');

const apiKey = [
  process.env.GEMINI_API_KEY_3,
  process.env.VITE_GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_2,
  process.env.VITE_GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY,
  process.env.VITE_GEMINI_API_KEY,
].map((value) => String(value || '').trim()).find(Boolean);

if (!apiKey) throw new Error('No Gemini API key is configured.');

const audio = readFileSync(resolve(audioArg)).toString('base64');
const markers = [
  'Let us begin with a perpendicular bisector.',
  'Draw a straight line segment and label its ends A and B.',
  'Place the compass needle exactly on A.',
  'Keeping the needle on A, draw one light arc above the line and another light arc below it.',
  'Now lift the compass and move the needle precisely onto B.',
  'Use your ruler to join those two crossing points.',
  'Now let us bisect an angle.',
  'Draw any angle and call its vertex O.',
  'Put the compass needle on O and draw an arc that crosses both arms of the angle.',
  'Place the needle on the first crossing point and draw a small arc inside the angle.',
  'Without changing the width, place the needle on the second crossing point.',
  'Draw a straight ray from O through that new crossing point.',
  'Our final construction is a right angle on a straight line.',
  'Start with a straight line and mark a point P on it.',
  'Place the compass needle on P and draw an arc that cuts the line at two points.',
  'From the left point, draw an arc above the line.',
  'From the right point, draw another arc to cross the first one.',
  'Use the ruler to draw a line from P through the crossing of the two arcs.',
];

const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
  body: JSON.stringify({
    contents: [{ parts: [
      { text: `Analyze this audio precisely. Locate the spoken start time of each supplied marker. Return ONLY a JSON array in the same order, using objects with \"marker\" and numeric \"seconds\". Use decimal seconds and do not omit markers. Markers:\n${markers.map((marker, index) => `${index + 1}. ${marker}`).join('\n')}` },
      { inlineData: { mimeType: 'audio/mpeg', data: audio } },
    ] }],
    generationConfig: { temperature: 0, responseMimeType: 'application/json' },
  }),
});

const data = await response.json().catch(() => null);
if (!response.ok || data?.error) throw new Error(data?.error?.message || `Gemini request failed with ${response.status}.`);
const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
if (!text) throw new Error('Gemini returned no timestamp analysis.');
console.log(text);
