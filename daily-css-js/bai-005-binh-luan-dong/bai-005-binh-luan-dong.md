# Bài 005: Bình luận động và nút xoá trên phần tử vừa tạo

Tuần 1, ngày 5/7, vòng 1, độ khó ★★★★☆, thời gian ước tính 45–60 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Giao diện **Tailwind CSS v4 đã dựng sẵn**, bạn tập trung làm JavaScript trong `starter/script.js` đang rỗng. Chỉ có hai class CSS mới dành cho bạn tự thêm, được chỉ rõ bên dưới. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở độc lập không cần mạng hoặc build.
>
> **Lưu dữ liệu:** bài này chưa dùng `localStorage`, cookie hay server. Tải lại trang sẽ mất bình luận bạn thêm và trở về hai bình luận mẫu. Đây là hành vi đúng của bài.

## Mục tiêu

- Gửi bình luận bằng form, không tải lại trang; từ chối nội dung rỗng hoặc chỉ có khoảng trắng. Bình luận hợp lệ được thêm cuối danh sách, ô nhập được xoá và nhận lại focus.
- Tạo bình luận bằng mẫu `<template>`. Gõ nội dung giống thẻ HTML thì trang phải hiện nguyên văn nội dung ấy.
- Nút xoá của bình luận có sẵn và bình luận vừa tạo đều mở đúng hộp xác nhận, kể cả khi bấm dấu `×` bên trong nút. Chỉ dùng **một listener click trên danh sách** để xử lý các nút này.
- Huỷ, click nền tối và Escape đóng hộp rồi trả focus đúng nút đã mở. Xác nhận xoá đúng bình luận, cập nhật số đếm và focus tiêu đề; xoá hết thì hiện trạng thái rỗng, thêm lại thì trạng thái rỗng biến mất.
- Tự thêm hai class xử lý nội dung nhiều dòng và chuỗi dài; kiểm tra bàn phím và chế độ giảm chuyển động.

## Kết quả mong đợi

Trang blog “Góc đọc” có một đoạn bài viết, form bình luận và hai bình luận mẫu. Phần bố cục, màu, khoảng cách, nút và hộp thoại đã có sẵn trong starter. Bạn điền “Mình thường đọc vào buổi sáng”, bấm “Gửi bình luận”: một mục mới dưới tên “Bạn” xuất hiện, số đếm từ 2 thành 3, ô nhập trống và có focus.

Bấm dấu `×` trên mục vừa thêm: hộp thoại hiện đúng nội dung ấy. Bấm Huỷ thì danh sách vẫn có 3 mục; xác nhận xoá thì còn 2. Xoá hết, trang hiện “Chưa có bình luận”. Sau đó vẫn gửi và xoá bình luận mới được bình thường.

### CSS mới: bạn tự làm phần này

Thêm **cả hai class** `whitespace-pre-wrap wrap-anywhere` vào mọi phần tử `[data-comment-text]`: hai đoạn bình luận mẫu và đoạn rỗng trong `<template data-template>`. Những phần CSS khác đã dựng sẵn, không cần viết lại.

- `whitespace-pre-wrap` tạo `white-space: pre-wrap`: giữ dấu xuống dòng và khoảng trắng trong nội dung, đồng thời cho chữ tự xuống dòng khi hết chiều rộng. `textContent` giữ ký tự xuống dòng trong DOM nhưng CSS mặc định có thể hiển thị chúng như khoảng trắng.
- `wrap-anywhere` tạo `overflow-wrap: anywhere`: khi một chuỗi quá dài không có khoảng trắng, trình duyệt được ngắt nó để không đẩy nội dung tràn khỏi cột. Đây không phải `overflow-hidden`: nội dung vẫn được hiển thị đầy đủ.
- Trong hộp xác nhận, phần trích bình luận `[data-dialog-text]` đã có sẵn hai class để bạn thấy kết quả đối chiếu.

Kiểm tra sau khi làm JS: gửi một bình luận có hai dòng và một bình luận gồm 200 chữ `a` liền nhau. Hai dòng phải giữ riêng, chuỗi dài phải nằm gọn trong cột ở màn hình 375px. Nếu bạn chỉ thêm class vào các bình luận mẫu mà quên template thì các bình luận mới vẫn lỗi.

## Tư duy

**Bẫy chính: phần tử mới chưa từng được gắn sự kiện.** Bài 003 có sẵn mọi thẻ ngay từ đầu, nên lặp từng nút để gắn click vẫn chạy. Bài này tạo bình luận sau khi trang đã tải. Một danh sách lấy bằng `querySelectorAll` không tự nhận các nút được thêm sau đó. Listener gắn trên nút cũ cũng không tự truyền sang nút mới.

Ta đặt một người trực ở cửa chung: gắn click lên `[data-list]`. Click trong một bình luận nổi bọt lên danh sách. Dùng `event.target` để biết người dùng bấm ở đâu, rồi dùng `closest('[data-delete]')` tìm nút xoá bao quanh chỗ bấm. Nếu không tìm thấy nút, bỏ qua. Cách này gọi là **event delegation**, tức giao việc xử lý sự kiện cho phần tử cha.

