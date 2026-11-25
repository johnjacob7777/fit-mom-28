import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const videosDir = path.join(root, "public", "videos");
const outFile = path.join(root, "src", "lib", "uploadedVideos.generated.json");

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const allowedExts = new Set([".mp4", ".webm", ".mov"]);
const manifest = {};

for (const entry of fs.readdirSync(videosDir, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const ext = path.extname(entry.name).toLowerCase();
  if (!allowedExts.has(ext)) continue;
  const slug = path.basename(entry.name, ext).toLowerCase();
  manifest[slug] = `/videos/${entry.name}`;
}

fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`[sync-videos] Indexed ${Object.keys(manifest).length} exercise video(s).`);
