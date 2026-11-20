# Kế hoạch triển khai bài 005: Bình luận động

> **Dành cho agent thực hiện:** Dùng skill `superpowers:executing-plans` để triển khai từng bước. Người học đã yêu cầu tạo luôn; không hỏi chọn cách thực hiện, không commit hoặc push.

**Mục tiêu:** Tạo bài tập bình luận động giúp người học thực hành form, tạo DOM và event delegation, có sẵn CSS quen thuộc.

**Kiến trúc:** DOM là nguồn dữ liệu. HTML có template để tạo li mới; một listener trên danh sách xử lý nút xoá của cả bình luận cũ và mới. Hộp xác nhận tái sử dụng cách quản lý trạng thái và focus của bài 003.

**Công nghệ:** HTML, JavaScript thuần, Tailwind v4 trong starter và CSS thuần trong solution. Không cài thêm phụ thuộc.

## 1. Hướng dẫn và khung bài

- [x] Cập nhật `D:/VSCODE/Learning-code/daily-css-js/AGENTS.md` và `CLAUDE.md` giống nhau: CSS quen thuộc dựng sẵn, CSS mới để người học làm với chỉ dẫn rõ, ưu tiên học JS với ví dụ đa lĩnh vực. Chỉnh quy tắc starter và kiểm tra tương ứng; không sửa bài cũ.
- [x] Tạo `D:/VSCODE/Learning-code/daily-css-js/bai-005-binh-luan-dong/starter/index.html` và script.js rỗng. HTML có đủ data/aria/id/template và Tailwind, chỉ thiếu hai class CSS mới được giao trong đề.
- [x] Tạo ba file trong `D:/VSCODE/Learning-code/daily-css-js/bai-005-binh-luan-dong/solution/`: HTML tương ứng, style.css và script.js theo thiết kế đã chốt.

## 2. Tài liệu và điều hướng

- [x] Viết `D:/VSCODE/Learning-code/daily-css-js/bai-005-binh-luan-dong/bai-005-binh-luan-dong.md` đủ các mục theo hướng dẫn, gợi ý 7–8 bước, giải thích API và cái bẫy thẻ động.
- [x] Dùng script đọc ba file solution để chèn các khối html/css/js vào đề. Không sao chép thủ công.
- [x] Thêm một dòng đầu danh sách bài trong README và một dòng cuối PROGRESS với ngày 2026-11-19.

## 3. Kiểm tra tĩnh

- [x] `node --check bai-005-binh-luan-dong/solution/script.js` phải thành công.
- [x] Script kiểm tra starter JS rỗng, HTML hai bản cùng cấu trúc ngoài class/link CSS, selectors có đủ, khối md khớp file nguồn, hai hướng dẫn giống nhau, solution không Tailwind/CDN, không có comment/var/arrow.
- [x] Xác nhận không sửa package.json, lock, input CSS, ignore, build hoặc bài cũ. Không chạy npm install/init.

## 4. Kiểm tra trình duyệt

- [x] Chạy server HTTP 127.0.0.1 phục vụ daily-css-js và kiểm tra lời giải bằng Playwright. Nếu cần, đọc các trường hợp trong thiết kế ở docs/superpowers/specs/2026-11-19-bai-005-binh-luan-dong-design.md.
- [x] Thử 2 bình luận ban đầu, gửi rỗng/chỉ khoảng trắng, gửi nhiều dòng, HTML thành chữ, thêm động rồi xoá qua biểu tượng, Huỷ/nền/Escape/focus, xoá hết rồi thêm, đếm, phím Tab và reduced motion.
- [x] Chạy CLI Tailwind có sẵn với output ở thư mục tạm ngoài daily-css-js; bản HTML tạm thêm hai class cần tự học và dùng cùng JS lời giải. Kiểm tra giao diện/luồng trên desktop và 375px.
- [x] Tắt server, cập nhật trạng thái checklist và báo đường dẫn đề bài, phần JS/CSS mới, kết quả kiểm tra. Nêu rõ bài chưa dùng lưu trữ.

## Kết quả thực hiện

- Thiết kế và kế hoạch đã được reviewer chấp thuận; rà soát cuối bài cũng chấp thuận, không có lỗi chặn.
- Kiểm tra tĩnh đạt: JS hợp lệ, 92 dòng, starter JS rỗng, HTML hai bản đồng cấu, không comment/arrow/var trong code, các khối Markdown khớp chính xác, AGENTS và CLAUDE giống nhau.
- Trình duyệt đạt 24 nhóm kiểm tra cho CSS thuần và 24 nhóm cho bản Tailwind tạm; không có lỗi JavaScript. Bao gồm thêm/rỗng/HTML thuần, delegation qua span, Huỷ/Escape/nền/focus, xoá hết và thêm lại, bàn phím, reduced motion và mobile 375px.
- Hai bản có cùng chiều rộng trang 672px, ô nhập 624px, tiêu đề 30px và line-height 37.5px ở viewport desktop.
- Quyết định: tạo và chạy thử trong workspace hiện tại theo yêu cầu tạo bài tại đây, không tạo worktree hoặc commit. CSS Tailwind thử nghiệm chỉ xuất ra thư mục tạm, không ghi build thật.
