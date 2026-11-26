# Bài 020: Ghi chú kính mờ, vệt sáng theo con trỏ và localStorage

Ngày học 8, bài 1/3, cấp 2, chủ đề CSS: Glass + 3D + ánh sáng (ứng dụng ghi chú), độ khó ★★★☆☆, thời gian ước tính 40 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này **có** dùng `localStorage`. Ghi chú bạn thêm hoặc xoá vẫn còn sau khi tải lại trang. Muốn về dữ liệu mẫu, mở DevTools, tab Application, xoá khoá `bai-020-ghi-chu` rồi tải lại.

## Mục tiêu

- Viết ghi chú dài tối đa 120 ký tự, bộ đếm `x/120` cập nhật theo từng phím gõ, nút "Thêm" bị khoá khi ô trống (kể cả chỉ toàn dấu cách).
- Mỗi ghi chú là một thẻ kính mờ có màu theo lựa chọn, kèm ngày giờ tạo theo kiểu Việt Nam (ví dụ `24/11/2025 21:20`).
- Di chuột trên thẻ: thẻ nghiêng 3D theo vị trí con trỏ và một vệt sáng chạy theo con trỏ. Rời chuột thì thẻ phẳng lại.
- Thêm, xoá ghi chú rồi tải lại trang: danh sách vẫn đúng nhờ `localStorage`, `JSON.stringify` và `JSON.parse`.
- Nút "Xoá" trên thẻ bấm được dù có lớp sáng phủ lên (bạn sẽ gặp và sửa cái bẫy lớp phủ chặn click).

## Kết quả mong đợi

Trang tối với khung bo tròn có ba khối màu loang phía sau. Form ghi chú kính mờ nằm trên cùng. Bên dưới là lưới hai cột thẻ ghi chú kính mờ màu hổ phách, xanh trời, hồng. Rê chuột lên một thẻ: thẻ hơi nghiêng về phía con trỏ, có một vầng sáng trắng đi theo con trỏ. Bấm "Xoá" thì thẻ biến mất và danh sách được lưu lại.

## Tư duy

**State là một object, giao diện là kết quả của state.** Thay vì sửa từng phần tử DOM mỗi khi có thay đổi, ta giữ một object `state = { notes: [...] }` làm nguồn sự thật, rồi viết hàm `render` vẽ lại danh sách từ state. Thêm ghi chú nghĩa là sửa mảng rồi gọi `render`. Giống sổ sách của cửa hàng: bạn sửa sổ, rồi in lại bảng giá, chứ không chạy ra dán tay từng tờ.

**`localStorage` chỉ cất được chuỗi.** Nó như một tủ chỉ nhận hộp giấy: muốn cất một mảng object phải gói thành chuỗi bằng `JSON.stringify`, lấy ra thì mở gói bằng `JSON.parse`. Nếu quên `stringify` và đưa thẳng mảng vào, trình duyệt tự gọi `toString()` ra chuỗi vô nghĩa `[object Object]`. Lần đầu mở trang, `getItem` trả `null` (chưa có gì trong tủ), nên phải xử lý riêng và dùng dữ liệu mẫu.

**Vệt sáng là một lớp phủ, và lớp phủ ăn click.** Vệt sáng là một `div` phủ kín thẻ (`absolute inset-0`) với gradient hình tròn có tâm tại `var(--mx) var(--my)`. JS chỉ ghi hai số `--mx`, `--my` (vị trí con trỏ trong thẻ), CSS lo phần vẽ. Nhưng một phần tử phủ lên nút "Xoá" sẽ nhận click thay cho nút, giống như dán một tấm kính trong suốt lên màn hình điện thoại: ngón tay bấm vào kính chứ không chạm được nút. Cách sửa: `pointer-events-none` làm lớp phủ "trong suốt với chuột".

**Nghiêng 3D cần một cha giữ phối cảnh.** Phần tử nghiêng (`article`) và phần tử giữ `perspective` (`li`) phải là hai lớp khác nhau. Toạ độ chuột cũng nên đo trên `li` (đứng yên), không đo trên `article` đang nghiêng, nếu không hình chữ nhật bị méo làm thẻ rung ở mép.

