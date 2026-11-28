# Bài tập CSS + JS mỗi ngày

Mỗi ngày một bài ngắn (30–45 phút) kết hợp CSS và JavaScript thuần. Bài 001 dùng CSS thuần. Từ bài 002 trở đi bạn làm bằng Tailwind CSS v4 cài qua npm; riêng lời giải trong `solution/` viết bằng CSS thuần với `style.css` để bạn đối chiếu từng class Tailwind ra thuộc tính CSS nào.

## Cài Tailwind (làm một lần)

Chạy trong thư mục `daily-css-js` (không phải thư mục gốc `Learning-code`):

```powershell
cd D:\VSCODE\Learning-code\daily-css-js
npm init -y
npm install -D tailwindcss @tailwindcss/cli
npm pkg set scripts.dev="tailwindcss -i ./tailwind.css -o ./build/tailwind.css --watch"
```

Trong `daily-css-js` cần có thêm:

- `tailwind.css`: chỉ một dòng `@import "tailwindcss";`, là file gốc Tailwind đọc vào.
- `.gitignore`: hai dòng `node_modules/` và `build/`, để không đưa thư viện và CSS sinh ra lên git.

## Mỗi lần làm bài

1. Mở một cửa sổ PowerShell, chạy `cd D:\VSCODE\Learning-code\daily-css-js` rồi `npm run dev`, để cửa sổ đó chạy suốt lúc làm bài. Tailwind quét các file HTML trong thư mục, gặp class nào thì sinh CSS cho class đó vào `build/tailwind.css`, và tự dựng lại mỗi khi bạn lưu file.
2. Mở `starter/` của bài. `starter/index.html` đã nối sẵn `<link rel="stylesheet" href="../../build/tailwind.css" />`; `script.js` để trống. Bài 001 thì khác: có `style.css` dựng sẵn `:root` và reset.
3. Đọc file `.md` cùng tên với thư mục bài, làm theo phần gợi ý từng bước, tự kiểm tra bằng checklist, rồi mới mở `solution/` hoặc phần "Mã hoàn chỉnh" để đối chiếu.

## Danh sách bài

- [Bài 028: Thẻ đeo hội thảo kính mờ, nghiêng 3D, ánh sáng theo chuột và form xem trước trực tiếp](bai-028-the-deo-hoi-thao/bai-028-the-deo-hoi-thao.md)
- [Bài 027: Vòng quay thực đơn 3D, phép chia dư âm và bộ lọc làm phẳng 3D](bai-027-vong-quay-thuc-don/bai-027-vong-quay-thuc-don.md)
- [Bài 026: Lật thẻ ghép cặp, xáo bài Fisher–Yates và cập nhật thay vì vẽ lại](bai-026-lat-the-ghep-cap/bai-026-lat-the-ghep-cap.md)
- [Bài 025: Ví chi tiêu kính mờ, kính lồng kính và localStorage đồng bộ hai tab](bai-025-vi-chi-tieu-kinh-mo/bai-025-vi-chi-tieu-kinh-mo.md)
- [Bài 024: Phòng thử bóng đổ, nguồn sáng xoay và hai cái bẫy của thanh trượt](bai-024-phong-thu-bong-do/bai-024-phong-thu-bong-do.md)
- [Bài 023: Lịch tập luyện, gradient ba điểm dừng và cái bẫy cuối tháng của Date](bai-023-lich-tap-luyen/bai-023-lich-tap-luyen.md)
- [Bài 022: Sổ công thức, thanh lọc dính, tìm kiếm debounce và hai cái bẫy định vị](bai-022-so-cong-thuc/bai-022-so-cong-thuc.md)
- [Bài 021: Đăng ký thành viên, kiểm tra form bằng validity và cái bẫy setCustomValidity](bai-021-dang-ky-thanh-vien/bai-021-dang-ky-thanh-vien.md)
- [Bài 020: Ghi chú kính mờ, vệt sáng theo con trỏ và localStorage](bai-020-ghi-chu-kinh-mo/bai-020-ghi-chu-kinh-mo.md)
- [Bài 019: Xúc xắc 3D lăn thật và hai cái bẫy dựng khối lập phương](bai-019-xuc-xac-3d/bai-019-xuc-xac-3d.md)
- [Bài 018: Két sắt mã PIN với cánh cửa 3D và bẫy bản lề](bai-018-ket-sat-ma-pin/bai-018-ket-sat-ma-pin.md)
- [Bài 017: Đồng hồ bấm giờ kính mờ và bẫy đếm giờ lệch](bai-017-dong-ho-bam-gio-kinh-mo/bai-017-dong-ho-bam-gio-kinh-mo.md)
- [Bài 016: Bảng việc thẻ dán với `drop-shadow` và bẫy bóng bị cắt](bai-016-bang-viec-the-dan/bai-016-bang-viec-the-dan.md)
- [Bài 015: Vòng tiến độ uống nước bằng `conic-gradient` và bẫy điểm dừng cứng](bai-015-theo-doi-uong-nuoc/bai-015-theo-doi-uong-nuoc.md)
- [Bài 014: Hộp thư với huy hiệu chưa đọc và vạch báo `before:`](bai-014-hop-thu-huy-hieu/bai-014-hop-thu-huy-hieu.md)
- [Bài 013: Đặt bàn nhà hàng với ô chọn giờ kiểu peer và danh sách tự xếp thứ tự](bai-013-dat-ban-nha-hang/bai-013-dat-ban-nha-hang.md)
- [Bài 012: Ví thẻ ảo kính mờ, ánh sáng đổi hướng và sự kiện reset](bai-012-vi-the-anh-sang/bai-012-vi-the-anh-sang.md)
- [Bài 011: Xem căn hộ trên vòng quay 3D](bai-011-xem-can-ho-3d/bai-011-xem-can-ho-3d.md)
- [Bài 010: Thẻ từ vựng lật 3D và phím Space bấm hai lần](bai-010-the-tu-vung-lat/bai-010-the-tu-vung-lat.md)
- [Bài 009: Quiz trên thẻ kính mờ và bẫy lớp nền ẩn](bai-009-quiz-kinh-mo/bai-009-quiz-kinh-mo.md)
- [Bài 008: Kệ đĩa nhạc, bóng đổ màu và hai cái bẫy](bai-008-ke-dia-nhac/bai-008-ke-dia-nhac.md)
- [Bài 007: Thẻ thời tiết đổi màu nền theo thành phố](bai-007-the-thoi-tiet/bai-007-the-thoi-tiet.md)
- [Bài 006: Giỏ hàng có số lượng, chọn món và tổng tiền](bai-006-gio-hang/bai-006-gio-hang.md)
- [Bài 005: Bình luận động và nút xoá trên phần tử vừa tạo](bai-005-binh-luan-dong/bai-005-binh-luan-dong.md)
- [Bài 004: Bảng điểm cuộn hai chiều với tiêu đề và cột đầu dính](bai-004-bang-diem-cot-dinh/bai-004-bang-diem-cot-dinh.md)
- [Bài 003: Hộp thoại xác nhận xoá và bẫy `fixed` trong phần tử bị nhấc](bai-003-hop-thoai-xac-nhan/bai-003-hop-thoai-xac-nhan.md)
- [Bài 002: Menu ba chấm và bẫy stacking context](bai-002-menu-ba-cham/bai-002-menu-ba-cham.md)
- [Bài 001: Thẻ sản phẩm với lớp phủ định vị](bai-001-the-phu-dinh-vi/bai-001-the-phu-dinh-vi.md)
