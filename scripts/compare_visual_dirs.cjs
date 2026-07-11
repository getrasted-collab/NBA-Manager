const { app, nativeImage } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const [beforeDir, afterDir] = process.argv.slice(2).map((value) => path.resolve(value));
if (!beforeDir || !afterDir) throw new Error("Usage: electron scripts/compare_visual_dirs.cjs <before-dir> <after-dir>");

app.whenReady().then(() => {
  const names = fs.readdirSync(beforeDir).filter((name) => name.endsWith(".png")).sort();
  let worst = 0;
  for (const name of names) {
    const before = nativeImage.createFromPath(path.join(beforeDir, name));
    const after = nativeImage.createFromPath(path.join(afterDir, name));
    const a = before.toBitmap();
    const b = after.toBitmap();
    if (a.length !== b.length) throw new Error(`${name}: image dimensions differ`);
    let changed = 0;
    for (let offset = 0; offset < a.length; offset += 4) {
      if (a[offset] !== b[offset] || a[offset + 1] !== b[offset + 1] || a[offset + 2] !== b[offset + 2]) changed++;
    }
    const percent = changed / (a.length / 4) * 100;
    worst = Math.max(worst, percent);
    console.log(`${name}: ${percent.toFixed(4)}%`);
  }
  console.log(`worst=${worst.toFixed(4)}%`);
  app.quit();
});
