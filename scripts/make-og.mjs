// Generates public/og.png (1200x630 default link-preview image).
// Run: node scripts/make-og.mjs
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#fbfaf8"/>
  <text x="100" y="330" font-family="PingFang SC, Helvetica, Arial, sans-serif" font-size="96" font-weight="600" fill="#1d1d1b">Hao Li 李昊</text>
  <text x="104" y="410" font-family="PingFang SC, Helvetica, Arial, sans-serif" font-size="38" fill="#706d66">Writing and notes</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('wrote public/og.png');