**`pointerout` nổi bọt, `pointerleave` thì không.** Ta gắn một listener duy nhất ở danh sách (uỷ quyền sự kiện). `pointerout` phát cả khi con trỏ đi từ nút "Xoá" sang chữ trong cùng một thẻ, nên phải hỏi "con trỏ có thật sự rời khỏi thẻ không" bằng `card.contains(event.relatedTarget)` rồi mới trả thẻ về phẳng.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Kính mờ, màu thẻ theo `group-data-[color=...]:` | Ghi `data-color` cho từng thẻ |
| Nghiêng `rotate-x-(--rx) rotate-y-(--ry)` và làm mượt | Tính và ghi `--rx`, `--ry` |
| Vệt sáng `bg-[radial-gradient(...var(--mx)...)]` hiện khi `group-hover:` | Ghi `--mx`, `--my` |
| Nút khoá `disabled:`, cảnh báo `data-warning:text-rose-300` | `disabled`, `toggleAttribute('data-warning', ...)` |
| Bố cục lưới, khoảng cách, viền focus | Đọc và ghi `localStorage`, vẽ danh sách, đếm ký tự |

JS không thêm hoặc gỡ class, không đặt `style.transform`, không tìm phần tử bằng class (chỉ `data-*`). JS chỉ được `style.setProperty` cho các biến `--mx`, `--my`, `--rx`, `--ry`.

## Ôn lại

- Bài 012 (`bai-012-vi-the-anh-sang`): `backdrop-blur-md`, `rotate-x/y`, `perspective-midrange`, nguồn sáng làm bằng lớp phủ `bg-radial`.
- Bài 019 (`bai-019-xuc-xac-3d`): `rotate-x-(--rx) rotate-y-(--ry)` với `style.setProperty`.
- Bài 009 (`bai-009-quiz-kinh-mo`): `-z-10` trong khung `isolate`, `template.content.cloneNode(true)`, `replaceChildren`.
- Bài 013 (`bai-013-dat-ban-nha-hang`): `template.content.firstElementChild.cloneNode(true)`, `form.reset()`.
- Bài 014 (`bai-014-hop-thu-huy-hieu`): `toggleAttribute(tên, force)`, uỷ quyền click với `closest`.
- Bài 006 (`bai-006-gio-hang`): `wrap-anywhere`; bài 005 (`bai-005-binh-luan-dong`): `whitespace-pre-wrap`.

## Gợi ý từng bước

> Starter đã điền sẵn: toàn bộ bố cục, kính mờ (`backdrop-blur-md`, `border-white/20`), ba khối màu `-z-10` trong khung `isolate`, form, nút `disabled:`, `data-warning:text-rose-300` cho bộ đếm, và trong `<template>`: `group perspective-midrange` ở `<li>`, màu thẻ `group-data-[color=...]:from-*/to-*`, nghiêng `rotate-x-(--rx) rotate-y-(--ry) transition-transform duration-200 motion-reduce:transition-none`, chữ `wrap-anywhere whitespace-pre-wrap`, nút Xoá. Lớp sáng `<div aria-hidden="true">` mới có `absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 motion-reduce:transition-none`. Bạn tự thêm hai nhóm class mới: **vệt sáng theo con trỏ** và **`pointer-events-none`**.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính `data-*`: `data-form`, `data-input`, `data-counter`, `data-add`, `data-count`, `data-empty`, `data-list` (danh sách trống lúc đầu) và `<template data-note-template>`. Trong template, `<li data-card data-color>` có sẵn `style="--rx: 0deg; ..."` để các biến có giá trị khởi đầu. Kiểm tra: mở trang thấy form, chưa có thẻ nào, nút "Thêm" bị khoá.

2. **JS: state và localStorage.** **Bạn làm:** toàn bộ JS. Khai báo một hằng khoá `storageKey` và mảng `seedNotes` gồm hai ghi chú mẫu, mỗi ghi chú là object `{ id, text, color, createdAt }` (`createdAt` là số mili giây). Viết `loadNotes()`: gọi `localStorage.getItem(storageKey)`; nếu kết quả là `null` thì trả `seedNotes`, không thì trả `JSON.parse(saved)`. Tạo `const state = { notes: loadNotes() }`. Viết `saveNotes()`: `localStorage.setItem(storageKey, JSON.stringify(state.notes))`. Kiểm tra: gõ `state.notes` ở Console (tạm gán ra `window` hoặc `console.log`) ra mảng hai ghi chú; mở tab Application chưa thấy khoá vì chưa lưu.