**Vì sao không kiểm tra trực tiếp `event.target` có phải nút?** Nút có hai phần tử con: dấu `×` và chữ “Xoá”. Khi bấm dấu `×`, target là `span`, không phải `button`. `closest` kiểm tra từ chính target rồi đi lên, nên vẫn tìm được nút bao ngoài.

**`template` là khuôn, không phải bình luận đang hiện.** HTML trong `template` chưa được vẽ. Mỗi lần gửi, sao chép phần `content` của khuôn bằng `cloneNode(true)`, điền nội dung rồi đưa bản sao vào danh sách. Tham số `true` có nghĩa sao chép cả cây con. Không đưa thẳng `template.content` vào danh sách: thao tác thêm sẽ chuyển các nút con khỏi khuôn, khiến lần sau không còn nguyên liệu.

**DOM đang là nguồn dữ liệu của bài.** Bạn chưa cần mảng hay object để chứa mọi bình luận. Cần đếm thì truy vấn lại phần tử trong danh sách; cần xoá thì giữ tham chiếu tới bình luận đang chọn. Sau này mới chuyển sang lưu mảng, `localStorage` và dữ liệu từ API.

**Nội dung nhập là chữ.** Ghi bằng `textContent` để nội dung như `<b>Xin chào</b>` xuất hiện nguyên văn. Không đưa nội dung người dùng vào `innerHTML`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Bố cục, màu, viền focus, con trỏ nút đã dựng sẵn | Nghe submit form, đọc và kiểm tra nội dung |
| Giữ xuống dòng và ngắt chuỗi dài: bạn thêm hai class mới | Sao chép mẫu, ghi chữ, thêm bình luận |
| Ẩn/hiện trạng thái rỗng theo `data-empty` | Đếm lại danh sách rồi bật/tắt `data-empty` |
| Hiện hộp và hiệu ứng theo `data-open`, giảm chuyển động | Nhớ bình luận/nút đã bấm, bật `inert`, xoá và trả focus |
| Viền đỏ ô nhập theo `aria-invalid` | Ghi lỗi và đổi giá trị `aria-invalid` |

JS không thêm/gỡ từng class giao diện, không đặt `style.display`, không tự tính vị trí hộp. JS chỉ ghi trạng thái, chữ và cấu trúc DOM cần cho bình luận mới.

## Ôn lại

- Bài 001 (`bai-001-the-phu-dinh-vi`): phần tử ẩn bằng `visibility` không nhận focus; Escape; chuyển động giảm theo thiết lập hệ thống.
- Bài 002 (`bai-002-menu-ba-cham`): `closest`, `event.target`, click nổi bọt, `toggleAttribute(name, force)` và trả focus.
- Bài 003 (`bai-003-hop-thoai-xac-nhan`): hộp `fixed` ngoài main, `inert`, `textContent`, nhớ thẻ đang chọn, xoá `li`, rồi focus tiêu đề.

## Gợi ý từng bước

1. **Quan sát HTML và làm phần CSS mới.** Thêm `whitespace-pre-wrap wrap-anywhere` vào ba vị trí `[data-comment-text]`, gồm cả vị trí trong template. Không sửa các class còn lại. Hiện tại bấm gửi chưa chạy vì JS còn trống. Đọc `data-list`, `data-template`, `data-form`, `data-input`, `data-error`, `data-count` và `data-thread` để hình dung vai trò từng vùng.

2. **Chọn phần tử, viết hàm đồng bộ.** Dùng selector `data-*`, không dùng class Tailwind. Hàm đồng bộ lấy số `[data-comment]` bên trong `[data-list]`, ghi vào `[data-count]`, và bật `data-empty` trên `[data-thread]` khi số lượng bằng 0. `querySelectorAll` trả danh sách, `.length` đọc số lượng; `String` đổi số sang chuỗi. `toggleAttribute` với tham số thứ hai `true` luôn thêm thuộc tính, `false` luôn gỡ. Gọi hàm này một lần khi tải trang. Kiểm tra: số ban đầu là 2, thông báo rỗng đang ẩn.

3. **Bắt submit và chặn nội dung rỗng.** Gắn listener lên form với sự kiện `submit`, không chỉ click nút. Trong hàm nhận `event`, gọi `preventDefault()` để ngăn form tải lại trang. Đọc `.value` của ô nhập và dùng `.trim()` bỏ khoảng trắng ở hai đầu. Nếu kết quả là chuỗi rỗng thì ghi lỗi, đặt `aria-invalid` thành chuỗi `'true'`, focus ô nhập rồi `return` để dừng hàm. Kiểm tra: gửi ô trống hoặc chỉ dấu cách không làm tăng số đếm.

4. **Tạo bình luận từ khuôn.** Khi dữ liệu hợp lệ, lấy `template.content.cloneNode(true)`, tìm `[data-comment-text]` trong bản sao, điền bằng `textContent`, rồi `append` bản sao vào danh sách. `content` là phần nội dung của template; `cloneNode(true)` trả một bản sao có cả con; `append` đưa nó vào cuối danh sách. Sau đó `form.reset()` đưa form về giá trị mặc định, xoá chữ lỗi, đặt `aria-invalid` về `'false'`, đồng bộ số đếm và focus ô nhập. Kiểm tra: gửi hai lần có hai bình luận độc lập, mẫu vẫn dùng lại được. Gửi `<b>Xin chào</b>` phải thấy cả ký tự `<` và `>`.

