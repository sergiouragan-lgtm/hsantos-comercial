const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "assets", "icons-base64");
const PUBLIC_DIR = path.join(ROOT, "public");

const TARGETS = [
  { src: "icon-192.b64", dest: "icons/icon-192.png" },
  { src: "icon-512.b64", dest: "icons/icon-512.png" },
  { src: "icon-maskable-192.b64", dest: "icons/icon-maskable-192.png" },
  { src: "icon-maskable-512.b64", dest: "icons/icon-maskable-512.png" },
  { src: "apple-touch-icon.b64", dest: "apple-touch-icon.png" },
  { src: "favicon.b64", dest: "favicon.png" },
];

for (const { src, dest } of TARGETS) {
  const srcPath = path.join(SRC_DIR, src);
  const destPath = path.join(PUBLIC_DIR, dest);
  const base64 = fs.readFileSync(srcPath, "utf8").trim();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, Buffer.from(base64, "base64"));
}

console.log(`Generated ${TARGETS.length} icon files in public/`);
