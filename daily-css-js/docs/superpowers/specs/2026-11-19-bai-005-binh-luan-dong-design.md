# Thiết kế bài 005: Bình luận động trong blog

## Mục tiêu và phạm vi

Người học vừa hoàn thành bài 003 về hộp xác nhận xoá. Bài 005 nâng mức JavaScript bằng form thêm bình luận, tạo DOM từ mẫu và bắt sự kiện trên danh sách cha. Chủ đề blog là bối cảnh thực hành, không phải yêu cầu xây một website đầy đủ. Thời gian dự kiến 45–60 phút, tuần 1, ngày 5/7, vòng 1, độ khó 4/5.

Người học yêu cầu agent tự chọn bài, tạo luôn, không hỏi duyệt tiếp. Không commit, push, cài gói, sửa bài cũ hoặc sửa các file cấu hình và CSS build.

## Sản phẩm

Thư mục `bai-005-binh-luan-dong/` gồm đề bài trùng tên thư mục, `starter/index.html` có sẵn Tailwind, `starter/script.js` rỗng và ba file lời giải HTML/CSS/JS. Lời giải mở được độc lập, không cần mạng hoặc build. README thêm liên kết và PROGRESS thêm đúng một dòng. AGENTS.md và CLAUDE.md được cập nhật giống nhau để ghi lựa chọn CSS của người học cho các bài tiếp theo.

## Hành vi

1. Trang bắt đầu với hai bình luận mẫu. Form có textarea và nút gửi. Gửi bằng submit phải ngăn tải lại trang.
2. Bỏ khoảng trắng ở hai đầu nội dung. Chuỗi rỗng sau khi bỏ khoảng trắng bị từ chối; hiện lỗi và focus ô nhập. Giới hạn 280 ký tự bằng HTML, không thêm kiểm tra trùng nội dung.
3. Bình luận hợp lệ được tạo từ `template` bằng `content.cloneNode(true)`, ghi nội dung bằng `textContent`, thêm cuối danh sách bằng `append()`, xoá nội dung form bằng `reset()` và focus lại ô nhập. Không dùng innerHTML cho dữ liệu nhập.
4. Một listener click trên danh sách dùng `event.target.closest('[data-delete]')`, rồi tìm bình luận tương ứng để mở hộp xác nhận. Bấm cả chữ và biểu tượng con trong nút đều phải chạy. Không gắn listener riêng cho từng bình luận.
5. Hộp xác nhận hiện đúng nội dung bình luận, có Huỷ, xác nhận, nền tối và Escape. Mở thì khoá main bằng inert, focus Huỷ. Huỷ/nền/Escape trả focus đúng nút đã mở. Bấm chữ bên trong hộp không đóng. Xác nhận xoá li, đóng hộp, focus tiêu đề danh sách.
6. Số đếm và trạng thái rỗng được tính lại sau thêm/xoá. Xoá hết rồi gửi tiếp phải khôi phục danh sách và nút xoá vẫn dùng được. Dùng data-empty trên vùng bình luận để CSS đọc trạng thái.
7. Không lưu dữ liệu. Tải lại trang trở về hai bình luận mẫu. localStorage để bài sau, cookie chưa có trong bài.

## Cấu trúc và trạng thái

HTML dùng main chứa bài viết, vùng bình luận, form và template. Hộp xác nhận là con trực tiếp của body, bên ngoài main. Selector JS chỉ dùng data-*. Mẫu chứa li, article, nội dung và nút xoá có phần tử con để kiểm tra event delegation. Trạng thái JS gồm currentComment và lastTrigger. DOM là nguồn dữ liệu cho bài này, chưa thêm mảng hay render lại toàn bộ trang.

JS dự kiến dưới 100 dòng, các hàm theo trách nhiệm: đồng bộ số đếm/trạng thái rỗng; bật/tắt hộp; mở; đóng; xác nhận xoá; gửi form; xử lý click danh sách. Listener đăng ký một lần. Không comment trong code, không var hoặc arrow function do agent viết.

## CSS và trợ năng

Tailwind cho giao diện quen thuộc được dựng sẵn: layout, màu, nút với cursor-pointer và viền focus, sticky header, fixed overlay, inert và các transition giảm chuyển động. Lời giải có class ngữ nghĩa và style.css tương đương; không dùng :root.

CSS mới giao người học: thêm `whitespace-pre-wrap` và `wrap-anywhere` vào nội dung bình luận có sẵn và nội dung trong template. Hai class giúp giữ xuống dòng và ngắt một chuỗi dài không có khoảng trắng. Starter cố ý thiếu hai class này; đề phải nói rõ đây là phần CSS duy nhất cần tự làm. Bản lời giải có đủ white-space: pre-wrap và overflow-wrap: anywhere.

Textarea có label, mô tả và lỗi qua aria-describedby; lỗi dùng aria-live, aria-invalid. Hộp có role dialog, aria-modal, aria-labelledby và aria-describedby. Tiêu đề danh sách có tabindex -1 để nhận focus sau xoá. Visibility đổi ngay để focus khi mở thành công. CSS có prefers-reduced-motion.

## Tài liệu học

Giữ đủ thứ tự mục trong AGENTS.md. Giải thích mọi hàm, phương thức, thuộc tính, toán tử và tham số mới. Nêu rõ target khác currentTarget; cloneNode(true) sao chép cả con nhưng không sao chép listener gắn bằng addEventListener; querySelectorAll trả danh sách tĩnh; length là thuộc tính; append không nhận selector; reset không xoá bình luận. Các khối mã hoàn chỉnh phải được sinh bằng cách đọc ba file solution. Có nguồn tham khảo chính thức, ghi rõ đây là bài được biên soạn theo trình độ người học.

## Kiểm chứng

Kiểm tra cấu trúc, starter JS rỗng, không comment/arrow/var, lời giải không nạp Tailwind, JS hợp lệ và các khối tài liệu trùng file nguồn. Chạy lời giải trên HTTP: gửi bằng chuột/bàn phím; nội dung rỗng và chỉ khoảng trắng; nội dung giống HTML chỉ thành chữ; tạo rồi xoá bình luận mới; bấm biểu tượng con; Huỷ/Escape/nền/focus; xoá hết và thêm lại; đếm đúng; reduced motion; mobile không tràn; xuống dòng và chuỗi dài. Kiểm tra cùng solution JS trên một bản Tailwind tạm ngoài daily-css-js, thêm hai class bài tập ở bản tạm. Không ghi vào build thật. Tắt server sau thử.
