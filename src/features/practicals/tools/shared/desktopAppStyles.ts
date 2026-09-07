/**
 * Tailwind is loaded from the Play CDN here **with the forms plugin**, which
 * gives every `input`, `select` and `textarea` 0.5rem of vertical padding, a
 * 1rem font and a 1.5rem line-height. That is right for a web form and wrong
 * for a desktop application: at the 19–22px row heights Access and Visual
 * Studio use, the text is pushed clean out of the box and the control renders
 * blank.
 *
 * These rules undo the plugin inside the two desktop labs only. They are
 * written as `.desktop-app <element>` so they beat the plugin's element-level
 * base styles while still losing to anything more specific.
 */
export const DESKTOP_APP_STYLES = `
.desktop-app select,
.desktop-app textarea,
.desktop-app input[type='text'],
.desktop-app input[type='number'],
.desktop-app input[type='password'],
.desktop-app input[type='date'],
.desktop-app input[type='search'],
.desktop-app input:not([type]) {
  padding-top: 0;
  padding-bottom: 0;
  font-size: inherit;
  font-family: inherit;
  line-height: normal;
  border-radius: 0;
  box-shadow: none;
}
.desktop-app select {
  -webkit-appearance: auto;
  appearance: auto;
  background-image: none;
  padding-left: 2px;
  padding-right: 2px;
}
.desktop-app textarea {
  padding-top: 4px;
  padding-bottom: 4px;
  line-height: 1.5;
}
.desktop-app input[type='color'] {
  padding: 0;
  border-radius: 0;
}
.desktop-app input[type='checkbox'],
.desktop-app input[type='radio'] {
  border-radius: 0;
  box-shadow: none;
}
.desktop-app input[type='radio'] {
  border-radius: 9999px;
}
/* The plugin's focus ring is a 2px blue halo; these apps show focus on the
   border instead, the way the real ones do. */
.desktop-app input:focus,
.desktop-app select:focus,
.desktop-app textarea:focus {
  outline: none;
  box-shadow: none;
  --tw-ring-color: transparent;
  --tw-ring-shadow: 0 0 #0000;
  --tw-ring-offset-shadow: 0 0 #0000;
}
.desktop-app ::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}
.desktop-app ::-webkit-scrollbar-track {
  background: #f0f0f0;
}
.desktop-app ::-webkit-scrollbar-thumb {
  background: #cdcdcd;
  border: 3px solid #f0f0f0;
}
.desktop-app ::-webkit-scrollbar-thumb:hover {
  background: #a6a6a6;
}
`;
