# Bài 015: Vòng tiến độ uống nước bằng `conic-gradient` và bẫy điểm dừng cứng

Ngày học 6, bài 2/3, cấp 1, chủ đề CSS: Gradient (ứng dụng theo dõi sức khoẻ), độ khó ★★★★, thời gian ước tính 40 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Tải lại trang thì số nước đã uống về 0. Đây là hành vi đúng của bài.

## Mục tiêu

- Vẽ **vòng tròn tiến độ** bằng một lớp `conic-gradient` có **điểm dừng cứng**, độ dài của phần xanh do biến `--pct` mà JS ghi quyết định.
- Đạt mục tiêu 2000 ml thì vòng đổi sang xanh lá nhờ thuộc tính `data-reached`.
- Ba nút nhanh (+150, +250, +500) và ô nhập "lượng khác" (số nguyên 50 đến 1000) cộng vào tổng; "Hoàn tác" lấy lần uống cuối ra; danh sách chỉ hiện **năm lần gần nhất, lần mới nhất ở trên**.
- Dùng đúng `pop`, `toFixed`, `reverse` và cú pháp trải `...`. Tự gặp hai cái bẫy: điểm dừng mềm làm vòng nhoè, và `Math.round` làm vòng đầy khi chưa đủ mục tiêu.

## Kết quả mong đợi

Trang nền gradient xanh nhạt xuống trắng. Giữa trang là một vòng tròn lớn xám nhạt; trong lỗ vòng có "0 ml", "0.00 L", "0%". Bấm +250: phần xanh chiếm 12% vòng quanh từ vị trí 12 giờ theo chiều kim đồng hồ, chữ đổi thành "250 ml", "0.25 L", "12%". Uống đủ 2000 ml thì cả vòng chuyển xanh lá kèm dòng "Đạt mục tiêu hôm nay!".

## Tư duy

**Gradient hình nón và điểm dừng.** `conic-gradient` đổi màu **theo góc quanh tâm**, không theo đường thẳng. Mỗi màu có một "điểm dừng" là vị trí tính theo phần trăm vòng quay. Nếu viết `xanh 40%, xám` thì trình duyệt **pha màu mượt** từ xanh sang xám trải khắp 40% đến 100%: vòng nhoè như cầu vồng. Muốn ranh giới sắc nét như kim đồng hồ phải viết **điểm dừng cứng**: màu thứ hai bắt đầu đúng chỗ màu thứ nhất kết thúc, tức `xám 0%`. Quy tắc CSS: điểm dừng nhỏ hơn điểm dừng trước nó được nâng lên bằng điểm trước, nên `0%` nghĩa là "bắt đầu ngay tại chỗ màu trên kết thúc".

**Biến CSS làm cầu nối.** JS không sửa gradient, chỉ ghi một con số: `ring.style.setProperty('--pct', 40)`. Gradient dùng `calc(var(--pct,0) * 1%)` để đổi số 40 thành `40%`. Phép nhân `* 1%` là bắt buộc: `var(--pct)` chỉ là số không đơn vị, còn điểm dừng của gradient cần **phần trăm**; thiếu phép nhân thì cả khai báo `background` hỏng và vòng biến mất. `,0` trong `var(--pct,0)` là giá trị dự phòng khi JS chưa ghi gì.

**Lỗ ở giữa.** Gradient là nền hình đĩa. Muốn thành vòng ta đặt thêm một hình tròn trắng nhỏ hơn nằm giữa: nhờ `grid` và `place-items-center` nó tự canh giữa. Chữ nằm trong hình tròn trắng đó.

**Bẫy làm tròn.** 1990 ml là 99,5%. `Math.round(99.5)` ra 100: vòng đầy mà chưa đạt mục tiêu, nhìn như bị gian lận. Dùng `Math.floor` (làm tròn xuống) thì 100% chỉ xuất hiện khi thật sự đủ 2000. Còn `Math.min(100, ...)` giữ vòng không vượt quá 100% khi uống nhiều hơn mục tiêu.

