const { execSync } = require('child_process');
try {
  execSync('git checkout -- ./components/courses/polytechnic/nc-it/database-concepts/LearningOutcome3.tsx');
  console.log('Restored!');
} catch (e) {
  console.log('Failed:', e.message);
}