3. **JS: vẽ danh sách.** **Bạn làm:** toàn bộ JS. Tạo `dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' })`. Viết `createCard(note)`: nhân bản `noteTemplate.content.firstElementChild`, ghi `dataset.id`, `dataset.color`, `textContent` cho `[data-text]`, và cho `[data-time]` ghi `dateFormat.format(note.createdAt)` cùng thuộc tính `dateTime` bằng `new Date(note.createdAt).toISOString()`. Viết `renderNotes()`: `list.replaceChildren(...state.notes.map(createCard))`, ghi `empty.hidden`, ghi `count.textContent`. Gọi `renderNotes()` cuối file. Kiểm tra: hai thẻ mẫu hiện đúng màu hổ phách và xanh trời, ngày giờ dạng `24/11/2025 ...`.

4. **JS: form với sự kiện `input`.** **Bạn làm:** toàn bộ JS. Viết `renderForm()`: ghi bộ đếm `độ dài/120`, `counter.toggleAttribute('data-warning', còn <= 20)`, và `addButton.disabled = input.value.trim() === ''`. Gắn `input.addEventListener('input', renderForm)`; sự kiện `input` chạy sau **mỗi lần giá trị đổi** (gõ, dán, xoá), khác `change` chỉ chạy khi rời ô. Viết `handleSubmit(event)`: `preventDefault()`, `trim()`, bỏ qua nếu rỗng, `state.notes.unshift({...})` thêm vào **đầu** mảng với `id: Date.now()` và màu lấy từ `form.elements.color.value`; rồi `saveNotes()`, `form.reset()`, `renderForm()`, `renderNotes()`, `input.focus()`. Gọi `renderForm()` một lần cuối file. Kiểm tra: gõ chữ, bộ đếm tăng; còn 20 ký tự thì đỏ lên; chỉ gõ dấu cách thì nút vẫn khoá; thêm ghi chú xong ô trống, bộ đếm về `0/120`, thẻ mới nằm đầu danh sách. Tải lại trang: thẻ vẫn còn.

5. **JS: xoá bằng uỷ quyền sự kiện.** **Bạn làm:** toàn bộ JS. Một listener `click` ở `list`; dùng `event.target.closest('[data-delete]')`, nếu `null` thì dừng. Lấy `id` bằng `Number(button.closest('[data-card]').dataset.id)`, đặt `state.notes = state.notes.filter(...)` giữ lại ghi chú có `id` khác, rồi `saveNotes()`, `renderNotes()`. Kiểm tra: xoá một thẻ, tải lại trang thì thẻ đó vẫn mất. Xoá hết để thấy dòng "Chưa có ghi chú nào" xuất hiện.

6. **JS: theo dõi con trỏ và ghi biến CSS.** **Bạn làm:** toàn bộ JS. Listener `pointermove` ở `list`: lấy thẻ bằng `event.target.closest('[data-card]')`, bỏ qua nếu `null`. Đo `card.getBoundingClientRect()` rồi tính `x = event.clientX - rect.left`, `y = event.clientY - rect.top`. Ghi bốn biến bằng `card.style.setProperty`: `--mx` và `--my` là `x`, `y` theo `px`; `--rx = (0.5 - y / rect.height) * 12` độ và `--ry = (x / rect.width - 0.5) * 12` độ (`toFixed(1)` cho gọn). Kiểm tra: rê chuột lên thẻ, xem thuộc tính `style` của `<li>` đổi liên tục trong DevTools; thẻ nghiêng nhẹ theo chuột.

7. **CSS: vệt sáng theo con trỏ.** **Bạn làm:** trên `<div aria-hidden="true">` trong template thêm `bg-[radial-gradient(circle_at_var(--mx)_var(--my),rgba(255,255,255,0.4),transparent_55%)] group-hover:opacity-100`. Class đầu là gradient hình tròn có tâm `var(--mx) var(--my)` (dấu `_` là dấu cách), sáng 40% ở tâm rồi tắt dần ở 55%. `group-hover:` nghĩa là "khi phần tử `group` (là `<li>`) đang được rê chuột lên". Kiểm tra: rê chuột lên thẻ thấy vầng sáng đi theo con trỏ và mờ dần ra khi rời đi.

