import sharp from "sharp";
import fs from "fs";

const W = 1200;
const H = 630;

const svg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="72%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#00E5FF" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0c1017" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c1017"/>
      <stop offset="100%" stop-color="#090b0e"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="72" y="248" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="700" fill="#ffffff">ACOPAY</text>
  <text x="72" y="318" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="600" fill="#00E5FF" letter-spacing="8">PAY YOUR WAY</text>
  <text x="72" y="388" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="500" fill="#9ca3af">Solana payment utility · Token-2022</text>
  <text x="72" y="436" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#6b7280">ACOPAY/USDT live on Raydium and Jupiter</text>
  <text x="72" y="560" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" fill="#00E5FF">acopay.net</text>
</svg>`);

const logo = await sharp("public/assets/logo.png")
  .resize(300, 300, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

await sharp(svg)
  .composite([{ input: logo, left: 840, top: 165 }])
  .png({ compressionLevel: 8 })
  .toFile("public/assets/og-image.png");

await sharp("public/assets/og-image.png")
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/assets/og-image.jpg");

const m = await sharp("public/assets/og-image.png").metadata();
console.log("og", m.width, m.height, m.format, fs.statSync("public/assets/og-image.png").size);
