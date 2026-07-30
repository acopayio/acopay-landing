import fs from "fs";

function replaceAfterTitle(path, title, items) {
  let s = fs.readFileSync(path, "utf8");
  const marker = `m2026Title: "${title}",`;
  const start = s.indexOf(marker);
  if (start < 0) throw new Error("title miss " + title);
  const afterTitle = start + marker.length;
  const endAlt = s.indexOf("m2026Alt:", afterTitle);
  const end27 = s.indexOf("m2027Title:", afterTitle);
  let end = endAlt >= 0 ? endAlt : end27;
  if (end27 >= 0 && (endAlt < 0 || end27 < endAlt)) end = end27;
  const indent = "      ";
  const block =
    marker +
    "\n" +
    `${indent}m2026Item0: "${items[0]}",\n` +
    `${indent}m2026Item1: "${items[1]}",\n` +
    `${indent}m2026Item2: "${items[2]}",\n` +
    `${indent}m2026Item3: "${items[3]}",\n` +
    `${indent}m2026Item4: "${items[4]}",\n`;
  s = s.slice(0, start) + block + s.slice(end);
  fs.writeFileSync(path, s);
  console.log("OK", title);
}

replaceAfterTitle("src/i18n/messages/index.ts", "Lançamento", [
  "ACOPAY Token-2022 na Solana Mainnet",
  "Pool ACOPAY/USDT na Raydium",
  "Comprar ACOPAY (1 USDT = 10 ACOPAY) com USDT em Acopay.net e Telegram Pay",
  "Telegram Pay — envie por @usuário ou endereço de carteira",
  "Associação Phantom e Web Pay (/pay)",
]);

replaceAfterTitle("src/i18n/messages/index.ts", "Peluncuran", [
  "ACOPAY Token-2022 di Solana Mainnet",
  "Pool ACOPAY/USDT di Raydium",
  "Beli ACOPAY (1 USDT = 10 ACOPAY) dengan USDT di Acopay.net dan Telegram Pay",
  "Telegram Pay — kirim lewat @username atau alamat dompet",
  "Tautan Phantom dan Web Pay (/pay)",
]);

// VI sample
const s = fs.readFileSync("src/i18n/messages/index.ts", "utf8");
const i = s.indexOf('m2026Title: "Ra mắt"');
console.log(s.slice(i, i + 420));