5. **Gặp bẫy nút mới và sửa bằng event delegation.** Thử suy luận theo bài 003: nếu chỉ lấy mọi nút xoá lúc tải trang rồi gắn click từng nút, bình luận mới có được gắn không? Có thể thử cách đó để thấy bình luận mẫu chạy nhưng bình luận mới không chạy, rồi bỏ listener cũ. Cách dùng trong bài: gắn **một** listener click lên `[data-list]`; trong hàm lấy `event.target.closest('[data-delete]')`. Không tìm thấy nút thì `return`; tìm thấy thì dùng `button.closest('[data-comment]')` lấy bình luận. Kiểm tra cả bấm dấu `×`, chữ “Xoá”, lẫn bấm nội dung bình luận. Chỉ hai cách đầu mới mở hộp.

6. **Tái dùng hộp xác nhận của bài 003.** Dùng hai biến `let`: một biến nhớ bình luận đang chọn, một biến nhớ nút đã bấm. Hàm mở nhận hai phần tử này, ghi nội dung bình luận vào `[data-dialog-text]`, bật `data-open`, bật `inert` trên main rồi focus Huỷ. Hàm đóng gỡ trạng thái trước, trả focus về nút đã mở, rồi đặt hai biến về `null`. Listener Huỷ và nền tối cùng gọi hàm đóng; Escape chỉ gọi khi hộp đang có `data-open`. Đăng ký các listener này một lần, bên ngoài hàm mở.

7. **Xoá và đồng bộ.** Nút xác nhận tìm `li` gần nhất của bình luận đang nhớ rồi `remove()`. Gọi lại hàm đồng bộ, đóng trạng thái bằng hàm bật/tắt hộp, focus `[data-heading]`, rồi xoá tham chiếu. Không gọi hàm Huỷ sau xoá vì nút cần trả focus đã biến mất. Kiểm tra: xoá đúng bình luận vừa thêm, xoá hết rồi gửi tiếp vẫn chạy, số đếm luôn đúng.

8. **Thử bàn phím và nội dung khó.** Trong textarea, Enter tạo dòng mới; dùng Tab tới nút gửi rồi Enter để submit. Thử nhiều dòng, 200 chữ liền nhau, click phần tử con trong nút, mở A rồi Huỷ rồi xoá B. Kiểm tra không có lỗi trong Console, không nhân đôi listener và không gửi hai bản cho một lần submit. Bật reduced motion: hộp mở tức thì, nút Huỷ vẫn nhận focus.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương | Phần cần làm |
|---|---|---|
| `whitespace-pre-wrap` | `white-space: pre-wrap` | Bạn thêm vào nội dung bình luận |
| `wrap-anywhere` | `overflow-wrap: anywhere` | Bạn thêm vào nội dung bình luận |
| `hidden group-data-empty:block` | Ẩn mặc định; `.thread[data-empty] .empty-message { display: block; }` | Đã dựng sẵn |
| `aria-invalid:border-rose-600` | `[aria-invalid='true'] { border-color: #e11d48; }` | Đã dựng sẵn |
| `sticky top-0 z-10` | `position: sticky; top: 0; z-index: 10` | Ôn bài 003, đã dựng sẵn |
| `fixed inset-0 z-50` | `position: fixed; inset: 0; z-index: 50` | Đã dựng sẵn |
| `data-open:visible data-open:opacity-100` | Hộp có `data-open` thì hiện | Đã dựng sẵn |
| `translate-y-2 group-data-open:translate-y-0` | Hộp trắng đổi `translate` từ `0 8px` về `0 0` | Đã dựng sẵn |
| `transition-opacity`, `transition-[translate]` | Chỉ chuyển động opacity hoặc translate, visibility đổi ngay | Đã dựng sẵn |
| `motion-reduce:transition-none` | Trong media giảm chuyển động, `transition: none` | Đã dựng sẵn |

## Tự kiểm tra

- [x] Ban đầu có 2 bình luận, số đếm đúng, thông báo rỗng ẩn.
- [x] Gửi rỗng hoặc chỉ khoảng trắng: hiện lỗi, focus ô nhập, không thêm bình luận, không tải lại trang.
- [ ] Gửi hợp lệ: thêm cuối danh sách đúng một mục, ô nhập trống và có focus, lỗi cũ được xoá.
- [ ] Gửi `<b>Xin chào</b>`: hiện nguyên văn, không tạo thẻ `b` mới.
- [ ] Gửi nhiều lần: mọi bình luận có nội dung riêng, mẫu không bị hết.
- [ ] Click dấu `×` hoặc chữ “Xoá” trên bình luận mới: đều mở đúng hộp.
- [ ] Click nội dung bình luận không mở hộp; click chữ trong hộp không đóng.
- [ ] Huỷ, nền tối, Escape đều trả focus về đúng nút đã mở; không xoá dữ liệu.
- [ ] Escape khi hộp đóng không gây lỗi.
- [ ] Xác nhận xoá đúng một `li`, số đếm giảm đúng, focus về tiêu đề.
- [ ] Mở A rồi Huỷ, mở B rồi xác nhận: chỉ B bị xoá.
- [ ] Xoá hết: hiện thông báo rỗng; gửi tiếp: thông báo biến mất, nút xoá mới vẫn chạy.
- [ ] Nội dung hai dòng vẫn là hai dòng; 200 chữ liền nhau không làm tràn ngang ở màn hình 375px.
- [ ] DevTools: xoá `whitespace-pre-wrap` để thấy xuống dòng bị gộp; xoá `wrap-anywhere` để thấy chuỗi dài có thể tràn. Thêm lại cả hai.
- [ ] Bàn phím: Tab tới các nút thấy viền; Enter trong textarea tạo dòng mới, Enter trên nút gửi thì submit.
- [ ] Bật `prefers-reduced-motion: reduce`: không còn transition hộp, focus vẫn đúng.
- [ ] Tải lại trang: trở về 2 bình luận mẫu, đúng vì bài chưa lưu dữ liệu.
- [ ] Tự hỏi: vì sao listener trên danh sách nhận click từ nút vừa được thêm?
- [ ] Tự hỏi: `event.target` và `event.currentTarget` khác nhau thế nào khi bấm dấu `×`?
- [ ] Tự hỏi: nếu đếm bằng danh sách lưu lúc tải trang thì vì sao số lượng không đổi sau thêm/xoá?

