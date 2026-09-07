const fs = require('fs');
const path = require('path');

const shonaDir = 'courses/form-1/shona';
const files = fs.readdirSync(shonaDir)
  .filter(file => file.endsWith('.tsx'))
  .map(file => path.join(shonaDir, file));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Revert any previous "overflow-hidden" or "flex-1" mistakes
  content = content.replace(/px-4 sm:px-6 md:px-\[30px\] overflow-hidden/g, 'px-[30px]');
  content = content.replace(/px-4 flex-1 sm:px-6 md:px-\[30px\] overflow-x-hidden/g, 'px-[30px]');
  content = content.replace(/min-h-\[100dvh\] relative overflow-hidden/g, 'min-h-[100dvh] relative overflow-x-hidden');
  
  if (content.includes('px-[30px]')) {
    content = content.replace(/px-\[30px\]/g, 'px-4 sm:px-6 md:px-[30px] overflow-x-hidden');
    changed = true;
  }
  
  if (content.includes('min-h-screen relative')) {
    content = content.replace(/min-h-screen relative/g, 'min-h-[100dvh] relative overflow-x-hidden max-w-full');
    changed = true;
  }
  
  if (content.includes('min-h-[100dvh] relative max-w-full overflow-x-hidden')) {
     // that's already in our good format, but we can make sure
  }

  // Also replace 'min-h-screen' generically over container classes if not caught
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  } else {
    // If we only made regex replacements at the top
    fs.writeFileSync(file, content, 'utf8');
    console.log('Processed', file);
  }
}
