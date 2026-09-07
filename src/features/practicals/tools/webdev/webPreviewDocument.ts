export interface WebProjectFiles {
  html: string;
  css: string;
  js: string;
}

/**
 * Runs inside the preview frame before any student code. It mirrors console
 * output and uncaught errors back to the IDE so the bottom panel behaves like
 * the browser devtools console the students will use in the labs.
 */
const CONSOLE_BRIDGE = `
(function () {
  var format = function (value) {
    try {
      if (typeof value === 'string') return value;
      if (value instanceof Error) return value.name + ': ' + value.message;
      if (typeof value === 'object' && value !== null) return JSON.stringify(value);
      return String(value);
    } catch (error) {
      return String(value);
    }
  };
  var post = function (level, args) {
    try {
      parent.postMessage({
        __sidemannWebConsole: true,
        level: level,
        text: Array.prototype.map.call(args, format).join(' ')
      }, '*');
    } catch (error) {}
  };
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      post(level, arguments);
      if (original) original.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (event) {
    post('error', [event.message + ' (line ' + event.lineno + ')']);
  });
  window.addEventListener('unhandledrejection', function (event) {
    post('error', ['Unhandled promise rejection: ' + format(event.reason)]);
  });
})();
`;

// A literal </script> inside the student's JS would close the injected tag early.
const escapeClosingTags = (script: string) => script.replace(/<\/script>/gi, '<\\/script>');

const SKELETON_HEAD = `<meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />`;

/**
 * Stitches the three editor files into one document for the preview iframe.
 *
 * Students write markup either way: a bare fragment of body content, or a full
 * document with its own <html>/<head>. A full document is respected and the CSS
 * and JS are threaded into it; a fragment gets the standard skeleton.
 */
export const buildPreviewDocument = ({ html, css, js }: WebProjectFiles) => {
  const bridgeTag = `<script>${CONSOLE_BRIDGE}</script>`;
  const styleTag = `<style>\n${css}\n</style>`;
  const scriptTag = `<script>\n${escapeClosingTags(js)}\n</script>`;

  if (/<html[\s>]/i.test(html)) {
    let document = html;

    if (/<\/head>/i.test(document)) {
      document = document.replace(/<\/head>/i, `${bridgeTag}\n${styleTag}\n</head>`);
    } else if (/<html[^>]*>/i.test(document)) {
      document = document.replace(/<html[^>]*>/i, `$&\n<head>${bridgeTag}\n${styleTag}</head>`);
    }

    if (/<\/body>/i.test(document)) {
      document = document.replace(/<\/body>/i, `${scriptTag}\n</body>`);
    } else {
      document += `\n${scriptTag}`;
    }

    return document;
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${SKELETON_HEAD}
    <title>Preview</title>
    ${bridgeTag}
    ${styleTag}
  </head>
  <body>
${html}
    ${scriptTag}
  </body>
</html>`;
};
