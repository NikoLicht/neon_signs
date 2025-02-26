import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const port = 8000;

Deno.serve({ port }, async (req) => {
  const url = new URL(req.url);
  const filePath = `.${url.pathname}`;

  // Handle .ts files separately
  if (filePath.endsWith(".ts")) {
    try {
      const file = await Deno.readFile(filePath);
      return new Response(file, {
        status: 200,
        headers: new Headers({
          "Content-Type": "application/javascript", // Fix MIME type
        }),
      });
    } catch {
      return new Response("File not found", { status: 404 });
    }
  }

  // Default: Serve files normally
  return serveDir(req, { fsRoot: ".", showIndex: true });
});

console.log(`Server running at http://localhost:${port}`);
