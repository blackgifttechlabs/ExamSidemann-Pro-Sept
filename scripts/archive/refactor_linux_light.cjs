const fs = require('fs');

let linuxFile = './components/practicals/tools/linux/LinuxTerminal.tsx';
let linuxContent = fs.readFileSync(linuxFile, 'utf8');

// Light mode adaptation for Linux AI
linuxContent = linuxContent.replace(
    /\.ai-linux-input \{\s*background-color: #010201;\s*border: 1px solid rgba\(57, 255, 20, 0.4\);\s*width: 100%;\s*height: 48px;\s*border-radius: 8px;\s*color: #39ff14;\s*padding-inline: 16px 50px;\s*font-size: 14px;\s*box-sizing: border-box;\s*font-family: monospace;\s*transition: all 0.3s ease;\s*\}/,
    `
.dark .ai-linux-input { background-color: #010201; border: 1px solid rgba(57, 255, 20, 0.4); color: #39ff14; }
.ai-linux-input { background-color: #ffffff; border: 1px solid #ccc; width: 100%; height: 48px; border-radius: 8px; color: #111; padding-inline: 16px 50px; font-size: 14px; box-sizing: border-box; font-family: monospace; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    `
);

linuxContent = linuxContent.replace(
    /\.ai-linux-input:focus \{\s*outline: none;\s*box-shadow: 0 0 15px rgba\(57, 255, 20, 0.4\), inset 0 0 10px rgba\(57, 255, 20, 0.1\);\s*border-color: #39ff14;\s*\}/,
    `
.dark .ai-linux-input:focus { outline: none; box-shadow: 0 0 15px rgba(57, 255, 20, 0.4), inset 0 0 10px rgba(57, 255, 20, 0.1); border-color: #39ff14; }
.ai-linux-input:focus { outline: none; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-color: #888; }
    `
);

linuxContent = linuxContent.replace(
    /\.ai-linux-input::placeholder \{\s*color: rgba\(57, 255, 20, 0.5\);\s*\}/,
    `
.dark .ai-linux-input::placeholder { color: rgba(57, 255, 20, 0.5); }
.ai-linux-input::placeholder { color: #888; }
    `
);

// We need to implement proper react-resizable-panels in LinuxTerminal because the current drag mechanism only works on horizontal and is tied to `isAiDragging`.
// But wait, what if I just use react-resizable-panels! It's so much cleaner. I can write a script to replace the layout.
// Actually, it's safer to just provide the replacement since it's only a few divs.
if (!linuxContent.includes('PanelGroup')) {
    linuxContent = linuxContent.replace(/import {/, "import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';\nimport {");
    
    // Original wrapper:
    // <div className="flex flex-col md:flex-row flex-1 overflow-hidden order-1 md:order-1" ref={containerRef} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onPointerCancel={handlePointerUp}>
    // We replace it and its contents up to the first pane.
    
    let containerMatch = /<div className="flex flex-col md:flex-row flex-1 overflow-hidden order-1 md:order-1"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/>/;
    // This is too fragile...
}

fs.writeFileSync(linuxFile, linuxContent);