## Thử thách thêm

1. **Đếm ký tự đang nhập.** Thêm một phần tử có `data-character-count`, nghe sự kiện `input` trên textarea rồi đọc `input.value.length`. Sự kiện `input` chạy sau mỗi lần người dùng thay đổi nội dung, `.length` của chuỗi đếm đơn vị UTF-16 nên một số emoji có thể được tính thành nhiều đơn vị. Dùng `text-xs text-slate-500` cho số đếm. Không thay giới hạn `maxlength="280"` của bài chính.
2. **Thêm nút xoá tất cả.** Khi không có bình luận, vô hiệu hoá nút bằng thuộc tính `disabled`; Tailwind `disabled:opacity-50 disabled:cursor-not-allowed` tạo trạng thái không dùng được. Cần xác nhận riêng và cập nhật số đếm/trạng thái rỗng. Không làm thử thách này trước khi luồng xoá một bình luận chạy đúng.

## Mã hoàn chỉnh

Chỉ mở sau khi đã tự làm.

<details><summary>Xem lời giải</summary>

`solution/index.html`

```html
<!doctype html>
<html lang="vi">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Bài 005 - Bình luận động</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main data-page class="page">
			<header class="site-header">
				<p class="site-name">Góc đọc</p>
				<span class="site-tag">Chuyện thường ngày</span>
			</header>
			<article class="post">
				<p class="post-label">Một góc nhìn</p>
				<h1 class="post-title">Đọc chậm giữa một ngày bận rộn</h1>
				<p class="post-summary">Không cần đọc thật nhiều. Đôi khi, một đoạn ngắn khiến mình dừng lại suy nghĩ đã là đủ. Bạn thường dành lúc nào trong ngày để đọc?</p>
			</article>
			<section data-thread aria-labelledby="comments-title" class="thread">
				<h2 id="comments-title" data-heading tabindex="-1" class="section-heading">Bình luận <span data-count class="count">2</span></h2>
				<p class="section-description">Chia sẻ một suy nghĩ của bạn.</p>
				<form data-form class="comment-form">
					<label for="comment-input" class="field-label">Bình luận của bạn</label>
					<textarea id="comment-input" data-input rows="3" maxlength="280" aria-invalid="false" aria-describedby="comment-help comment-error" class="comment-input"></textarea>
					<p id="comment-help" class="field-help">Tối đa 280 ký tự. Bình luận hiển thị dưới tên “Bạn”.</p>
					<p id="comment-error" data-error aria-live="polite" class="field-error"></p>
					<div class="form-actions">
						<button type="submit" class="button primary">Gửi bình luận</button>
					</div>
				</form>
				<p data-empty-message role="status" class="empty-message">Chưa có bình luận. Bạn có thể viết bình luận đầu tiên ở trên.</p>
				<ul data-list class="comment-list">
					<li>
						<article data-comment class="comment">
							<div class="comment-header">
								<h3 class="comment-author">An</h3>
								<button data-delete type="button" aria-label="Xoá bình luận của An" class="delete-button"><span aria-hidden="true">×</span><span>Xoá</span></button>
							</div>
							<p data-comment-text class="comment-text">Mình thích đọc vài trang trước khi ngủ. Không nhiều, nhưng đều đặn.</p>
						</article>
					</li>
					<li>
						<article data-comment class="comment">
							<div class="comment-header">
								<h3 class="comment-author">Minh</h3>
								<button data-delete type="button" aria-label="Xoá bình luận của Minh" class="delete-button"><span aria-hidden="true">×</span><span>Xoá</span></button>
							</div>
							<p data-comment-text class="comment-text">Đoạn cuối làm mình nhớ đến cuốn sách đang đọc dở. Tối nay đọc tiếp thôi.</p>
						</article>
					</li>
				</ul>
			</section>
			<template data-template>
				<li>
					<article data-comment class="comment">
						<div class="comment-header">
							<h3 class="comment-author">Bạn</h3>
							<button data-delete type="button" aria-label="Xoá bình luận của bạn" class="delete-button"><span aria-hidden="true">×</span><span>Xoá</span></button>
						</div>
						<p data-comment-text class="comment-text"></p>
					</article>
				</li>
			</template>
		</main>
		<div data-dialog class="dialog">
			<div data-backdrop class="dialog-backdrop"></div>
			<div role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description" class="dialog-panel">
				<h2 id="dialog-title" class="dialog-title">Xoá bình luận?</h2>
				<p id="dialog-description" class="dialog-description">Bình luận dưới đây sẽ bị xoá. Thao tác này không hoàn tác được.</p>
				<blockquote data-dialog-text class="dialog-preview"></blockquote>
				<div class="dialog-actions">
					<button data-cancel type="button" class="button secondary">Huỷ</button>
					<button data-confirm type="button" class="button danger">Xoá bình luận</button>
				</div>
			</div>
		</div>
		<script src="script.js"></script>
	</body>
</html>
```

