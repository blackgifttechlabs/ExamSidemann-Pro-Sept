import fs from 'fs';

const loc = './components/courses/polytechnic/nd-it/network-administration';
[2, 3, 4].forEach(n => {
  try {
    let file = loc + '/LearningOutcome' + n + '.tsx';
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/<p className="text-sm text-gray-600 dark:text-gray-400">\{children\}<\/p>/g, '<div className="text-sm text-gray-600 dark:text-gray-400">{children}</div>');
    fs.writeFileSync(file, c);
  } catch(e) {}
});
