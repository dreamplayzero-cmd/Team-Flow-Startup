const fs = require('fs');
const file = 'd:/Intel_AI/Team-Flow-Startup/frontend/src/ui/pages/DistrictLeaderboardPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file has some malformed JSX and missing tags causing Vite oxc to fail.
// Error 1: missing closing </div> for the mt-auto z-10 div, and malformed <p> tag.
content = content.replace(
    /<div className="mt-auto z-10">([\s\S]*?)<\/span>\s*([^<]*)고가 소비층의/g,
    `<div className="mt-auto z-10">$1</span></div>\n                            <p className="text-sm italic leading-relaxed text-stitch-on-surface-variant font-medium">"고가 소비층의`
);

// Error 2: "xed text-stitch-on-surface-variant..."
content = content.replace(
    /xed text-stitch-on-surface-variant font-medium">"로컬 커뮤니티/g,
    '<p className="text-sm italic leading-relaxed text-stitch-on-surface-variant font-medium">"로컬 커뮤니티'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed the JSX syntax errors.");