8. **Cái bẫy: lớp sáng chặn nút Xoá, và trả thẻ về phẳng.** **Bạn làm:** thêm `pointer-events-none` vào `<div aria-hidden="true">` trong template, **sau khi** tự thấy lỗi. Trước tiên bấm "Xoá" khi chưa có class này: không có gì xảy ra, vì lớp sáng nằm cuối `<article>` nên phủ lên nút và nhận click thay nó (trong DevTools, bấm chọn phần tử sẽ thấy ra `div` sáng). Thêm `pointer-events-none` rồi bấm lại: xoá được. Sau đó viết `handlePointerOut(event)` trên sự kiện `pointerout` của `list`: lấy thẻ bằng `closest`; nếu `null` hoặc `card.contains(event.relatedTarget)` thì `return`; không thì `setProperty('--rx', '0deg')` và `--ry`. `relatedTarget` là phần tử con trỏ **đi tới**; `contains(x)` trả `true` nếu `x` nằm trong thẻ (kể cả chính thẻ), `false` nếu `x` là `null`. Kiểm tra: rời chuột khỏi thẻ thì thẻ phẳng lại; di chuột qua nút "Xoá" trong thẻ thì thẻ không giật về phẳng. Cuối cùng chạy phần Tự kiểm tra.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `bg-[radial-gradient(circle_at_var(--mx)_var(--my),rgba(255,255,255,0.4),transparent_55%)]` | `background: radial-gradient(circle at var(--mx) var(--my), rgba(255, 255, 255, 0.4), transparent 55%)` |
| `group-hover:opacity-100` | `.note:hover .shine { opacity: 1 }` |
| `pointer-events-none` | `pointer-events: none` |
| `rotate-x-(--rx) rotate-y-(--ry)` | `transform: rotateX(var(--rx)) rotateY(var(--ry))` |
| `perspective-midrange` | `perspective: 800px` |
| `group-data-[color=sky]:from-sky-300/50` | `.note[data-color="sky"] .note-body { background: linear-gradient(...) }` |
| `transition-transform duration-200` | `transition: transform 200ms` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Ba khối màu phía sau hiện qua form và các thẻ (bị nhoè); thẻ có ba màu đúng theo lựa chọn.
- [ ] Gõ ký tự thì bộ đếm tăng ngay; còn 20 ký tự hoặc ít hơn thì số đổi sang màu đỏ nhạt; dán một đoạn dài hơn 120 ký tự thì bị cắt ở 120.
- [ ] Ô trống hoặc chỉ có dấu cách: nút "Thêm" bị khoá. Thêm xong: ô trống, bộ đếm `0/120`, con trỏ về ô nhập.
- [ ] Thêm hai ghi chú, xoá một, tải lại trang: danh sách còn đúng. Tab Application, mục Local Storage, thấy khoá `bai-020-ghi-chu` chứa chuỗi JSON.
- [ ] Rê chuột trên thẻ: thẻ nghiêng đúng hướng (chuột ở mép phải thì mép phải lùi ra xa), vệt sáng đi theo; rời chuột thì phẳng. Nút "Xoá" bấm được.
- [ ] DevTools: xoá `pointer-events-none` khỏi lớp sáng để thấy nút Xoá chết; sửa `data-color` của một thẻ thành `rose` thì đổi màu mà không cần JS.
- [ ] Bàn phím: Tab qua ô nhập, chọn màu, nút Thêm, các nút Xoá, đều có viền focus. Enter trên nút "Xoá" xoá được thẻ.
- [ ] Bật `prefers-reduced-motion: reduce`: thẻ nghiêng và vệt sáng đổi tức thì, không chuyển mượt.
- [ ] Tự hỏi: vì sao đo toạ độ trên `<li>` mà không đo trên `<article>`? Nếu không gọi `JSON.stringify` thì `localStorage` chứa gì? Vì sao dùng `pointerout` cộng `contains(relatedTarget)` thay vì `pointerleave`?

## Thử thách thêm

1. Thêm nút "Ghim" cho thẻ: ghi `data-pinned` bằng `toggleAttribute`, thẻ ghim hiện viền sáng bằng `data-pinned:ring-2` và luôn nằm đầu danh sách (sắp xếp bằng `sort`), có lưu vào `localStorage`.
2. Bọc `JSON.parse` trong `try`/`catch`: khi chuỗi trong `localStorage` bị hỏng (thử sửa tay trong DevTools) thì quay về `seedNotes` thay vì làm sập trang. Thêm `drop-shadow-*` theo hướng con trỏ bằng hai biến `--sx`, `--sy`.

## Mã hoàn chỉnh

Chỉ mở sau khi đã tự làm.

<details>
<summary>Xem lời giải</summary>

`solution/index.html`

