import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import "./build.mjs";

const root = path.resolve(import.meta.dirname, "../dist");
const port = Number(process.env.PORT || 4173);
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".webp":"image/webp", ".svg":"image/svg+xml", ".ttf":"font/ttf" };

http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    let file = path.resolve(root, relative);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) throw new Error("Forbidden");
    const stat = await fs.stat(file);
    if (stat.isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(301, { Location: `${url.pathname}/${url.search}` });
        response.end();
        return;
      }
      file = path.join(file, "index.html");
    }
    const body = await fs.readFile(file);
    response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control":"no-cache" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404, { "Content-Type":"text/plain; charset=utf-8" });
    response.end("404 | Page not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`URBAN RIDER TOKYO TYPE4: http://127.0.0.1:${port}`));