`solution/style.css`

```css
*,
*::before,
*::after {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

button,
textarea {
	font: inherit;
	color: inherit;
}

button {
	border: 0;
	background: none;
	cursor: pointer;
}

ul {
	list-style: none;
}

h1,
h2,
h3 {
	font-size: inherit;
	font-weight: inherit;
}

.site {
	background: #f8fafc;
	color: #1e293b;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	max-width: 672px;
	margin: 0 auto;
	padding: 0 24px 64px;
}

.site-header {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 20px 0;
	border-bottom: 1px solid #cbd5e1;
	background: #f8fafc;
}

.site-name {
	color: #0f766e;
	font-size: 20px;
	font-weight: 700;
}

.site-tag {
	color: #64748b;
	font-size: 12px;
}

.post {
	padding: 32px 0;
}

.post-label {
	color: #0f766e;
	font-size: 14px;
	font-weight: 500;
}

.post-title {
	margin-top: 8px;
	font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
	font-size: 30px;
	font-weight: 700;
	line-height: 1.25;
}

.post-summary {
	margin-top: 16px;
	color: #475569;
}

.thread {
	border-top: 1px solid #cbd5e1;
	padding-top: 24px;
}

.section-heading {
	font-size: 20px;
	font-weight: 600;
}

.section-heading:focus {
	outline: none;
}

.count {
	margin-left: 4px;
	padding: 2px 8px;
	border-radius: 9999px;
	background: #ccfbf1;
	color: #115e59;
	font-size: 14px;
}

.section-description,
.field-help {
	margin-top: 4px;
	color: #64748b;
	font-size: 14px;
}

.comment-form {
	margin-top: 24px;
}

.field-label {
	display: block;
	font-size: 14px;
	font-weight: 500;
}

.comment-input {
	display: block;
	width: 100%;
	margin-top: 8px;
	padding: 12px;
	border: 1px solid #94a3b8;
	border-radius: 8px;
	background: #fff;
	resize: vertical;
}

.comment-input[aria-invalid='true'] {
	border-color: #e11d48;
}

.field-help {
	font-size: 12px;
}

.field-error {
	min-height: 20px;
	margin-top: 4px;
	color: #be123c;
	font-size: 14px;
}

.form-actions {
	display: flex;
	justify-content: flex-end;
	margin-top: 8px;
}

.button {
	padding: 8px 16px;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
}

.primary {
	background: #0f766e;
	color: #fff;
}

.primary:hover {
	background: #115e59;
}

.secondary {
	background: #f1f5f9;
}

.secondary:hover {
	background: #e2e8f0;
}

.danger {
	background: #e11d48;
	color: #fff;
}

.danger:hover {
	background: #be123c;
}

button:focus-visible,
textarea:focus-visible {
	outline: 2px solid #0f766e;
	outline-offset: 2px;
}

.empty-message {
	display: none;
	margin-top: 24px;
	padding: 20px;
	border: 1px dashed #94a3b8;
	border-radius: 8px;
	color: #475569;
	font-size: 14px;
}

.thread[data-empty] .empty-message {
	display: block;
}

.comment-list {
	margin-top: 24px;
}

.comment {
	padding: 20px 0;
	border-top: 1px solid #e2e8f0;
}

.comment-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.comment-author {
	font-size: 14px;
	font-weight: 600;
}

.delete-button {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 4px 8px;
	border-radius: 4px;
	color: #be123c;
	font-size: 14px;
}

.delete-button:hover {
	background: #fff1f2;
}

.comment-text {
	margin-top: 8px;
	color: #475569;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}

.dialog {
	position: fixed;
	inset: 0;
	z-index: 50;
	display: grid;
	place-items: center;
	padding: 24px;
	visibility: hidden;
	opacity: 0;
	transition: opacity 200ms ease;
}

.dialog[data-open] {
	visibility: visible;
	opacity: 1;
}

.dialog-backdrop {
	position: absolute;
	inset: 0;
	background: rgb(15 23 42 / 0.5);
}

.dialog-panel {
	position: relative;
	width: 100%;
	max-width: 384px;
	max-height: 100%;
	overflow-y: auto;
	padding: 20px;
	border-radius: 16px;
	background: #fff;
	box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	translate: 0 8px;
	transition: translate 200ms ease;
}

.dialog[data-open] .dialog-panel {
	translate: 0 0;
}

.dialog-title {
	font-size: 18px;
	font-weight: 600;
}

.dialog-description {
	margin-top: 8px;
	color: #475569;
	font-size: 14px;
}

.dialog-preview {
	max-height: 144px;
	overflow-y: auto;
	margin-top: 16px;
	padding-left: 12px;
	border-left: 2px solid #5eead4;
	color: #475569;
	font-size: 14px;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}

.dialog-actions {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	margin-top: 20px;
}

@media (prefers-reduced-motion: reduce) {
	.dialog,
	.dialog-panel {
		transition: none;
	}
}
```

