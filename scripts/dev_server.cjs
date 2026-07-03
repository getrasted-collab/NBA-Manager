const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 4173);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function resolveRequest(url) {
  const pathname = decodeURIComponent(new URL(url, `http://127.0.0.1:${PORT}`).pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(ROOT, `.${requested}`);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) return null;
  return filePath;
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequest(request.url || "/");
  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, body) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    response.end(body);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`NBA Manager browser server running at http://127.0.0.1:${PORT}`);
});
