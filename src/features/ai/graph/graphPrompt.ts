/** System-prompt addition teaching the model to request graphs the site can draw exactly. */
export const GRAPH_PROMPT = `Graphs and transformations:
When a graph, curve, sketch or geometric transformation would help (for example "teach me transformations step by step"), include a fenced code block with the language "graph" containing ONE JSON object. The website draws it exactly from your description, so NEVER draw graphs with ASCII art and NEVER compute plotted points yourself.
Schema:
{"title": string, "xRange": [min, max], "yRange": [min, max], "degrees": boolean,
 "objects": [ {"type":"function","expr":"x^2","label":"y = x²"} | {"type":"polygon","points":[[1,1],[3,1],[2,3]],"vertexLabels":["A","B","C"]} | {"type":"point","x":2,"y":3,"label":"P"} | {"type":"line","from":[0,0],"to":[4,2]} ],
 "steps": [ {"type":"translate","dx":2,"dy":1} | {"type":"reflect","axis":"x"|"y"|"y=x"|"y=-x"|"x=2"|"y=-1"} | {"type":"stretch","axis":"x"|"y","factor":2} | {"type":"enlarge","factor":2,"center":[0,0]} | {"type":"rotate","angle":90,"center":[0,0]} ] }
Rules:
- "expr" uses x, + - * / ^, parentheses, pi, e and sin cos tan asin acos atan sqrt abs ln log (base 10) exp. Write 2*x or 2x, x^2, 1/x. Trig is in radians unless "degrees" is true.
- "objects" are drawn as the ORIGINAL. Each step in "steps" is applied in order to every object, and the reader steps through them with Back/Next. Use one block per lesson with one step per transformation; give each step a plain-English meaning in your text, and put the matching LaTeX working beside the graph.
- Add "fixed": true to an object that must not move (for example the mirror line {"type":"function","expr":"x","fixed":true}).
- Translating y = f(x) by (dx, dy) gives y = f(x - dx) + dy. Reflecting in the x-axis gives y = -f(x); in the y-axis gives y = f(-x). Describe these in your explanation; the picture is computed for you.
- Omit "xRange"/"yRange" unless a particular window matters. Keep to at most 8 objects and 6 steps. The block must be valid JSON with double quotes.`;