`solution/script.js`

```js
const page = document.querySelector('[data-page]');
const thread = document.querySelector('[data-thread]');
const heading = document.querySelector('[data-heading]');
const count = document.querySelector('[data-count]');
const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-input]');
const error = document.querySelector('[data-error]');
const list = document.querySelector('[data-list]');
const template = document.querySelector('[data-template]');
const dialog = document.querySelector('[data-dialog]');
const dialogText = document.querySelector('[data-dialog-text]');
const cancelButton = document.querySelector('[data-cancel]');
const confirmButton = document.querySelector('[data-confirm]');
const backdrop = document.querySelector('[data-backdrop]');
let currentComment = null;
let lastTrigger = null;

function syncComments() {
	const total = list.querySelectorAll('[data-comment]').length;
	count.textContent = String(total);
	thread.toggleAttribute('data-empty', total === 0);
}

function setDialog(isOpen) {
	dialog.toggleAttribute('data-open', isOpen);
	page.toggleAttribute('inert', isOpen);
}

function openDialog(comment, trigger) {
	currentComment = comment;
	lastTrigger = trigger;
	dialogText.textContent = comment.querySelector('[data-comment-text]').textContent;
	setDialog(true);
	cancelButton.focus();
}

function closeDialog() {
	setDialog(false);
	lastTrigger.focus();
	currentComment = null;
	lastTrigger = null;
}

function deleteComment() {
	currentComment.closest('li').remove();
	syncComments();
	setDialog(false);
	heading.focus();
	currentComment = null;
	lastTrigger = null;
}

function addComment(event) {
	event.preventDefault();
	const text = input.value.trim();
	if (text === '') {
		error.textContent = 'Hãy viết nội dung trước khi gửi.';
		input.setAttribute('aria-invalid', 'true');
		input.focus();
		return;
	}
	const fragment = template.content.cloneNode(true);
	fragment.querySelector('[data-comment-text]').textContent = text;
	list.append(fragment);
	form.reset();
	error.textContent = '';
	input.setAttribute('aria-invalid', 'false');
	syncComments();
	input.focus();
}

function handleListClick(event) {
	const button = event.target.closest('[data-delete]');
	if (!button) {
		return;
	}
	openDialog(button.closest('[data-comment]'), button);
}

form.addEventListener('submit', addComment);
list.addEventListener('click', handleListClick);
cancelButton.addEventListener('click', closeDialog);
backdrop.addEventListener('click', closeDialog);
confirmButton.addEventListener('click', deleteComment);

document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' && dialog.hasAttribute('data-open')) {
		closeDialog();
	}
});

syncComments();
```

</details>

### Giải thích từng hàm

Các mục dưới nói về cả giá trị được trả về lẫn thay đổi mà lời gọi tạo ra. `undefined` nghĩa là lời gọi không trả một kết quả hữu ích để lưu lại; bạn không gán nó ngược vào biến đang giữ phần tử.

**Các hàm tự đặt:**

- `syncComments()`: không nhận tham số. Đếm lại bình luận, ghi số đếm và bật/tắt trạng thái rỗng. Không trả kết quả; nhiệm vụ là đồng bộ giao diện sau mỗi thay đổi.
- `setDialog(isOpen)`: nhận boolean. `true` mở hộp và khoá main, `false` đóng hộp và mở khoá main. Không xử lý focus hoặc xoá bình luận; các hàm gọi nó tự chọn focus phù hợp.
- `openDialog(comment, trigger)`: nhận phần tử bình luận và nút đã mở hộp. Lưu hai tham chiếu, chép nội dung vào hộp, mở và focus Huỷ. Không tìm bình luận bằng nội dung chữ vì hai bình luận có thể trùng nội dung.
- `closeDialog()`: đóng hộp, trả focus về nút đã lưu rồi xoá hai tham chiếu. Chỉ gọi từ luồng hộp đang mở, đặc biệt phải kiểm tra trước khi gọi từ Escape.
- `deleteComment()`: xoá `li` bao ngoài bình luận đang chọn, đồng bộ, đóng hộp, focus tiêu đề, xoá hai tham chiếu. Không gọi `closeDialog()` vì nút đã lưu nằm trong bình luận vừa bị xoá.
- `addComment(event)`: nhận đối tượng sự kiện submit. Ngăn hành vi mặc định, kiểm tra dữ liệu, tạo bình luận hợp lệ hoặc hiện lỗi. Không trả dữ liệu cho nơi gọi; listener được trình duyệt gọi khi form submit.
- `handleListClick(event)`: nhận sự kiện click nổi bọt lên danh sách. Tìm nút xoá bao quanh target, bỏ qua nếu không có nút, tìm bình luận và gọi hàm mở hộp. Không gắn thêm listener vào bình luận mới.
- `function (event)` trong listener keydown: hàm không có tên, nhận sự kiện phím từ trình duyệt; chỉ gọi hàm đóng khi phím là Escape và hộp đang mở.

