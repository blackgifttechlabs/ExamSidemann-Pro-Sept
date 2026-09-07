/**
 * Completion data for the regions Monaco does not cover on its own.
 *
 * Monaco's CSS and JavaScript services only run on a model whose language is
 * css/javascript, so the styles.css and script.js tabs get full IntelliSense
 * for free. Inside a <style> or <script> block in index.html — which is where
 * the starter project tells students to work — nothing is offered, so these
 * lists back a provider that fills that gap.
 */

export interface PropertyEntry {
  name: string;
  documentation: string;
}

export const CSS_PROPERTIES: PropertyEntry[] = [
  { name: "align-items", documentation: "Aligns flex or grid children on the cross axis." },
  { name: "background", documentation: "Shorthand for all background properties." },
  { name: "background-color", documentation: "Colour painted behind the element." },
  { name: "background-image", documentation: "Image painted behind the element." },
  { name: "background-position", documentation: "Where the background image sits." },
  { name: "background-size", documentation: "How big the background image is drawn." },
  { name: "border", documentation: "Shorthand: width, style and colour of the border." },
  { name: "border-bottom", documentation: "Border on the bottom edge only." },
  { name: "border-collapse", documentation: "Whether table borders merge into one." },
  { name: "border-color", documentation: "Colour of the border." },
  { name: "border-radius", documentation: "Rounds the corners." },
  { name: "border-style", documentation: "solid, dashed, dotted, none." },
  { name: "border-top", documentation: "Border on the top edge only." },
  { name: "border-width", documentation: "Thickness of the border." },
  { name: "bottom", documentation: "Offset from the bottom for positioned elements." },
  { name: "box-shadow", documentation: "Drop shadow around the element." },
  { name: "box-sizing", documentation: "Whether padding and border count inside the width." },
  { name: "color", documentation: "Colour of the text." },
  { name: "cursor", documentation: "Mouse pointer shown over the element." },
  { name: "display", documentation: "How the element is laid out: block, flex, grid, none." },
  { name: "flex", documentation: "Shorthand for grow, shrink and basis." },
  { name: "flex-direction", documentation: "row or column layout for flex children." },
  { name: "flex-wrap", documentation: "Lets flex children wrap onto new lines." },
  { name: "float", documentation: "Floats the element left or right." },
  { name: "font-family", documentation: "Typeface used for the text." },
  { name: "font-size", documentation: "Size of the text." },
  { name: "font-style", documentation: "normal or italic." },
  { name: "font-weight", documentation: "Thickness of the text: normal, bold, 100-900." },
  { name: "gap", documentation: "Space between flex or grid children." },
  { name: "grid-template-columns", documentation: "Defines the columns of a grid." },
  { name: "grid-template-rows", documentation: "Defines the rows of a grid." },
  { name: "height", documentation: "Height of the element." },
  { name: "justify-content", documentation: "Aligns flex or grid children on the main axis." },
  { name: "left", documentation: "Offset from the left for positioned elements." },
  { name: "letter-spacing", documentation: "Space between letters." },
  { name: "line-height", documentation: "Height of each line of text." },
  { name: "list-style", documentation: "Bullet or number style of a list." },
  { name: "margin", documentation: "Space outside the border." },
  { name: "margin-bottom", documentation: "Space below the element." },
  { name: "margin-left", documentation: "Space to the left of the element." },
  { name: "margin-right", documentation: "Space to the right of the element." },
  { name: "margin-top", documentation: "Space above the element." },
  { name: "max-width", documentation: "Widest the element may become." },
  { name: "min-height", documentation: "Shortest the element may become." },
  { name: "min-width", documentation: "Narrowest the element may become." },
  { name: "opacity", documentation: "Transparency from 0 to 1." },
  { name: "overflow", documentation: "What happens to content that does not fit." },
  { name: "padding", documentation: "Space inside the border." },
  { name: "padding-bottom", documentation: "Inside space at the bottom." },
  { name: "padding-left", documentation: "Inside space on the left." },
  { name: "padding-right", documentation: "Inside space on the right." },
  { name: "padding-top", documentation: "Inside space at the top." },
  { name: "position", documentation: "static, relative, absolute, fixed or sticky." },
  { name: "right", documentation: "Offset from the right for positioned elements." },
  { name: "text-align", documentation: "Aligns text: left, right, center, justify." },
  { name: "text-decoration", documentation: "Underline, overline or none." },
  { name: "text-transform", documentation: "uppercase, lowercase or capitalize." },
  { name: "top", documentation: "Offset from the top for positioned elements." },
  { name: "transform", documentation: "Moves, rotates or scales the element." },
  { name: "transition", documentation: "Animates a property change over time." },
  { name: "vertical-align", documentation: "Vertical alignment of inline content." },
  { name: "visibility", documentation: "visible or hidden, without removing the space." },
  { name: "white-space", documentation: "How whitespace and wrapping are handled." },
  { name: "width", documentation: "Width of the element." },
  { name: "word-spacing", documentation: "Space between words." },
  { name: "z-index", documentation: "Stacking order of positioned elements." },
];

