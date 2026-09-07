import fs from "fs";
import path from "path";

const srcMap = [
  "nc-it/workplace-communication",
  "nc-it/national-studies",
  "nc-it/entrepreneurship-skills-development"
];

const destBase = "src/features/courses/polytechnic/records-nd";

if (!fs.existsSync(destBase)) {
  fs.mkdirSync(destBase, { recursive: true });
}

srcMap.forEach(src => {
  const fullSrc = path.join("src/features/courses/polytechnic", src);
  const dest = path.join(destBase, path.basename(src));
  fs.cpSync(fullSrc, dest, { recursive: true });
});