**Chọn phần tử và đọc dữ liệu:**

- `document.querySelector('[data-form]')`: trả phần tử đầu tiên khớp selector hoặc `null` nếu không có. HTML của bài bảo đảm phần tử tồn tại; chọn một lần rồi giữ tham chiếu bằng `const`.
- `fragment.querySelector('[data-comment-text]')`: cùng phương thức nhưng chỉ tìm trong bản sao vừa tạo. Chọn từ `fragment` để không vô tình sửa bình luận đầu tiên trên trang.
- `list.querySelectorAll('[data-comment]')`: trả `NodeList` tĩnh gồm mọi bình luận hiện nằm trong danh sách; không gồm nội dung chưa được chèn của template. Tĩnh nghĩa là một biến giữ NodeList cũ không tự tăng/giảm khi DOM đổi. Hàm đồng bộ gọi lại mỗi lần để có danh sách mới.
- `.length` trên NodeList: thuộc tính số lượng, không phải hàm, không thêm `()`. `.length` của chuỗi là khái niệm khác: số đơn vị UTF-16 của chuỗi.
- `input.value`: thuộc tính đọc giá trị textarea hiện tại dưới dạng chuỗi. `input.textContent` không dùng để đọc nội dung người dùng vừa nhập.
- `input.value.trim()`: trả một chuỗi mới đã bỏ khoảng trắng, tab và dấu xuống dòng ở hai đầu. Không tự sửa ô nhập và không xoá khoảng trắng/xuống dòng ở giữa nội dung.
- `.textContent`: đọc chữ thuần của phần tử; khi gán sẽ thay nội dung con bằng chữ thuần. Nó là thuộc tính, không phải hàm. Chuỗi chứa thẻ HTML vẫn thành chữ, không được phân tích thành phần tử.
- `String(total)`: hàm có sẵn, nhận số lượng và trả chuỗi tương ứng để ghi vào số đếm.

**Form và tạo phần tử:**

- `event.preventDefault()`: phương thức trên đối tượng sự kiện, ngăn hành vi mặc định của submit, ở đây là gửi form và điều hướng/tải lại trang. Trả `undefined`; không chặn click nổi bọt và không tự dừng các câu lệnh tiếp theo.
- `template.content`: thuộc tính trả một `DocumentFragment` chứa cây con của template. `DocumentFragment` là vùng chứa DOM chưa hiển thị như một phần tử bao ngoài.
- `.cloneNode(true)`: trả bản sao của node. `true` là tham số sao chép sâu, lấy cả con/cháu; `false` hoặc bỏ tham số chỉ sao chép chính node. Với fragment, sao chép nông sẽ không mang theo bình luận bên trong. Phương thức không sao chép listener từng được gắn bằng `addEventListener`.
- `list.append(fragment)`: đưa các node con của fragment vào cuối danh sách và làm fragment ấy rỗng. Không tạo thẻ bọc fragment trong HTML. Trả `undefined`; vì thế không gán kết quả vào biến đang giữ danh sách. Mỗi lần gửi phải sao chép khuôn mới.
- `form.reset()`: đưa các trường form về giá trị mặc định trong HTML; textarea của bài có mặc định rỗng. Trả `undefined`. Nó không xoá bình luận đã append, không tự xoá phần tử hiển thị lỗi và không tự sửa thuộc tính aria-invalid.
- `input.setAttribute('aria-invalid', 'true')`: ghi thuộc tính bằng chuỗi, trả `undefined`. Dùng `'false'` để báo trạng thái hợp lệ; khác với thuộc tính boolean `inert`, aria-invalid được đọc theo giá trị chuỗi.

**Sự kiện, trạng thái và focus:**

- `event`: đối tượng trình duyệt truyền vào listener; tên tham số do mình chọn. Bạn không tự tạo hoặc truyền đối tượng này khi đăng ký listener.
- `addEventListener('submit', addComment)`: đăng ký hàm nhận submit trên form, trả `undefined`. Truyền tên hàm không có `()` để hàm chỉ chạy khi sự kiện xảy ra. Submit có thể đến từ kích hoạt nút bằng chuột hoặc bàn phím; Enter trong textarea vẫn tạo dòng mới.
- `addEventListener('click', handleListClick)`: gắn một listener trên danh sách. Click thường nổi bọt từ con lên cha nên listener nhận cả nút mới. Không dùng stopPropagation trong bài vì nó sẽ ngăn sự kiện đi tới danh sách.
- `event.target`: phần tử nơi click bắt đầu, có thể là span trong nút. `event.currentTarget`: phần tử đang chạy listener, ở đây luôn là danh sách. Cả hai là thuộc tính, không gọi với `()`.
- `event.target.closest('[data-delete]')`: trả phần tử gần nhất khớp selector, xét chính target trước rồi đi lên tổ tiên. Không tìm thấy thì trả `null`. Bấm dấu `×` vẫn tìm được button bên ngoài.
- `button.closest('[data-comment]')`: trả bình luận bao quanh nút để xác định đúng mục cần xoá. `currentComment.closest('li')` lấy li cần gỡ, tránh để lại một mục rỗng.
- `.remove()`: gỡ phần tử cùng mọi con khỏi DOM, trả `undefined`. Chỉ xoá dữ liệu đang hiển thị, không ghi xuống ổ đĩa hay server.
- `.toggleAttribute('data-empty', total === 0)`: trả boolean cho biết thuộc tính có tồn tại sau lời gọi. Tham số thứ hai là force: `true` luôn thêm, `false` luôn gỡ; bỏ tham số thứ hai thì đảo trạng thái mỗi lần. Ở đây phải dựa trên số đếm, không đảo mù.
- `.toggleAttribute('data-open', isOpen)` và `.toggleAttribute('inert', isOpen)`: cùng cách dùng với trạng thái hộp và khoá nền. `inert` hiện diện thì mọi phần tử con trong main không nhận tương tác hoặc focus; hộp phải nằm bên ngoài main.
- `.focus()`: đưa focus bàn phím vào phần tử, trả `undefined`. Không gán kết quả vào currentComment. Khi đóng phải gỡ inert trước; khi mở visibility phải đổi ngay rồi mới focus Huỷ.
- `heading` có `tabindex="-1"`: cho phép focus bằng JS nhưng không đưa tiêu đề vào thứ tự Tab thông thường. Đây là đích focus sau khi thẻ và nút xoá không còn tồn tại.
- `event.key`: chuỗi tên phím. `dialog.hasAttribute('data-open')` trả boolean, giúp Escape không gọi đóng khi các tham chiếu đã là null.
- `cancelButton.addEventListener('click', closeDialog)` và listener nền tối: hai nguồn sự kiện dùng chung một hàm. Nền là anh em của hộp trắng nên bấm chữ trong hộp không nổi bọt qua nền.