**Số thập phân.** `(total / 1000).toFixed(2)`: `toFixed(2)` đổi số thành **chuỗi** có đúng hai chữ số sau dấu phẩy, vì 0,1 + 0,2 trong máy tính ra 0,30000000000000004. Ta cộng bằng ml (số nguyên) và chỉ đổi sang lít khi hiển thị.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Vòng gradient hình nón, độ dài phần xanh theo `var(--pct)` | Tính phần trăm, ghi `--pct` bằng `style.setProperty` |
| Vòng xanh lá khi `data-reached:` | Bật `data-reached` khi `total >= goal` bằng `toggleAttribute(tên, force)` |
| Nút "Hoàn tác" xám khi `disabled:` | Ghi `disabled` khi mảng rỗng |
| Dòng trong danh sách (template có sẵn class) | Tạo dòng từ `template`, ghi chữ |

JS không thêm hoặc gỡ class, không đặt `style.background`, không tìm phần tử bằng class. JS chỉ tìm bằng `data-*` hoặc `name`.

## Ôn lại

- Bài 007 (`bai-007-the-thoi-tiet`): `bg-linear-to-br`, `from-`/`to-`, `data-[...]:`.
- Bài 011 (`bai-011-xem-can-ho-3d`): `style.setProperty` ghi biến `--angle`, `Math.min`.
- Bài 009 và 012: `FormData`, `template.content.cloneNode(true)`, `replaceChildren`, `submit` với `preventDefault`.
- Bài 006 (`bai-006-gio-hang`): `reduce` tính tổng, `Number`, `dataset`, `disabled:`.
- Bài 007: `Number.isInteger`.

## Gợi ý từng bước

