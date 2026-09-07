const fs = require('fs');

const walkSync = (dir, filelist = []) => {
    try {
        fs.readdirSync(dir).forEach(file => {
            filelist = fs.statSync(dir + '/' + file).isDirectory()
                ? walkSync(dir + '/' + file, filelist)
                : filelist.concat(dir + '/' + file);
        });
    } catch(e) {}
    return filelist;
};

// Shona and NASS. We want 5px radii on all containers and buttons.
let files = walkSync('.').filter(f => (f.includes('shona') || f.includes('national-studies')) && f.endsWith('.tsx'));

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace rounded-xl, rounded-2xl, rounded-3xl with rounded-[5px]
    content = content.replace(/rounded-(xl|2xl|3xl|lg|md|sm)/g, 'rounded-[5px]');
    content = content.replace(/rounded /g, 'rounded-[5px] ');
    content = content.replace(/rounded\"/g, 'rounded-[5px]"');
    content = content.replace(/rounded\`/g, 'rounded-[5px]`');
    content = content.replace(/rounded\'/g, "rounded-[5px]'");
    
    // Some places had rounded-full for circular icons, which might break them (make them squarish).
    // The user said "even for buttons". But maybe they didn't mean circular decorative icons.
    // I'll leave rounded-full alone, because things like `w-8 h-8 rounded-full bg-red-400` are circles.
    // Buttons are usually rounded-md, rounded-lg, or rounded-none, or rounded-full for pills.
    // If there is any `button` with `rounded-full`, I can replace it.
    
    content = content.replace(/<button[^>]*className=["'\`][^>]*rounded-full[^>]*>/ig, (match) => {
        return match.replace(/rounded-full/g, 'rounded-[5px]');
    });

    fs.writeFileSync(file, content);
}
