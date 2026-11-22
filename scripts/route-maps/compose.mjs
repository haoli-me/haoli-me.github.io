// usage: node compose.mjs <run>   (needs out/<run>-map.png, -inset.png, -meta.json and runs/<run>.json; writes out/<run>-final.jpg)
import sharp from "sharp";
import fs from "fs";
import { fileURLToPath } from "url";
const S = fileURLToPath(new URL(".", import.meta.url)).replace(/\/$/, "");
const run = process.argv[2];
const cfg = JSON.parse(fs.readFileSync(`${S}/runs/${run}.json`, "utf8"));
const meta = JSON.parse(fs.readFileSync(`${S}/out/${run}-meta.json`, "utf8"));
const c = cfg.card, W = 3000, H = 2160, M = 48;
const mppCss = 40075016.686 * Math.cos(meta.lat * Math.PI / 180) / (512 * Math.pow(2, meta.zoom));
const kmPx = Math.round(1000 / mppCss * 3);
const font = "PingFang SC, Apple SD Gothic Neo, Hiragino Sans, Helvetica Neue, Arial, sans-serif";
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const lines = [];                       // card text rows
const title = `${c.en} ${c.zh || ""}`.trim();
let y = 108;
const cardW = 1000, cardH = c.note ? 350 : 290;
let svgText = `<text x="44" y="${y}" font-family="${font}" font-size="76" font-weight="700" fill="#1d1d1b">${esc(title)}</text>`;
y += 62;
if (c.note) { svgText += `<text x="46" y="${y}" font-family="${font}" font-size="44" font-weight="600" fill="#1d1d1b">${esc(c.note)}</text>`; y += 60; }
svgText += `<text x="46" y="${y}" font-family="${font}" font-size="44" fill="#4b4a46">${esc(c.date)}</text>`; y += 66;
svgText += `<text x="46" y="${y}" font-family="${font}" font-size="44" font-weight="600" fill="#fc4c02">${esc(c.stats)}</text>`;
const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cardW}" height="${cardH}"><rect x="3" y="3" width="${cardW-6}" height="${cardH-6}" rx="30" fill="#fff" fill-opacity="1" stroke="#000" stroke-opacity="0.08" stroke-width="3"/>${svgText}</svg>`);

const iw = 630, ih = 441, r = 36, b = 10;
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${iw}" height="${ih}"><rect width="${iw}" height="${ih}" rx="${r}" fill="#fff"/></svg>`);
const inset = await sharp(`${S}/out/${run}-inset.png`).resize(iw, ih).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
const border = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${iw+2*b}" height="${ih+2*b}"><rect x="1.5" y="1.5" width="${iw+2*b-3}" height="${ih+2*b-3}" rx="${r+b}" fill="#fff" fill-opacity="1" stroke="#000" stroke-opacity="0.10" stroke-width="3"/></svg>`);
const pillW = kmPx + 120, pillH = 120;
const scale = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${pillW}" height="${pillH}"><rect x="2" y="2" width="${pillW-4}" height="${pillH-4}" rx="30" fill="#fff" fill-opacity="1"/><path d="M60 78 V92 H${60+kmPx} V78" fill="none" stroke="#3c3a36" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="60" y="64" font-family="${font}" font-size="36" font-weight="600" fill="#3c3a36">1 km</text></svg>`);
const credit = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1130" height="78"><rect x="2" y="2" width="1126" height="74" rx="26" fill="#fff" fill-opacity="1"/><text x="565" y="52" text-anchor="middle" font-family="${font}" font-size="34" fill="#4b4a46">© OpenStreetMap contributors · OpenFreeMap</text></svg>`);

const full = await sharp(`${S}/out/${run}-map.png`).composite([
  { input: card, left: M, top: M },
  { input: border, left: W - (iw + 2 * b) - M, top: M },
  { input: inset, left: W - (iw + 2 * b) - M + b, top: M + b },
  { input: scale, left: M, top: H - pillH - M },
  { input: credit, left: W - 1130 - M, top: H - 78 - M },
]).png().toBuffer();
const jpg = await sharp(full).resize(1800).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
fs.writeFileSync(`${S}/out/${run}-final.jpg`, jpg);
console.log(run, jpg.length, "bytes; 1 km =", kmPx, "px; labels:", JSON.stringify(meta.counts));
