#!/usr/bin/env bash
# Chạy nhanh prototype Sổ khách: ./run.sh [cổng]
set -e
PORT="${1:-5190}"
URL="http://127.0.0.1:$PORT/prototype-nebula/"

cd "$(dirname "$0")/project"

open_browser() {
  case "$(uname -s)" in
    Darwin) open "$URL" ;;
    MINGW*|MSYS*|CYGWIN*) start "" "$URL" ;;
    *) xdg-open "$URL" >/dev/null 2>&1 || true ;;
  esac
}

# Server đã chạy sẵn ở cổng này -> chỉ mở trình duyệt
if curl -s -o /dev/null "http://127.0.0.1:$PORT/"; then
  echo "Server đã chạy sẵn ở cổng $PORT. Mở $URL"
  open_browser
  exit 0
fi

PY=$(command -v python3 || command -v python || command -v py || true)
if [ -z "$PY" ]; then
  echo "Không tìm thấy Python. Cài tại https://www.python.org/downloads/ rồi chạy lại."
  exit 1
fi

echo "Đang chạy server tại $URL"
echo "Nhấn Ctrl+C để dừng."
(sleep 1 && open_browser) &
exec "$PY" -m http.server "$PORT"