/** Values proposed once a property and its colon have been typed. */
export const CSS_VALUES: Record<string, string[]> = {
  "align-items": ["center", "flex-start", "flex-end", "stretch", "baseline"],
  "background-size": ["cover", "contain", "auto"],
  "border-style": ["solid", "dashed", "dotted", "double", "none"],
  "box-sizing": ["border-box", "content-box"],
  cursor: ["pointer", "default", "text", "not-allowed", "grab"],
  display: ["block", "inline", "inline-block", "flex", "grid", "none"],
  "flex-direction": ["row", "column", "row-reverse", "column-reverse"],
  "flex-wrap": ["wrap", "nowrap", "wrap-reverse"],
  float: ["left", "right", "none"],
  "font-family": ["Arial, Helvetica, sans-serif", "Georgia, serif", "'Courier New', monospace"],
  "font-style": ["normal", "italic"],
  "font-weight": ["normal", "bold", "600", "700"],
  "justify-content": ["center", "space-between", "space-around", "flex-start", "flex-end"],
  "list-style": ["none", "disc", "decimal", "circle"],
  overflow: ["hidden", "auto", "scroll", "visible"],
  position: ["static", "relative", "absolute", "fixed", "sticky"],
  "text-align": ["left", "center", "right", "justify"],
  "text-decoration": ["none", "underline", "line-through"],
  "text-transform": ["uppercase", "lowercase", "capitalize", "none"],
  visibility: ["visible", "hidden"],
  "white-space": ["normal", "nowrap", "pre-wrap"],
};

export interface SnippetEntry {
  label: string;
  insertText: string;
  documentation: string;
}

/** Offered inside a <script> block, where the TypeScript worker does not run. */
export const EMBEDDED_JS_SNIPPETS: SnippetEntry[] = [
  {
    label: "document.getElementById",
    insertText: 'document.getElementById("${1:id}")',
    documentation: "Find one element by its id.",
  },
  {
    label: "document.querySelector",
    insertText: 'document.querySelector("${1:.selector}")',
    documentation: "Find the first element matching a CSS selector.",
  },
  {
    label: "document.querySelectorAll",
    insertText: 'document.querySelectorAll("${1:.selector}")',
    documentation: "Find every element matching a CSS selector.",
  },
  {
    label: "document.createElement",
    insertText: 'document.createElement("${1:div}")',
    documentation: "Make a new element in memory.",
  },
  {
    label: "addEventListener",
    insertText: 'addEventListener("${1:click}", function (event) {\n\t$0\n});',
    documentation: "Run code when an event happens.",
  },
  { label: "textContent", insertText: "textContent", documentation: "The text inside an element." },
  { label: "innerHTML", insertText: "innerHTML", documentation: "The HTML inside an element." },
  { label: "appendChild", insertText: "appendChild(${1:child})", documentation: "Add a child element." },
  { label: "classList.add", insertText: 'classList.add("${1:class}")', documentation: "Add a CSS class." },
  { label: "classList.remove", insertText: 'classList.remove("${1:class}")', documentation: "Remove a CSS class." },
  { label: "classList.toggle", insertText: 'classList.toggle("${1:class}")', documentation: "Add the class if missing, remove it if present." },
  { label: "style", insertText: "style.${1:backgroundColor} = ${2:\"red\"};", documentation: "Change one CSS property from JavaScript." },
  { label: "console.log", insertText: "console.log(${1:value});", documentation: "Print a value to the console panel." },
  { label: "const", insertText: "const ${1:name} = ${2:value};", documentation: "Declare a value that does not change." },
  { label: "let", insertText: "let ${1:name} = ${2:value};", documentation: "Declare a value you can change." },
  { label: "function", insertText: "function ${1:name}(${2:parameters}) {\n\t$0\n}", documentation: "Function declaration." },
  { label: "if", insertText: "if (${1:condition}) {\n\t$0\n}", documentation: "Run the block when the condition is true." },
  {
    label: "for",
    insertText: "for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t$0\n}",
    documentation: "Counted loop.",
  },
  { label: "forEach", insertText: "forEach(function (${1:item}) {\n\t$0\n});", documentation: "Run a function for every item." },
  { label: "parseInt", insertText: "parseInt(${1:text})", documentation: "Turn text into a whole number." },
  { label: "parseFloat", insertText: "parseFloat(${1:text})", documentation: "Turn text into a decimal number." },
  { label: "alert", insertText: "alert(${1:\"message\"});", documentation: "Pop up a message box." },
];

export type EmbeddedRegion = "markup" | "style" | "script";

/**
 * Works out which region of an HTML document the caret sits in by counting the
 * <style>/<script> tags opened and closed before it.
 */
export const regionAt = (textBefore: string): EmbeddedRegion => {
  const openCount = (name: string) => (textBefore.match(new RegExp(`<${name}[\\s>]`, "gi")) || []).length;
  const closeCount = (name: string) => (textBefore.match(new RegExp(`</${name}>`, "gi")) || []).length;

  if (openCount("style") > closeCount("style")) return "style";
  if (openCount("script") > closeCount("script")) return "script";
  return "markup";
};
