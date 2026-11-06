# Cách chạy dự án

Dự án là HTML/JS tĩnh: **không cần build, không cần `npm install`**. Chỉ cần Python (để chạy web server) và kết nối mạng (để tải React, Babel, font, icon từ CDN).

## Chạy nhanh

- **Windows:** double-click `run.bat` (ở thư mục gốc), hoặc chạy `run.bat` trong terminal.
- **Git Bash / macOS / Linux:** `./run.sh`

Script tự chạy server ở cổng 5190 và mở trình duyệt. Nếu server đã chạy sẵn thì script chỉ mở trình duyệt. Muốn dùng cổng khác thì truyền số cổng vào, ví dụ `run.bat 5191` hoặc `./run.sh 5191`.

Muốn chạy tay từng bước thì làm theo phần dưới.

## 1. Chạy server

Mở terminal và chạy server **tại thư mục `project/`**:

```powershell
cd d:\Simplize\nebula-rm-platform-design-system\project
python -m http.server 5190
```

> Phải chạy ở `project/`, không chạy ở thư mục con, vì các trang tham chiếu `../styles.css` và `../_ds_bundle.js`.
>
> Nếu cổng 5190 đang bận, dùng cổng khác (ví dụ `python -m http.server 5191`) và đổi cổng trong các link bên dưới.

Muốn dừng server: nhấn **Ctrl+C** trong terminal đó.

## 2. Mở trình duyệt

| Trang | Link |
|---|---|
| Sổ khách (bản Nebula) | http://127.0.0.1:5190/prototype-nebula/ |
| Sổ khách (bản gốc) | http://127.0.0.1:5190/prototype-so-khach/ |

## 3. Mở thẳng một màn (deep-link)

Thêm vào cuối link bản Nebula:

| Thêm | Mở ra |
|---|---|
| `#khach-<id>` | Chi tiết khách |
| `#khach-<id>.issues` | Tab Vấn đề |
| `#khach-<id>.portfolio` | Tab Danh mục |
| `#khach-<id>.history` | Tab Hoạt động |
| `#khach-<id>.sol` | Panel Giải pháp |
| `#khach-<id>.evt` | Panel Tạo sự kiện |
| `#bulk` | Xử lý theo nhóm |

Ví dụ: http://127.0.0.1:5190/prototype-nebula/#bulk

## Lưu ý

- **Không mở `index.html` bằng double-click** (`file://`). Babel cần tải `app.jsx` qua HTTP, nên mở kiểu này trang sẽ trắng.
- **Sau khi sửa code:**
  - Sửa `app.jsx` hoặc `data.js`: nhấn **F5**.
  - Sửa `_ds_bundle.js`: nhấn **Ctrl+F5** để không bị dùng bản cũ trong cache.
- **Lỗi** (Babel hoặc runtime) hiện ngay đầu trang, trong khung đỏ.