```html
<!doctype html>
<html lang="vi">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Bài 020 - Ghi chú kính mờ</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<h1 class="title">Ghi chú kính mờ</h1>
			<p class="subtitle">Ghi chú được lưu ngay trong trình duyệt của bạn.</p>
			<div class="stage">
				<div class="blob blob-a"></div>
				<div class="blob blob-b"></div>
				<div class="blob blob-c"></div>
				<form data-form class="composer">
					<label for="note-text" class="field-label">Nội dung ghi chú</label>
					<textarea id="note-text" data-input name="text" rows="3" maxlength="120" class="textarea"></textarea>
					<div class="composer-foot">
						<select name="color" aria-label="Màu ghi chú" class="select">
							<option value="amber" selected>Hổ phách</option>
							<option value="sky">Xanh trời</option>
							<option value="rose">Hồng</option>
						</select>
						<p data-counter class="counter">0/120</p>
						<button type="submit" data-add disabled class="add-button">Thêm</button>
					</div>
				</form>
				<p data-count class="count"></p>
				<p data-empty hidden class="empty">Chưa có ghi chú nào. Hãy viết ghi chú đầu tiên.</p>
				<ul data-list class="notes"></ul>
			</div>
			<template data-note-template>
				<li data-card data-color="amber" style="--rx: 0deg; --ry: 0deg; --mx: 50%; --my: 50%" class="note">
					<article class="note-body">
						<p data-text class="note-text"></p>
						<div class="note-foot">
							<time data-time class="note-time"></time>
							<button type="button" data-delete aria-label="Xoá ghi chú" class="delete-button">Xoá</button>
						</div>
						<div aria-hidden="true" class="shine"></div>
					</article>
				</li>
			</template>
		</main>
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
select,
textarea {
	font: inherit;
	color: inherit;
}

button {
	background: none;
	border: 0;
	cursor: pointer;
}

ul {
	list-style: none;
}

h1 {
	font-size: inherit;
	font-weight: inherit;
}

.site {
	min-height: 100vh;
	background: #020617;
	color: #f1f5f9;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	margin: 0 auto;
	max-width: 576px;
	padding: 40px 16px;
}

.title {
	font-size: 24px;
	line-height: 32px;
	font-weight: 700;
}

.subtitle {
	margin-top: 4px;
	font-size: 14px;
	line-height: 20px;
	color: #94a3b8;
}

.stage {
	position: relative;
	isolation: isolate;
	margin-top: 24px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	overflow: hidden;
	border-radius: 24px;
	padding: 20px;
}

.blob {
	position: absolute;
	z-index: -10;
	width: 160px;
	height: 160px;
	border-radius: 9999px;
}

.blob-a {
	top: -32px;
	left: -32px;
	background: linear-gradient(to bottom right, #d946ef, #fb923c);
}

.blob-b {
	top: 256px;
	right: -40px;
	width: 176px;
	height: 176px;
	background: linear-gradient(to bottom right, #22d3ee, #2563eb);
}

.blob-c {
	bottom: -40px;
	left: 40px;
	width: 176px;
	height: 176px;
	background: linear-gradient(to bottom right, #34d399, #0d9488);
}

.composer {
	display: flex;
	flex-direction: column;
	gap: 12px;
	border: 1px solid rgb(255 255 255 / 0.2);
	border-radius: 16px;
	background: rgb(15 23 42 / 0.6);
	padding: 16px;
	backdrop-filter: blur(12px);
}

.field-label {
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	color: #e2e8f0;
}

.textarea,
.select {
	border: 1px solid #475569;
	border-radius: 8px;
	background: #1e293b;
	padding: 8px 12px;
	font-size: 14px;
	line-height: 20px;
	color: #f1f5f9;
}

.textarea {
	width: 100%;
}

.composer-foot {
	display: flex;
	align-items: center;
	gap: 12px;
}

.counter {
	margin-left: auto;
	font-size: 14px;
	line-height: 20px;
	color: #94a3b8;
}

.counter[data-warning] {
	color: #fda4af;
}

.add-button {
	border-radius: 8px;
	background: #14b8a6;
	padding: 8px 16px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 700;
	color: #020617;
}

.add-button:hover {
	background: #2dd4bf;
}

.add-button:disabled {
	cursor: not-allowed;
	opacity: 0.4;
}

.textarea:focus-visible,
.select:focus-visible,
.add-button:focus-visible,
.delete-button:focus-visible {
	outline: 2px solid #2dd4bf;
	outline-offset: 2px;
}

.count {
	font-size: 14px;
	line-height: 20px;
	color: #cbd5e1;
}

.empty {
	border: 1px dashed rgb(255 255 255 / 0.3);
	border-radius: 16px;
	padding: 24px;
	text-align: center;
	font-size: 14px;
	line-height: 20px;
	color: #cbd5e1;
}

.notes {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16px;
}

.note {
	perspective: 800px;
}

.note-body {
	position: relative;
	overflow: hidden;
	border: 1px solid rgb(255 255 255 / 0.3);
	border-radius: 16px;
	background: linear-gradient(to bottom right, rgb(252 211 77 / 0.5), rgb(217 119 6 / 0.3));
	padding: 16px;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	backdrop-filter: blur(12px);
	transform: rotateX(var(--rx)) rotateY(var(--ry));
	transition: transform 200ms;
}

.note[data-color="sky"] .note-body {
	background: linear-gradient(to bottom right, rgb(125 211 252 / 0.5), rgb(2 132 199 / 0.3));
}

.note[data-color="rose"] .note-body {
	background: linear-gradient(to bottom right, rgb(253 164 175 / 0.5), rgb(225 29 72 / 0.3));
}

.note-text {
	font-size: 14px;
	line-height: 20px;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}

.note-foot {
	margin-top: 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
}

.note-time {
	font-size: 12px;
	line-height: 16px;
	color: rgb(255 255 255 / 0.7);
}

.delete-button {
	border-radius: 6px;
	background: rgb(0 0 0 / 0.25);
	padding: 4px 8px;
	font-size: 12px;
	line-height: 16px;
	font-weight: 600;
}

.delete-button:hover {
	background: rgb(0 0 0 / 0.4);
}

.shine {
	position: absolute;
	inset: 0;
	border-radius: 16px;
	background: radial-gradient(circle at var(--mx) var(--my), rgba(255, 255, 255, 0.4), transparent 55%);
	opacity: 0;
	transition: opacity 300ms;
	pointer-events: none;
}

.note:hover .shine {
	opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
	.note-body,
	.shine {
		transition: none;
	}
}
```

