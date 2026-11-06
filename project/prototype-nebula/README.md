# Prototype Sổ khách (Nebula)

Prototype màn **Sổ khách** (danh sách khách + chi tiết khách) dựng bằng component của Nebula RM Platform Design System.

Đây là trang HTML/JS tĩnh: **không cần build, không cần `npm install`**.

## Chạy thủ công

### 1. Chạy server tại thư mục `project/`

Chạy server ở `project/`, **không** chạy ở `prototype-nebula/`. Trang tham chiếu `../styles.css` và `../_ds_bundle.js`, nên server phải phục vụ được thư mục cha.

```powershell
cd d:\Simplize\nebula-rm-platform-design-system\project
python -m http.server 5190
```

Nếu báo cổng 5190 đang bận, đổi sang cổng khác (ví dụ `5191`) rồi dùng cổng đó trong các link bên dưới.

### 2. Mở trình duyệt

```
http://127.0.0.1:5190/prototype-nebula/
```

## Lưu ý

- **Không mở trực tiếp `index.html` bằng double-click** (`file://`). Babel cần tải `app.jsx` qua HTTP, nên mở kiểu này trang sẽ trắng.
- **Cần kết nối mạng.** React, Babel, font Inter và icon Tabler được tải từ CDN.
- **Sau khi sửa code:**
  - Sửa `app.jsx` hoặc `data.js`: nhấn **F5**.
  - Sửa `../_ds_bundle.js`: nhấn **Ctrl+F5** để trình duyệt không dùng bản cũ trong cache.
- **Lỗi** (Babel hoặc runtime) hiện thẳng ở đầu trang, trong khung đỏ.

## Mở thẳng một màn (deep-link)

| Link | Mở ra |
|---|---|
| `#khach-<id>` | Chi tiết khách |
| `#khach-<id>.issues` | Chi tiết khách, tab Vấn đề |
| `#khach-<id>.portfolio` | Chi tiết khách, tab Danh mục |
| `#khach-<id>.history` | Chi tiết khách, tab Hoạt động |
| `#khach-<id>.sol` | Chi tiết khách, mở panel Giải pháp |
| `#khach-<id>.evt` | Chi tiết khách, mở panel Tạo sự kiện |
| `#bulk` | Xử lý theo nhóm (gửi gợi ý cho nhóm Khẩn + Cao) |

Ví dụ: `http://127.0.0.1:5190/prototype-nebula/#bulk`

## Các file

| File | Vai trò |
|---|---|
| `index.html` | Trang chính: nạp CSS, CDN, `_ds_bundle.js`, `data.js`, `app.jsx` |
| `app.jsx` | Lớp giao diện, viết bằng component design system |
| `data.js` | Dữ liệu và logic nghiệp vụ (`window.SK`): sinh khách, đánh giá mức, gợi ý giải pháp |
| `index-v1.html`, `app-v1.jsx` | Bản chi tiết khách trước đó, giữ lại để so sánh |

## Bản gốc để so sánh

Bản gốc viết bằng CSS riêng nằm ở `../prototype-so-khach/`. Với cùng server, mở:

```
http://127.0.0.1:5190/prototype-so-khach/
```