> Starter đã điền sẵn: nền gradient `bg-linear-to-b from-sky-50 to-white`, thẻ giữa trang, hình tròn trắng giữa vòng, ba nút nhanh, ô nhập, nút "Hoàn tác" với `disabled:`, danh sách và `<template>`. Thẻ `<div data-ring>` đã có kích thước và `rounded-full`, **chưa có màu nền nào**: vòng đang trong suốt.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-ring` (vòng, nơi sẽ ghi `--pct`), `data-total` (thẻ `<output>`), `data-litres`, `data-percent`, `data-status` (có `role="status"`), `data-quick` với ba nút `data-add="150|250|500"`, `data-form` có `novalidate`, `data-error` (có `role="alert"`), `data-undo`, `data-empty`, `data-log` và `<template data-log-template>`. Kiểm tra: mở trang chỉ thấy chữ "0 ml" nổi trên nền; chưa có vòng.

2. **CSS: vòng gradient và hai cái bẫy.** **Bạn làm:** trên `<div data-ring>` thêm `bg-[conic-gradient(var(--color-sky-500)_calc(var(--pct,0)_*_1%),var(--color-zinc-200)_0%)]` và `data-reached:bg-[conic-gradient(var(--color-emerald-500)_calc(var(--pct,0)_*_1%),var(--color-zinc-200)_0%)]`. Dấu `_` trong ngoặc vuông của Tailwind là dấu cách. Làm **theo đúng thứ tự** để gặp bẫy: (a) viết thử chỉ `bg-[conic-gradient(var(--color-sky-500)_calc(var(--pct,0)_*_1%),var(--color-zinc-200))]` (thiếu `_0%`), rồi trong DevTools gõ vào thuộc tính `style` của vòng `--pct: 40`: vòng nhoè từ xanh sang xám, không có ranh giới. Thêm `_0%` vào sau màu xám: ranh giới sắc nét. (b) Thử viết `calc(var(--pct,0))` không có `*_1%`: vòng biến mất hoàn toàn, vì khai báo không hợp lệ. Sửa lại cho đúng. Kiểm tra: `--pct: 40` cho phần xanh chiếm 40% quanh vòng từ 12 giờ theo chiều kim đồng hồ; thêm tay thuộc tính `data-reached` thì vòng xanh lá.

3. **JS: tổng và hiển thị.** **Bạn làm:** toàn bộ JS. Khai báo `const goal = 2000` và `const logs = []` (mảng số ml). Viết `getTotal()` bằng `logs.reduce(function (sum, amount) { return sum + amount; }, 0)` (số `0` là giá trị khởi đầu của `sum`, bài 006). Viết `render()`: `const total = getTotal()`; `const percent = Math.min(100, Math.floor((total / goal) * 100))`; `ring.style.setProperty('--pct', percent)`; ghi `totalOutput.textContent`, `percentText.textContent`, và `litresText.textContent` bằng chuỗi mẫu chứa `(total / 1000).toFixed(2)` cộng chữ ` L`. `toFixed(2)` trả **chuỗi** có đúng hai chữ số thập phân: `(0.25).toFixed(2)` là `'0.25'`, `(2).toFixed(2)` là `'2.00'`. Cuối file gọi `render()`. Kiểm tra: trong DevTools gõ `logs.push(250); render();` thì vòng xanh 12%, chữ đổi theo.

4. **JS: nút nhanh.** **Bạn làm:** toàn bộ JS. Viết `addWater(amount)`: `logs.push(amount)` rồi `render()`. Gắn **một** `click` ở `[data-quick]`: `event.target.closest('[data-add]')`, `null` thì `return`, không thì `addWater(Number(button.dataset.add))`. Kiểm tra: bấm +500 bốn lần thì tổng 2000, `100%`; bấm thêm một lần nữa thì tổng 2500 nhưng vòng vẫn 100% (nhờ `Math.min`). Thử đổi `Math.floor` thành `Math.round`: bấm +500 ba lần, +250 một lần rồi nhập 249 (tổng 1999): vòng ghi 100% mà chưa đạt. Đổi lại `Math.floor`.

5. **JS: màu xanh lá khi đạt mục tiêu.** **Bạn làm:** toàn bộ JS. Trong `render()` thêm `ring.toggleAttribute('data-reached', total >= goal)`. Tham số thứ hai `force` là `true` thì thêm thuộc tính, `false` thì gỡ; không có nó thì `toggleAttribute` chỉ **đảo** và sẽ sai khi `render()` chạy lại nhiều lần. Thêm `statusText.textContent = total >= goal ? 'Đạt mục tiêu hôm nay!' : ''`. Kiểm tra: đủ 2000 ml vòng xanh lá; hoàn tác (bước 7) thì quay lại xanh da trời.

6. **JS: nhập lượng khác.** **Bạn làm:** toàn bộ JS. Gắn `submit` ở `form`, `event.preventDefault()`. `const amount = Number(new FormData(form).get('amount').trim())`. Hợp lệ khi `Number.isInteger(amount)` đúng và `amount` từ 50 đến 1000. Không hợp lệ thì ghi `errorText.textContent = ...` và `return` (return sớm). Hợp lệ thì `addWater(amount)` và `form.reset()`. Trong `addWater` xoá `errorText.textContent`. Kiểm tra: nhập `abc`, `12.5`, `30`, `5000`, để trống: đều báo lỗi và không đổi tổng; nhập `300` thì cộng 300 và ô nhập trống lại.

7. **JS: danh sách năm lần gần nhất và hoàn tác.** **Bạn làm:** toàn bộ JS. Viết `createLogItem(amount)`: `template.content.firstElementChild.cloneNode(true)`, ghi chữ `+${amount} ml` vào `[data-log-amount]`, trả phần tử. Trong `render()`: `logs.slice(-5)` lấy năm phần tử cuối (số âm đếm từ cuối), `.reverse()` **đảo ngược mảng ngay tại chỗ** nhưng vì `slice` đã tạo bản sao nên `logs` gốc không bị đảo, `.map(createLogItem)` đổi mỗi số thành một `<li>`. Rồi `logList.replaceChildren(...items)`: dấu `...` (toán tử trải) rải từng phần tử của mảng thành từng đối số riêng, vì `replaceChildren` nhận nhiều nút chứ không nhận một mảng. Ghi `empty.hidden = logs.length > 0` và `undoButton.disabled = logs.length === 0`. Nút hoàn tác: `logs.pop()` (gỡ **phần tử cuối** khỏi mảng và trả về nó; mảng rỗng thì trả `undefined`) rồi `render()`. Kiểm tra: bấm 7 lần thì chỉ hiện 5 dòng, lần mới nhất ở trên cùng; hoàn tác thì dòng trên cùng biến mất và dòng cũ hơn hiện lại; hết thì hiện "Chưa uống ly nào." và nút "Hoàn tác" xám.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `bg-[conic-gradient(...)]` | `background: conic-gradient(#0ea5e9 calc(var(--pct, 0) * 1%), #e4e4e7 0%)` |
| `data-reached:bg-[conic-gradient(...)]` | `.ring[data-reached] { background: conic-gradient(#10b981 ..., #e4e4e7 0%) }` |
| `_` trong ngoặc vuông | dấu cách |
| `size-56` và `size-44` | `width/height: 224px` và `176px` |
| `grid place-items-center` | `display: grid; place-items: center` |
| `disabled:text-zinc-400 disabled:no-underline` | `.undo:disabled { color: #a1a1aa; text-decoration: none }` |
| `transition-colors motion-reduce:transition-none` | `transition: background-color 150ms` và `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Vòng bắt đầu từ 12 giờ, chạy theo chiều kim đồng hồ, ranh giới xanh/xám sắc nét; chữ ở giữa đúng.
- [ ] 1999 ml ghi 99%, 2000 ml ghi 100% và vòng xanh lá kèm "Đạt mục tiêu hôm nay!"; 2500 ml vòng không "tràn", vẫn 100%.
- [ ] Nhập sai (chữ, thập phân, ngoài khoảng, trống) đều báo lỗi; nhập đúng thì xoá lỗi và trống ô.
- [ ] Danh sách tối đa năm dòng, mới nhất ở trên; "Hoàn tác" hoạt động tới khi hết và nút xám.
- [ ] DevTools: sửa `--pct` bằng tay trên thẻ vòng và xem vòng đổi theo; gỡ `_0%` để thấy vòng nhoè; thay `*_1%` bằng rỗng để thấy vòng biến mất.
- [ ] Bàn phím: Tab qua ba nút nhanh, ô nhập, nút Thêm, Hoàn tác; Enter ở ô nhập gửi form; viền focus rõ.
- [ ] Bật `prefers-reduced-motion: reduce`: nút đổi màu tức thì (vòng vốn không có chuyển động).
- [ ] Tự hỏi: vì sao điểm dừng `0%` làm ranh giới sắc? Vì sao dùng `Math.floor` chứ không `Math.round`? Vì sao `reverse()` sau `slice(-5)` không làm hỏng `logs`?

## Thử thách thêm

1. Cho vòng chạy mượt khi đổi `--pct`: khai báo `@property --pct` với `syntax: '<number>'`, rồi thêm `transition`. Gợi ý: Tailwind không viết được `@property`, bạn cần thẻ `<style>` nhỏ; đừng quên `motion-reduce`. Giải thích vì sao biến CSS bình thường **không** chuyển động được.
2. Đổi mục tiêu: thêm ô chọn mục tiêu 1500/2000/2500; `goal` thành `let`. Ghi mục tiêu vào `data-goal` trên vòng và chữ "Mục tiêu ... ml".

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
		<title>Bài 015 - Theo dõi uống nước</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<section class="card">
				<h1 class="title">Uống nước hôm nay</h1>
				<p class="goal">Mục tiêu 2000 ml</p>
				<div data-ring class="ring">
					<div class="hole">
						<p class="total"><output data-total>0</output> ml</p>
						<p data-litres class="litres">0.00 L</p>
						<p data-percent class="percent">0%</p>
					</div>
				</div>
				<p data-status role="status" class="status"></p>
				<div data-quick class="quick">
					<button type="button" data-add="150" class="quick-button">+150 ml</button>
					<button type="button" data-add="250" class="quick-button">+250 ml</button>
					<button type="button" data-add="500" class="quick-button">+500 ml</button>
				</div>
				<form data-form novalidate class="custom">
					<label for="amount" class="custom-label">Lượng khác (50 đến 1000 ml)</label>
					<div class="custom-row">
						<input id="amount" type="text" name="amount" inputmode="numeric" autocomplete="off" class="custom-input" />
						<button type="submit" class="custom-submit">Thêm</button>
					</div>
				</form>
				<p data-error role="alert" class="error"></p>
				<div class="log-head">
					<h2 class="log-title">Năm lần uống gần nhất</h2>
					<button type="button" data-undo class="undo">Hoàn tác</button>
				</div>
				<p data-empty class="empty">Chưa uống ly nào.</p>
				<ul data-log class="log"></ul>
			</section>
		</main>
		<template data-log-template>
			<li class="log-item">
				<span data-log-amount class="log-amount"></span>
				<span class="log-note">một lần uống</span>
			</li>
		</template>
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

[hidden] {
	display: none !important;
}

button,
input {
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

h1,
h2 {
	font-size: inherit;
	font-weight: inherit;
}

.site {
	min-height: 100vh;
	background: linear-gradient(to bottom, #f0f9ff, #ffffff);
	color: #18181b;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	max-width: 448px;
	margin: 0 auto;
	padding: 32px 24px;
}

.card {
	text-align: center;
}

.title {
	font-size: 24px;
	font-weight: 700;
	color: #0369a1;
}

.goal {
	font-size: 14px;
	color: #71717a;
}

.ring {
	display: grid;
	place-items: center;
	width: 224px;
	height: 224px;
	margin: 24px auto 0;
	border-radius: 9999px;
	background: conic-gradient(#0ea5e9 calc(var(--pct, 0) * 1%), #e4e4e7 0%);
}

.ring[data-reached] {
	background: conic-gradient(#10b981 calc(var(--pct, 0) * 1%), #e4e4e7 0%);
}

.hole {
	display: grid;
	place-items: center;
	align-content: center;
	width: 176px;
	height: 176px;
	border-radius: 9999px;
	background: #ffffff;
}

.total {
	font-size: 30px;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
}

.litres {
	font-size: 14px;
	color: #71717a;
}

.percent {
	font-size: 14px;
	font-weight: 600;
	color: #0369a1;
}

.status {
	min-height: 24px;
	margin-top: 12px;
	font-weight: 600;
	color: #047857;
}

.quick {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 8px;
	margin-top: 8px;
}

.quick-button,
.custom-submit {
	padding: 10px 0;
	border-radius: 8px;
	background: #0ea5e9;
	font-weight: 600;
	color: #ffffff;
	transition: background-color 150ms;
}

.quick-button:hover,
.custom-submit:hover {
	background: #0284c7;
}

.quick-button:focus-visible,
.custom-submit:focus-visible,
.custom-input:focus-visible,
.undo:focus-visible {
	outline: 2px solid #0369a1;
	outline-offset: 2px;
}

.custom {
	margin-top: 16px;
	text-align: left;
}

.custom-label {
	display: block;
	font-size: 14px;
	font-weight: 600;
}

.custom-row {
	display: flex;
	gap: 8px;
	margin-top: 4px;
}

.custom-input {
	flex: 1;
	min-width: 0;
	padding: 8px 12px;
	border: 1px solid #d4d4d8;
	border-radius: 8px;
	background: #ffffff;
}

.custom-submit {
	padding-left: 16px;
	padding-right: 16px;
}

.error {
	min-height: 24px;
	margin-top: 4px;
	font-size: 14px;
	color: #e11d48;
	text-align: left;
}

.log-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 16px;
	text-align: left;
}

.log-title {
	font-weight: 600;
}

.undo {
	font-size: 14px;
	color: #0369a1;
	text-decoration: underline;
}

.undo:disabled {
	color: #a1a1aa;
	cursor: not-allowed;
	text-decoration: none;
}

.empty {
	margin-top: 8px;
	font-size: 14px;
	color: #71717a;
	text-align: left;
}

.log-item {
	display: flex;
	justify-content: space-between;
	padding: 8px 0;
	border-bottom: 1px solid #e4e4e7;
	font-size: 14px;
	text-align: left;
}

.log-item:last-child {
	border-bottom: 0;
}

.log-amount {
	font-weight: 500;
}

.log-note {
	color: #71717a;
}

@media (prefers-reduced-motion: reduce) {
	.quick-button,
	.custom-submit {
		transition: none;
	}
}
```

`solution/script.js`

```js
const goal = 2000;
const minAmount = 50;
const maxAmount = 1000;
const logs = [];
const ring = document.querySelector('[data-ring]');
const totalOutput = document.querySelector('[data-total]');
const litresText = document.querySelector('[data-litres]');
const percentText = document.querySelector('[data-percent]');
const statusText = document.querySelector('[data-status]');
const quick = document.querySelector('[data-quick]');
const form = document.querySelector('[data-form]');
const errorText = document.querySelector('[data-error]');
const undoButton = document.querySelector('[data-undo]');
const empty = document.querySelector('[data-empty]');
const logList = document.querySelector('[data-log]');
const template = document.querySelector('[data-log-template]');

function getTotal() {
	return logs.reduce(function (sum, amount) {
		return sum + amount;
	}, 0);
}

function createLogItem(amount) {
	const item = template.content.firstElementChild.cloneNode(true);
	item.querySelector('[data-log-amount]').textContent = `+${amount} ml`;
	return item;
}

function render() {
	const total = getTotal();
	const percent = Math.min(100, Math.floor((total / goal) * 100));
	ring.style.setProperty('--pct', percent);
	ring.toggleAttribute('data-reached', total >= goal);
	totalOutput.textContent = total;
	litresText.textContent = `${(total / 1000).toFixed(2)} L`;
	percentText.textContent = `${percent}%`;
	statusText.textContent = total >= goal ? 'Đạt mục tiêu hôm nay!' : '';
	undoButton.disabled = logs.length === 0;
	empty.hidden = logs.length > 0;
	const items = logs.slice(-5).reverse().map(createLogItem);
	logList.replaceChildren(...items);
}

function addWater(amount) {
	logs.push(amount);
	errorText.textContent = '';
	render();
}

quick.addEventListener('click', function (event) {
	const button = event.target.closest('[data-add]');
	if (!button) {
		return;
	}
	addWater(Number(button.dataset.add));
});

form.addEventListener('submit', function (event) {
	event.preventDefault();
	const amount = Number(new FormData(form).get('amount').trim());
	if (!Number.isInteger(amount) || amount < minAmount || amount > maxAmount) {
		errorText.textContent = `Nhập số nguyên từ ${minAmount} đến ${maxAmount} ml.`;
		return;
	}
	addWater(amount);
	form.reset();
});

undoButton.addEventListener('click', function () {
	if (logs.length === 0) {
		return;
	}
	logs.pop();
	render();
});

render();
```

</details>

### Giải thích từng hàm

- `getTotal()`: hàm tự đặt, không nhận gì, trả tổng các số trong `logs`.
- `createLogItem(amount)`: hàm tự đặt, nhận một số ml, trả một `<li>` mới nhân bản từ template với chữ `+amount ml`.
- `render()`: hàm tự đặt, không nhận và không trả gì; tính lại tổng, phần trăm, ghi `--pct`, `data-reached`, chữ, trạng thái nút, dựng lại danh sách.
- `addWater(amount)`: hàm tự đặt; thêm lượng vào `logs`, xoá thông báo lỗi, gọi `render()`.
- `logs.reduce(hàm, 0)`: duyệt mảng, gom thành một giá trị; `sum` là kết quả tích luỹ, `amount` là phần tử hiện tại, `0` là giá trị khởi đầu.
- `Math.floor(x)`: làm tròn xuống số nguyên gần nhất. `Math.min(a, b)`: trả số nhỏ hơn, ở đây chặn tối đa 100.
- `ring.style.setProperty('--pct', percent)`: ghi một **biến CSS** vào thuộc tính `style` của phần tử; tên biến phải bắt đầu `--`. Số được ghi thành chuỗi `"12"`.
- `ring.toggleAttribute('data-reached', total >= goal)`: `toggleAttribute(tên)` đảo có/không; thêm tham số thứ hai `force` thì `true` luôn thêm, `false` luôn gỡ. Ở đây `force` là kết quả so sánh.
- `(total / 1000).toFixed(2)`: `Number.prototype.toFixed(số chữ số)` trả chuỗi làm tròn tới đúng ngần ấy chữ số thập phân.
- Chuỗi mẫu `` `${x} L` ``: dấu huyền, `${...}` chèn giá trị biến vào chuỗi.
- `total >= goal ? 'a' : ''`: toán tử ba ngôi; đúng ra `'a'`, sai ra chuỗi rỗng.
- `logs.slice(-5)`: trả **bản sao** gồm tối đa năm phần tử cuối (số âm đếm từ cuối); không sửa `logs`.
- `.reverse()`: đảo thứ tự mảng **ngay tại chỗ** và trả chính mảng đó; an toàn ở đây vì nó đảo bản sao do `slice` tạo.
- `.map(createLogItem)`: tạo mảng mới bằng cách gọi `createLogItem` cho từng phần tử; truyền tên hàm không có `()`.
- `logList.replaceChildren(...items)`: thay toàn bộ con của `<ul>` bằng các nút truyền vào. `...items` (toán tử trải) rải mảng thành từng đối số; mảng rỗng thì xoá sạch danh sách.
- `template.content.firstElementChild.cloneNode(true)`: lấy `<li>` đầu tiên trong ruột template và nhân bản toàn bộ cây con (`true`).
- `logs.push(amount)`: thêm phần tử vào **cuối** mảng. `logs.pop()`: gỡ phần tử **cuối** và trả nó, mảng rỗng thì trả `undefined`; ta không dùng giá trị trả về.
- `new FormData(form).get('amount')`: trả giá trị chuỗi của ô tên `amount`. `.trim()` cắt khoảng trắng hai đầu. `Number(chuỗi)`: đổi chuỗi sang số, chuỗi rỗng ra `0`, chữ ra `NaN`.
- `Number.isInteger(x)`: `true` nếu `x` là số nguyên; `NaN` và `12.5` ra `false`.
- `!Number.isInteger(amount) || amount < minAmount || amount > maxAmount`: `!` đảo đúng sai; `||` đúng khi có ít nhất một vế đúng, nên đây là "không hợp lệ".
- `form.reset()`: trả mọi ô của form về giá trị ban đầu. `event.preventDefault()`: chặn trình duyệt tải lại trang khi gửi form.
- `event.target.closest('[data-add]')`: đi ngược lên từ phần tử bị bấm, trả tổ tiên đầu tiên khớp hoặc `null`; `if (!button) { return; }` là return sớm.
- `button.dataset.add`: đọc `data-add`, luôn là chuỗi nên bọc `Number(...)`.
- `element.hidden`, `button.disabled`, `element.textContent`: thuộc tính ẩn/hiện, khoá nút, và ghi chữ.
- `addEventListener('click' | 'submit', hàm)`: gắn hàm chạy mỗi lần có sự kiện.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `bg-[conic-gradient(var(--color-sky-500)_calc(var(--pct,0)_*_1%),var(--color-zinc-200)_0%)]` | `.ring { background: conic-gradient(#0ea5e9 calc(var(--pct, 0) * 1%), #e4e4e7 0%) }` |
| `data-reached:bg-[conic-gradient(var(--color-emerald-500)...)]` | `.ring[data-reached] { background: conic-gradient(#10b981 calc(var(--pct, 0) * 1%), #e4e4e7 0%) }` |
| `size-44 rounded-full bg-white` (lỗ giữa) | `.hole { width: 176px; height: 176px; border-radius: 9999px; background: #ffffff }` |
| `bg-linear-to-b from-sky-50 to-white` | `.site { background: linear-gradient(to bottom, #f0f9ff, #ffffff) }` |
| `grid grid-cols-3 gap-2` | `.quick { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px }` |
| `disabled:cursor-not-allowed disabled:text-zinc-400` | `.undo:disabled { cursor: not-allowed; color: #a1a1aa }` |

Khác biệt nhỏ: Tailwind viết khoảng trắng bằng `_` trong ngoặc vuông và dùng biến màu `var(--color-sky-500)`; CSS thuần dùng thẳng mã màu hex.