`solution/script.js`

```js
const storageKey = 'bai-020-ghi-chu';
const maxLength = 120;
const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-input]');
const counter = document.querySelector('[data-counter]');
const addButton = document.querySelector('[data-add]');
const list = document.querySelector('[data-list]');
const count = document.querySelector('[data-count]');
const empty = document.querySelector('[data-empty]');
const noteTemplate = document.querySelector('[data-note-template]');
const dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
const seedNotes = [
	{ id: 1, text: 'Mua sữa và trứng trên đường về.', color: 'amber', createdAt: 1764000000000 },
	{ id: 2, text: 'Ôn lại bài về localStorage trước 9 giờ.', color: 'sky', createdAt: 1764003600000 },
];

function loadNotes() {
	const saved = localStorage.getItem(storageKey);
	if (saved === null) {
		return seedNotes;
	}
	return JSON.parse(saved);
}

const state = { notes: loadNotes() };

function saveNotes() {
	localStorage.setItem(storageKey, JSON.stringify(state.notes));
}

function createCard(note) {
	const card = noteTemplate.content.firstElementChild.cloneNode(true);
	card.dataset.id = note.id;
	card.dataset.color = note.color;
	card.querySelector('[data-text]').textContent = note.text;
	const time = card.querySelector('[data-time]');
	time.textContent = dateFormat.format(note.createdAt);
	time.dateTime = new Date(note.createdAt).toISOString();
	return card;
}

function renderNotes() {
	list.replaceChildren(...state.notes.map(createCard));
	empty.hidden = state.notes.length > 0;
	count.textContent = `Có ${state.notes.length} ghi chú`;
}

function renderForm() {
	const length = input.value.length;
	counter.textContent = `${length}/${maxLength}`;
	counter.toggleAttribute('data-warning', maxLength - length <= 20);
	addButton.disabled = input.value.trim() === '';
}

function handleSubmit(event) {
	event.preventDefault();
	const text = input.value.trim();
	if (text === '') {
		return;
	}
	state.notes.unshift({
		id: Date.now(),
		text: text,
		color: form.elements.color.value,
		createdAt: Date.now(),
	});
	saveNotes();
	form.reset();
	renderForm();
	renderNotes();
	input.focus();
}

function handleListClick(event) {
	const button = event.target.closest('[data-delete]');
	if (button === null) {
		return;
	}
	const id = Number(button.closest('[data-card]').dataset.id);
	state.notes = state.notes.filter(function (note) {
		return note.id !== id;
	});
	saveNotes();
	renderNotes();
	input.focus();
}

function handlePointerMove(event) {
	const card = event.target.closest('[data-card]');
	if (card === null) {
		return;
	}
	const rect = card.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	const tiltX = (0.5 - y / rect.height) * 12;
	const tiltY = (x / rect.width - 0.5) * 12;
	card.style.setProperty('--mx', `${x}px`);
	card.style.setProperty('--my', `${y}px`);
	card.style.setProperty('--rx', `${tiltX.toFixed(1)}deg`);
	card.style.setProperty('--ry', `${tiltY.toFixed(1)}deg`);
}

function handlePointerOut(event) {
	const card = event.target.closest('[data-card]');
	if (card === null || card.contains(event.relatedTarget)) {
		return;
	}
	card.style.setProperty('--rx', '0deg');
	card.style.setProperty('--ry', '0deg');
}

input.addEventListener('input', renderForm);
form.addEventListener('submit', handleSubmit);
list.addEventListener('click', handleListClick);
list.addEventListener('pointermove', handlePointerMove);
list.addEventListener('pointerout', handlePointerOut);

renderForm();
renderNotes();
```

