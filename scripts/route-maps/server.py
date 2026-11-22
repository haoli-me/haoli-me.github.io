"""Tiny local server: serves this folder and accepts POST /save/<filename> to write the body to disk (into out/).
CORS is open so a page on strava.com can POST a GPS track here. Local only; stop it when done."""
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
os.makedirs(OUT, exist_ok=True)


class H(SimpleHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Private-Network", "true")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        name = os.path.basename(self.path.split("/save/", 1)[-1]) or "upload.bin"
        n = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(n)
        if body.startswith(b"data:image"):  # data URL -> raw bytes
            import base64
            body = base64.b64decode(body.split(b",", 1)[1])
        with open(os.path.join(OUT, name), "wb") as f:
            f.write(body)
        self.send_response(200)
        self._cors()
        self.end_headers()
        self.wfile.write(b"saved %d bytes" % len(body))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


ThreadingHTTPServer(("127.0.0.1", 8767), H).serve_forever()
