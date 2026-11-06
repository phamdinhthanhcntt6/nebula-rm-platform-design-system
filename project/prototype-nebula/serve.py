"""Chạy prototype không cache: python prototype-nebula/serve.py  (chạy từ thư mục project/)
Mở http://127.0.0.1:5190/prototype-nebula/ — mỗi lần sửa app.jsx chỉ cần F5, không bị dính bản cũ."""
import http.server, functools, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # thư mục project/
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5190

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    handler = functools.partial(NoCache, directory=ROOT)
    with http.server.ThreadingHTTPServer(('127.0.0.1', PORT), handler) as httpd:
        print('Serving', ROOT, 'at http://127.0.0.1:%d/prototype-nebula/ (no-cache)' % PORT, flush=True)
        httpd.serve_forever()