</details>

### Giải thích từng hàm

- `loadNotes()`: không tham số, đọc `localStorage` và trả mảng ghi chú. Trả `seedNotes` khi chưa có dữ liệu, không thì trả kết quả `JSON.parse`.
- `saveNotes()`: ghi `state.notes` thành chuỗi JSON vào `localStorage`. Không trả về gì.
- `createCard(note)`: nhận một ghi chú, trả về một phần tử `<li>` mới đã điền chữ, màu, id và ngày giờ.
- `renderNotes()`: vẽ lại toàn bộ danh sách từ `state.notes`, cập nhật dòng "Chưa có ghi chú" và số lượng.
- `renderForm()`: cập nhật bộ đếm ký tự, cảnh báo sắp hết chỗ và trạng thái khoá của nút "Thêm".
- `handleSubmit(event)`: chạy khi gửi form: chặn tải lại trang, thêm ghi chú mới vào đầu danh sách, lưu, đặt lại form và vẽ lại.
- `handleListClick(event)`: uỷ quyền click ở danh sách, chỉ xử lý khi bấm vào nút `[data-delete]`: lọc bỏ ghi chú đó, lưu và vẽ lại.
- `handlePointerMove(event)`: tính vị trí con trỏ trong thẻ rồi ghi bốn biến CSS `--mx`, `--my`, `--rx`, `--ry`.
- `handlePointerOut(event)`: khi con trỏ thật sự rời thẻ thì đặt `--rx`, `--ry` về `0deg`.
- `document.querySelector(selector)` và `card.querySelector(selector)`: tìm phần tử đầu tiên khớp selector (ở đây là `[data-...]`) trong trang hoặc trong thẻ, trả phần tử hoặc `null`.
- `noteTemplate.content.firstElementChild.cloneNode(true)`: `content` là ruột của `<template>`, `firstElementChild` là phần tử con đầu tiên (`<li>`), `cloneNode(true)` nhân bản cả cây con (`false` chỉ nhân bản đúng một thẻ). Trả phần tử mới chưa gắn vào trang.
- `event.preventDefault()`: chặn hành vi mặc định của sự kiện; ở `submit` là chặn trình duyệt tải lại trang. Không trả về gì.
- `input.focus()`: đưa con trỏ bàn phím vào ô nhập. Không trả về gì.
- `localStorage.getItem(khoá)`: trả chuỗi đã lưu, hoặc `null` nếu khoá chưa tồn tại. `setItem(khoá, chuỗi)` ghi một chuỗi, không trả về gì; giá trị không phải chuỗi bị ép bằng `toString()`.
- `JSON.stringify(giá trị)`: biến mảng hoặc object thành chuỗi JSON. `JSON.parse(chuỗi)`: làm ngược lại, trả mảng hoặc object; ném lỗi nếu chuỗi không phải JSON hợp lệ.
- `new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' })`: tạo bộ định dạng ngày giờ theo vùng Việt Nam. Tham số đầu là mã vùng; tham số thứ hai là tuỳ chọn, `dateStyle` và `timeStyle` chọn độ dài `short`. `.format(số hoặc Date)` trả chuỗi như `24/11/2025 21:20`; nhận cả số mili giây.
- `new Date(số).toISOString()`: tạo đối tượng ngày từ số mili giây rồi trả chuỗi chuẩn `2025-11-24T14:20:00.000Z`, hợp với thuộc tính `dateTime` của thẻ `<time>`.
- `Date.now()`: trả số mili giây từ năm 1970 đến bây giờ; dùng làm `id` và `createdAt`.
- `array.unshift(phần tử)`: thêm phần tử vào **đầu** mảng và sửa chính mảng đó; trả độ dài mới. Khác `push` thêm vào cuối.
- `array.map(createCard)`: gọi `createCard` cho từng ghi chú, trả mảng phần tử mới. Truyền tên hàm không có `()`.
- `array.filter(hàm)`: trả mảng mới chỉ chứa các phần tử mà hàm trả `true`. Ở đây giữ lại ghi chú có `id` khác `id` cần xoá.
- `list.replaceChildren(...mảng)`: thay toàn bộ con của `list` bằng các nút đưa vào; `...` là toán tử trải, tách mảng thành từng đối số.
- `form.elements.color`: `elements` là tập hợp các ô của form, truy cập theo thuộc tính `name`; `.value` là giá trị đang chọn.
- `form.reset()`: trả mọi ô của form về giá trị ban đầu trong HTML. Chạy đồng bộ nên gọi `renderForm()` ngay sau đó là đọc được giá trị mới.
- `input.addEventListener('input', hàm)`: `input` chạy sau mỗi lần giá trị ô đổi (gõ, dán, xoá), khác `change` chỉ chạy khi rời ô.
- `counter.toggleAttribute('data-warning', điều kiện)`: bật thuộc tính khi điều kiện `true`, gỡ khi `false` (tham số thứ hai `force`).
- `string.trim()`: cắt dấu cách đầu và cuối chuỗi, trả chuỗi mới.
- `event.target.closest(selector)`: đi ngược từ phần tử được bấm lên cha, trả phần tử khớp selector đầu tiên hoặc `null`.
- `element.getBoundingClientRect()`: trả hình chữ nhật của phần tử so với cửa sổ nhìn (`left`, `top`, `width`, `height`). `event.clientX`, `clientY` là toạ độ con trỏ cũng so với cửa sổ nhìn.
- `style.setProperty('--mx', giá trị)`: ghi một biến CSS vào thuộc tính `style` của phần tử.
- `number.toFixed(1)`: làm tròn đến 1 chữ số thập phân, trả chuỗi.
- `card.contains(event.relatedTarget)`: trả `true` nếu phần tử đưa vào nằm trong `card` hoặc chính là `card`; `false` nếu không, kể cả `null`. `relatedTarget` của `pointerout` là phần tử con trỏ đi tới.
- `pointermove`, `pointerout`: hai Pointer Event nổi bọt lên `list`, nên một listener nghe được mọi thẻ, kể cả thẻ tạo sau.
- `element.hidden = true/false`, `button.disabled = true/false`: thuộc tính HTML tương ứng; `hidden` ẩn phần tử, `disabled` khoá nút.
- `` `...${biểu thức}...` ``: chuỗi mẫu. `if (điều kiện) { return; }`: return sớm, thoát khỏi hàm. `===`, `!==`, `<=`, `>`: so sánh chặt chẽ và so sánh số. `||` trong `card === null || ...`: đúng nếu một trong hai vế đúng.
- `Number(chuỗi)`: đổi `dataset.id` (luôn là chuỗi) về số để so sánh với `note.id` kiểu số.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `bg-[radial-gradient(circle_at_var(--mx)_var(--my),rgba(255,255,255,0.4),transparent_55%)]` | `.shine { background: radial-gradient(circle at var(--mx) var(--my), rgba(255, 255, 255, 0.4), transparent 55%) }` |
| `group-hover:opacity-100` cùng `opacity-0 transition-opacity duration-300` | `.shine { opacity: 0; transition: opacity 300ms }` và `.note:hover .shine { opacity: 1 }` |
| `pointer-events-none` | `.shine { pointer-events: none }` |
| `rotate-x-(--rx) rotate-y-(--ry) transition-transform duration-200` | `.note-body { transform: rotateX(var(--rx)) rotateY(var(--ry)); transition: transform 200ms }` |
| `group perspective-midrange` trên `<li>` | `.note { perspective: 800px }` (`:hover` thay cho `group`) |
| `group-data-[color=sky]:from-sky-300/50 group-data-[color=sky]:to-sky-600/30` | `.note[data-color="sky"] .note-body { background: linear-gradient(to bottom right, ...) }` |
| `backdrop-blur-md border border-white/30` | `backdrop-filter: blur(12px); border: 1px solid rgb(255 255 255 / 0.3)` |
| `wrap-anywhere whitespace-pre-wrap` | `overflow-wrap: anywhere; white-space: pre-wrap` |
| `disabled:cursor-not-allowed disabled:opacity-40` | `.add-button:disabled { cursor: not-allowed; opacity: 0.4 }` |

Khác biệt nhỏ: Tailwind nội suy màu gradient trong không gian `oklab` nên sắc độ hơi khác bản CSS thuần; hình dạng và vị trí giống nhau.
