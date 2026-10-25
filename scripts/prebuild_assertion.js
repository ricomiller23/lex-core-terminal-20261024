/**
 * Mandatory Pre-Build Assertion Script
 * Enforces Standing Rules A-I & Rules 9, 11, 12, 17, 18, 20
 */

const fs = require('fs');
const path = require('path');

console.log('=== [LEX-CORE PREBUILD ASSERTION RUNNER] ===');
let errors = 0;

// 1. Check for banned words in JSX/TSX
const BANNED_PATTERNS = [
  /\bverified\b/i,
  /\bcertified\b/i,
  /100%/,
  /\bexhaustive\b/i,
  /\bparity\b/i,
  /\baccurate\b/i
];

function checkDirectoryForBannedWords(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      checkDirectoryForBannedWords(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of BANNED_PATTERNS) {
        if (pattern.test(content)) {
          // Ignore prebuild script itself if scanned
          if (entry.name === 'prebuild_assertion.js') continue;
          console.error(`[FAIL] Banned word match in ${fullPath}: ${pattern}`);
          errors++;
        }
      }
    }
  }
}

console.log('1. Scanning components & app for banned unearned claims...');
checkDirectoryForBannedWords(path.join(__dirname, '../components'));
checkDirectoryForBannedWords(path.join(__dirname, '../app'));

// 2. Validate Dataset Primary Receipts (source_url & retrieved_at)
console.log('2. Validating primary receipts in datasets...');
const dataFiles = [
  '../data/authoritative_cases.json',
  '../data/clinical_matters.json',
  '../data/contract_clauses.json'
];

for (const relPath of dataFiles) {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Dataset file missing: ${fullPath}`);
    errors++;
    continue;
  }
  const items = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  items.forEach((item, idx) => {
    if (!item.source_url || !item.source_url.startsWith('http')) {
      console.error(`[FAIL] Item ${idx} in ${relPath} missing valid http source_url: ${item.id}`);
      errors++;
    }
    if (!item.retrieved_at) {
      console.error(`[FAIL] Item ${idx} in ${relPath} missing retrieved_at timestamp: ${item.id}`);
      errors++;
    }
  });
}

// 3. Validate Dynamic Dates (No static decaying dates)
console.log('3. Validating dynamic runtime date handling...');
const clinicalMatters = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/clinical_matters.json'), 'utf8'));
clinicalMatters.forEach(matter => {
  const solTime = new Date(matter.statute_of_limitations_date).getTime();
  if (isNaN(solTime)) {
    console.error(`[FAIL] Invalid SOL date format: ${matter.statute_of_limitations_date}`);
    errors++;
  }
});

// Final Result
if (errors > 0) {
  console.error(`\n[PREBUILD FAILURE] Total assertion failures: ${errors}`);
  process.exit(1);
} else {
  console.log('\n[PREBUILD SUCCESS] All 3 verification gates passed without error.');
  process.exit(0);
}
