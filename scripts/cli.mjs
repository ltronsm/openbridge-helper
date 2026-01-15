#!/usr/bin/env node

import { parseArgs } from 'node:util';
import fs from 'fs';
import generateExports from './generate-exports.mjs';

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    refresh: { type: 'boolean', short: 'r' },
    help: { type: 'boolean', short: 'h' },
  },
});

if (values.help) {
  console.log(`
openbridge-helper CLI

Usage:
  npx openbridge-helper              Generate OpenBridge exports (if not already generated)
  npx openbridge-helper --refresh     Force regenerate exports
  npx openbridge-helper --help        Show this help

Examples:
  npx openbridge-helper
  npx openbridge-helper -r
`);
  process.exit(0);
}

// Check if exports are already generated
function areExportsGenerated() {
  const iconFile = 'src/generated/icons.ts';
  const compFile = 'src/generated/components.ts';

  if (!fs.existsSync(iconFile) || !fs.existsSync(compFile)) {
    return false;
  }

  const iconContent = fs.readFileSync(iconFile, 'utf8');
  const compContent = fs.readFileSync(compFile, 'utf8');

  // Check if more than placeholder
  const hasIcons = iconContent.includes('export { Obi') && !iconContent.includes('Placeholder');
  const hasComps = compContent.includes('export { Obc') && !compContent.includes('Placeholder');

  return hasIcons || hasComps;
}

if (areExportsGenerated() && !values.refresh) {
  console.error(`
❌ OpenBridge exports are already generated.

If you want to regenerate (e.g., after updating OpenBridge), use:
  npx openbridge-helper --refresh

Or manually delete src/generated/*.ts and run again.
`);
  process.exit(1);
}

try {
  await generateExports();
  console.log('✅ OpenBridge exports generated successfully!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}