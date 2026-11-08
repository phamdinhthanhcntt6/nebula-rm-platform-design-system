"""Chạy prototype không cache (chạy từ thư mục project/):
  python prototype-nebula/serve.py            → chỉ máy này:   http://127.0.0.1:5190/prototype-nebula/
  python prototype-nebula/serve.py 5190 lan   → cả mạng LAN:  http://<IP máy này>:5190/prototype-nebula/
Mỗi lần sửa app.jsx chỉ cần F5, không bị dính bản cũ."""
import http.server, functools, os, sys, socket

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # thư mục project/
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5190
LAN = len(sys.argv) > 2 and sys.argv[2] == 'lan'
HOST = '0.0.0.0' if LAN else '127.0.0.1'

def lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(('8.8.8.8', 80)); ip = s.getsockname()[0]; s.close(); return ip
    except OSError:
        return socket.gethostbyname(socket.gethostname())

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    handler = functools.partial(NoCache, directory=ROOT)
    with http.server.ThreadingHTTPServer((HOST, PORT), handler) as httpd:
        print('May nay:   http://127.0.0.1:%d/prototype-nebula/' % PORT, flush=True)
        if LAN:
            print('Cung mang: http://%s:%d/prototype-nebula/' % (lan_ip(), PORT), flush=True)
        httpd.serve_forever()