**Biến, toán tử và luồng chạy:**

- `const`: biến không được gán lại tham chiếu; vẫn có thể đổi textContent hoặc thuộc tính của phần tử mà biến ấy đang trỏ tới. `let` dành cho currentComment và lastTrigger vì mỗi lần mở/đóng sẽ gán giá trị mới.
- `null`: biểu thị chưa chọn bình luận hoặc chưa lưu nút. Lưu phần tử DOM là giữ tham chiếu tới chính phần tử ấy, không sao chép thẻ và không lưu lâu dài sau tải lại.
- `=` gán giá trị. `===` so sánh nghiêm ngặt và trả boolean, chẳng hạn text bằng chuỗi rỗng hoặc total bằng số 0. Không dùng dấu gán trong điều kiện so sánh.
- `!button`: phủ định giá trị; khi closest trả null thì điều kiện này đúng. `return` trong nhánh này kết thúc hàm ngay, không chạy phần tìm bình luận bên dưới. `return` không có giá trị trả `undefined`.
- `&&`: phép và; cả phím Escape và trạng thái mở đều phải đúng. Có cơ chế dừng sớm nếu vế đầu sai. Boolean của điều kiện không cần so sánh thêm với `true`.
- `function name(parameter)`: khai báo hàm có tên và tham số. Khi gọi openDialog với bình luận và nút, hai tham chiếu trở thành giá trị của hai tham số tương ứng. Tham số event trong listener được trình duyệt truyền vào.
- `syncComments();` ở cuối file: gọi ngay một lần sau khi các phần tử và listener đã chuẩn bị xong. Script nằm cuối body nên HTML cần dùng đã được phân tích.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

- `whitespace-pre-wrap wrap-anywhere` tương ứng hai dòng trong `.comment-text`. Đây là phần CSS mới duy nhất bạn tự thêm. Đừng quên template.
- `group` trên vùng bình luận đi cùng `group-data-empty:block` ở thông báo rỗng. CSS thuần dùng `.thread[data-empty] .empty-message`. `data-empty` không phải tên class.
- `aria-invalid:border-rose-600` tương ứng `.comment-input[aria-invalid='true']`. Dù thuộc tính tồn tại với giá trị `'false'` thì viền lỗi vẫn không được áp dụng.
- `cursor-pointer` và các class `focus-visible:*` trên mọi nút tương ứng cursor và rule focus-visible chung trong style.css. Textarea có viền focus tương tự.
- Header `sticky top-0 z-10` và hộp `fixed inset-0 z-50` dùng lại kiến thức quản lý layer. Hộp nằm sau main, không nằm trong vùng có inert.
- `transition-opacity` trên lớp ngoài, `transition-[translate]` trên hộp trắng: visibility đổi ngay, nên focus Huỷ không phải đợi animation. Cả hai có `motion-reduce:transition-none`.
- `max-h-full overflow-y-auto` giới hạn hộp theo chiều cao sẵn có; phần trích có `max-h-36 overflow-y-auto` để một bình luận dài không đẩy các nút ra ngoài màn hình.
- Hai bản HTML giữ cùng cấu trúc và data-* nên cùng một file JS chạy được. Khi thử lời giải JS với starter, sao chép sang bản thử riêng; đừng ghi đè bài làm của bạn trước khi tự hoàn thành.

### Nguồn tham khảo

Bài này được biên soạn theo tiến độ học hiện tại, tham khảo các khái niệm sau, không yêu cầu sao chép một dự án trên mạng:

- [JavaScript.info: Event delegation](https://javascript.info/event-delegation).
- [MDN: Phần tử template](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template).
- [Tailwind CSS: white-space](https://tailwindcss.com/docs/white-space).
- [Tailwind CSS: overflow-wrap](https://tailwindcss.com/docs/overflow-wrap).
