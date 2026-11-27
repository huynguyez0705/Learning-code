# Bài 023: Lịch tập luyện, gradient ba điểm dừng và cái bẫy cuối tháng của `Date`

Ngày học 9, bài 1/3, cấp 2, chủ đề CSS: Gradient (ứng dụng lịch tập luyện), độ khó ★★★☆☆, thời gian ước tính 40 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này **không** lưu gì. Cường độ tập mỗi ngày được tính bằng công thức từ ngày tháng, nên tải lại trang là ra đúng như cũ; ngày đang chọn và tháng đang xem thì về mặc định (tháng hiện tại, chưa chọn ngày).

## Mục tiêu

- Dựng một lịch tháng bằng `Date`: tiêu đề "tháng 11 năm 2026" lấy từ `Intl.DateTimeFormat`, đúng số ngày của tháng (28, 29, 30 hay 31), ngày mùng 1 đứng đúng cột thứ (tuần bắt đầu từ thứ Hai).
- Nút ‹ và › đổi tháng, vượt qua ranh giới năm đúng (tháng 12 bấm › ra tháng 1 năm sau). Không có tháng nào bị nhảy cóc, kể cả khi đang đứng ở ngày 31.
- Chủ nhật là ngày nghỉ: nút bị `disabled`, phủ gạch chéo bằng một `repeating-linear-gradient`. Ngày khác tô ba mức cường độ qua `data-level`; ngày hôm nay có viền đậm.
- Bấm một ngày thì ngày đó đổi sang gradient cam sang tím và dòng chi tiết bên dưới hiện đúng "Thứ Ba, 10 tháng 11 · Cường độ nhẹ · Chạy bộ 5 km". Bấm bằng bàn phím cũng chạy, và focus không bị mất.
- Tiêu đề trang dùng gradient ba điểm dừng (cam, hồng, tím) chéo 115 độ.

## Kết quả mong đợi

Một thẻ trắng bo tròn, đầu thẻ là dải gradient chuyển từ cam qua hồng sang tím, giữa dải là tên tháng với hai nút tròn mờ hai bên và dòng "25 ngày tập · 5 ngày nghỉ". Bên dưới là hàng T2 đến CN và lưới ngày: ô nhạt là tập nhẹ, ô cam là vừa, ô hồng là nặng, ô Chủ nhật có sọc chéo xám và chữ mờ. Ô được chọn nhuộm gradient, dòng chi tiết đổi theo.

## Tư duy

**Đối tượng `Date` đếm tháng từ 0.** `new Date(2026, 10, 1)` là ngày 1 **tháng 11** (tháng 10 theo chỉ số). `getMonth()` trả 0 đến 11, `getDay()` trả 0 (Chủ nhật) đến 6 (thứ Bảy). Đây là nguồn lỗi lệch một tháng kinh điển.

**Mẹo "ngày số 0".** Số ngày của một tháng không có hàm riêng. Ta hỏi ngược: `new Date(năm, tháng + 1, 0)` là "ngày số 0 của tháng sau", tức ngày cuối cùng của tháng này. `.getDate()` của nó chính là số ngày trong tháng. `Date` tự "cuộn" các giá trị ngoài khoảng: ngày 0 lùi về ngày cuối tháng trước, tháng 12 sang tháng 1 năm sau.

**Cái bẫy: `setMonth` trên ngày 31.** Giả sử bạn giữ một `Date` làm state rồi bấm › bằng `viewDate.setMonth(viewDate.getMonth() + 1)`. Đứng ở 31/01, thêm một tháng ra "31/02", mà tháng 2 không có ngày 31 nên `Date` cuộn thành 03/03: lịch **nhảy cóc** từ tháng 1 sang tháng 3. Giống bấm thang máy lên một tầng mà cửa mở ở tầng ba. Cách chữa: đừng giữ ngày trong state, chỉ giữ `year` và `month` (hai số), và khi cần thì dựng `new Date(year, month + step, 1)` với **ngày 1**, ngày duy nhất tháng nào cũng có.

**Gradient nhiều điểm dừng và gradient lặp.** `from-*`, `via-*`, `to-*` là ba điểm dừng màu; Tailwind chỉ vẽ gradient khi có một class hướng (`bg-linear-to-br` hoặc `bg-linear-115` cho góc 115 độ), thiếu nó thì `from-*`/`to-*` không có tác dụng. `repeating-linear-gradient` lặp đi lặp lại một đoạn màu thành sọc, rất hợp để báo "ô này đang bị khoá". Ô nghỉ bị `disabled` nên không bao giờ vừa nghỉ vừa được chọn: hai gradient (sọc và ô chọn) không phải tranh nhau cùng một thuộc tính `background-image`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| `bg-linear-115 from-* via-* to-*` tô gradient tiêu đề | Điền chữ tên tháng và dòng tóm tắt |
| `data-[level=1]:bg-*` ... đổi màu ô theo mức | Tính mức bằng `getLevel` rồi ghi `dataset.level` |
| `disabled:bg-[repeating-linear-gradient(...)]` gạch chéo ngày nghỉ | Ghi thuộc tính `disabled` cho ngày Chủ nhật |
| `data-today:border-stone-900` viền hôm nay | `toggleAttribute('data-today', ...)` |
| `aria-pressed:bg-linear-to-br ...` ô đang chọn | `setAttribute('aria-pressed', ...)` |

JS không thêm hoặc gỡ class, không đặt `style.background`, không tìm phần tử bằng class.

## Ôn lại

- Bài 007 (`bai-007-the-thoi-tiet`): `bg-linear-to-br`, `from-*`, `to-*`, `data-[...]:`.
- Bài 015 (`bai-015-theo-doi-uong-nuoc`): `bg-[...]` với gradient tuỳ ý và dấu `_` thay cho khoảng trắng.
- Bài 006 (`bai-006-gio-hang`): `disabled:` và `cursor-not-allowed`; bài 014 (`bai-014-hop-thu-huy-hieu`): `aria-pressed:`, `toggleAttribute`.
- Bài 020 (`bai-020-ghi-chu-kinh-mo`): `Intl.DateTimeFormat('vi-VN', ...)`; bài 009 (`bai-009-quiz-kinh-mo`): `template.content.cloneNode(true)`, `replaceChildren`.

## Gợi ý từng bước

> Starter đã điền sẵn: toàn bộ bố cục, hai nút ‹ ›, hàng T2 đến CN, lưới, dòng chi tiết, hai `<template>`; trên `<header>` có sẵn `from-orange-400 to-fuchsia-600`; trên nút ngày trong template có sẵn bốn mức `data-[level=N]:`, `data-today:`, ô được chọn `aria-pressed:bg-linear-to-br aria-pressed:from-orange-500 aria-pressed:to-fuchsia-600`, `disabled:cursor-not-allowed disabled:text-stone-400`. Bạn tự thêm hai nhóm class gradient mới: **gradient ba điểm dừng ở tiêu đề** và **sọc chéo của ngày nghỉ**.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc `data-app`, `data-prev`, `data-next`, `data-title`, `data-summary`, `data-grid`, `data-detail`, `<template data-blank-template>` (ô trống đầu tháng) và `<template data-day-template>` (nút `data-day` với `aria-pressed="false"`). Kiểm tra: mở trang thấy thẻ có hàng T2 đến CN, chưa có ngày nào; tiêu đề chưa có gradient (vì thiếu class hướng).

2. **JS: dựng lưới tháng bằng `Date`.** **Bạn làm:** toàn bộ JS. Tạo `state = { year, month, selected }` từ `new Date()` (`getFullYear()`, `getMonth()`). Viết `render()`: ngày mùng 1 là `new Date(year, month, 1)`; số ngày trong tháng là `new Date(year, month + 1, 0).getDate()`; số ô trống đầu tháng là `(first.getDay() + 6) % 7` (đổi Chủ nhật = 0 thành cột cuối, thứ Hai thành cột đầu). Với ô trống nhân bản `blankTemplate.content.firstElementChild`, với mỗi ngày nhân bản nút từ `dayTemplate` (`cloneNode(true)`), ghi `dataset.day`, `dataset.level`, `textContent`, `disabled` cho Chủ nhật (`getDay() === 0`) và `toggleAttribute('data-today', ...)` cho hôm nay. Gom vào mảng rồi `grid.replaceChildren(...cells)`. Mức `getLevel`: `0` cho ngày nghỉ, ngược lại `1 + ((ngày * 5 + tháng) % 3)` (công thức giả lập). Kiểm tra: tháng 11/2026 có 30 ô, ngày 1 đứng ở cột Chủ nhật (cột cuối), 5 ô Chủ nhật bị khoá, ngày hôm nay có viền đen; các ô đã đổi màu theo mức.

3. **JS: tiêu đề, tóm tắt và chi tiết ngày bằng `Intl.DateTimeFormat`.** **Bạn làm:** toàn bộ JS. Tạo hai bộ định dạng: `{ month: 'long', year: 'numeric' }` cho tiêu đề và `{ weekday: 'long', day: 'numeric', month: 'long' }` cho chi tiết; gọi `.format(date)`. Đếm số ngày tập trong vòng lặp của `render()` rồi ghi dòng tóm tắt. Viết `selectDay(day)`: ghi `state.selected`, duyệt mọi `[data-day]` bằng `querySelectorAll` + `forEach` để đặt `aria-pressed`, rồi ghi `detail.textContent` ghép thứ, tên mức (mảng `levelNames`) và tên bài tập (`workouts[(day + state.month) % workouts.length]`). Kiểm tra: gọi `selectDay(10)` ở Console thấy ô 10 nhuộm gradient và dòng chi tiết đổi.

4. **JS: uỷ quyền click và chuyển tháng, cùng cái bẫy.** **Bạn làm:** toàn bộ JS. Một listener `click` ở `data-app`, dùng `closest('[data-day]')`, `closest('[data-prev]')`, `closest('[data-next]')`. Làm **sai trước** để thấy lỗi: đổi tạm state thành `{ view: new Date() }` và nút › gọi `state.view.setMonth(state.view.getMonth() + 1)`; mở Console gõ `state.view = new Date(2026, 0, 31)` rồi bấm ›: lịch nhảy từ tháng 1 sang tháng 3. Sửa: state chỉ giữ `year` và `month`; `changeMonth(step)` dựng `new Date(state.year, state.month + step, 1)` rồi đọc lại `getFullYear()` và `getMonth()`. Nhớ đặt lại `state.selected = 0` và dòng chi tiết. Kiểm tra: bấm › liên tục từ tháng 11 ra 12/2026 rồi 1/2027, bấm ‹ ngược lại cũng đúng; chọn một ngày rồi bấm Tab thấy focus vẫn ở ô đó (chọn ngày không vẽ lại cả lưới).

5. **CSS: gradient tiêu đề ba điểm dừng.** **Bạn làm:** trên `<header>` thêm `bg-linear-115 via-rose-500`. `bg-linear-115` đặt hướng gradient 115 độ (không có nó thì `from-*`/`to-*` không vẽ gì: tự thử bỏ nó đi); `via-rose-500` chen một màu giữa `from` và `to`. Kiểm tra: dải đầu thẻ chuyển cam, hồng, tím, nghiêng nhẹ.

6. **CSS: gạch chéo ngày nghỉ.** **Bạn làm:** trên `<button data-day>` trong `<template data-day-template>` thêm `disabled:bg-[repeating-linear-gradient(45deg,#e7e5e4_0_4px,#fafaf9_4px_8px)]`. Trong giá trị tuỳ ý, dấu `_` là khoảng trắng; `#e7e5e4_0_4px` nghĩa là màu này chiếm từ 0 đến 4px, rồi `#fafaf9_4px_8px` từ 4px đến 8px, sau đó lặp lại. Kiểm tra: mọi ô Chủ nhật có sọc chéo xám, chữ mờ, con trỏ hiện hình cấm, bấm không phản ứng; ô thường vẫn đúng màu mức.

7. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra, thử tháng 2 (28 hoặc 29 ngày) và tháng có mùng 1 rơi vào Chủ nhật.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `bg-linear-115 from-orange-400 via-rose-500 to-fuchsia-600` | `background: linear-gradient(115deg, #fb923c, #f43f5e, #c026d3)` |
| `bg-linear-to-br from-orange-500 to-fuchsia-600` | `background-image: linear-gradient(to bottom right, #f97316, #c026d3)` |
| `disabled:bg-[repeating-linear-gradient(45deg,#e7e5e4_0_4px,#fafaf9_4px_8px)]` | `.day:disabled { background-image: repeating-linear-gradient(45deg, #e7e5e4 0 4px, #fafaf9 4px 8px) }` |
| `data-[level=3]:bg-rose-400` | `.day[data-level="3"] { background-color: #fb7185 }` |
| `data-today:border-stone-900` | `.day[data-today] { border-color: #1c1917 }` |
| `grid grid-cols-7 gap-1` | `display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px` |

## Tự kiểm tra

- [ ] Nếu hôm nay vẫn ở tháng 11/2026: 30 ngày, mùng 1 ở cột CN, 5 ô CN khoá; bấm › sang tháng 12 (31 ngày, mùng 1 ở thứ Ba), rồi tới tháng 1/2027; bấm ‹ quay về. Tháng 2/2028 có 29 ngày (năm nhuận).
- [ ] Bấm một ngày: ô đó nhuộm gradient, ô trước đó trở lại màu mức; dòng chi tiết đổi đúng thứ và ngày. Bấm ô CN: không có gì xảy ra.
- [ ] DevTools: bỏ `bg-linear-115` khỏi `<header>` để thấy gradient biến mất; xoá `via-rose-500` để thấy dải chỉ còn hai màu; đổi `45deg` thành `-45deg` để sọc đổi chiều.
- [ ] Bàn phím: Tab đi qua ‹, ›, từng ngày (ô CN bị bỏ qua vì `disabled`); Enter hoặc Space chọn ngày; viền focus hồng hiện rõ; sau khi chọn focus vẫn ở ô vừa chọn.
- [ ] Bật `prefers-reduced-motion: reduce`: nút ‹ › và ô ngày không còn chuyển màu mượt (`motion-reduce:transition-none`).
- [ ] Bản cuối không còn `setMonth`: `state` chỉ giữ `year`, `month`, `selected`. Ở Console gõ `state.year = 2026; state.month = 0; changeMonth(1)` (tháng 1 sang tháng 2) vẫn ra đúng tháng 2.
- [ ] Tự hỏi: vì sao `new Date(2026, 11 + 1, 1)` vẫn ra tháng 1/2027 mà `setMonth` lại gây nhảy cóc? Vì sao số ngày trong tháng dùng "ngày số 0 của tháng sau"? Vì sao chọn ngày không cần `render()` lại toàn bộ lưới?

## Thử thách thêm

1. Thêm nút "Hôm nay" đưa lịch về tháng hiện tại và chọn luôn ngày hôm nay (tính từ `new Date()`), kèm phím `ArrowLeft`/`ArrowRight` đổi tháng khi focus nằm trong thẻ (`keydown`).
2. Thêm một dải chú giải phía dưới bằng `bg-linear-to-r from-orange-100 via-orange-300 to-rose-400` từ "Nhẹ" đến "Nặng", và thử đổi sọc ngày nghỉ sang `bg-[repeating-linear-gradient(-45deg,...)]` có ba màu.

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
		<title>Bài 023 - Lịch tập luyện</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main data-app class="app">
			<header class="head">
				<div class="head-row">
					<button type="button" data-prev aria-label="Tháng trước" class="nav-button">‹</button>
					<h1 data-title aria-live="polite" class="title"></h1>
					<button type="button" data-next aria-label="Tháng sau" class="nav-button">›</button>
				</div>
				<p data-summary class="summary"></p>
			</header>
			<div class="body">
				<div class="weekdays" aria-hidden="true">
					<span>T2</span>
					<span>T3</span>
					<span>T4</span>
					<span>T5</span>
					<span>T6</span>
					<span>T7</span>
					<span>CN</span>
				</div>
				<div data-grid class="days"></div>
				<p data-detail aria-live="polite" class="detail">Chọn một ngày để xem chi tiết.</p>
			</div>
			<template data-blank-template>
				<span data-blank aria-hidden="true"></span>
			</template>
			<template data-day-template>
				<button type="button" data-day aria-pressed="false" class="day"></button>
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

button {
	font: inherit;
	color: inherit;
	background: none;
	border: 0;
	cursor: pointer;
}

h1 {
	font-size: inherit;
	font-weight: inherit;
}

.site {
	min-height: 100vh;
	background: #f5f5f4;
	padding: 16px;
	color: #1c1917;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.app {
	margin: 0 auto;
	max-width: 384px;
	overflow: hidden;
	border-radius: 24px;
	background: #ffffff;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.head {
	background: linear-gradient(115deg, #fb923c, #f43f5e, #c026d3);
	padding: 20px 20px 16px;
	color: #ffffff;
}

.head-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.nav-button {
	display: grid;
	width: 36px;
	height: 36px;
	place-items: center;
	border-radius: 9999px;
	background: rgb(255 255 255 / 0.2);
	font-size: 20px;
	line-height: 28px;
	transition: background-color 150ms;
}

.nav-button:hover {
	background: rgb(255 255 255 / 0.3);
}

.nav-button:focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}

.title {
	font-size: 18px;
	line-height: 28px;
	font-weight: 700;
}

.summary {
	margin-top: 8px;
	text-align: center;
	font-size: 14px;
	line-height: 20px;
	color: rgb(255 255 255 / 0.8);
}

.body {
	padding: 16px;
}

.weekdays {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	text-align: center;
	font-size: 12px;
	line-height: 16px;
	font-weight: 600;
	color: #78716c;
}

.days {
	margin-top: 4px;
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 4px;
}

.day {
	height: 40px;
	border: 2px solid transparent;
	border-radius: 12px;
	background-color: #f5f5f4;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	transition: background-color 150ms;
}

.day[data-level="1"] {
	background-color: #ffedd5;
}

.day[data-level="2"] {
	background-color: #fdba74;
}

.day[data-level="3"] {
	background-color: #fb7185;
	color: #ffffff;
}

.day[data-today] {
	border-color: #1c1917;
}

.day[aria-pressed="true"] {
	background-image: linear-gradient(to bottom right, #f97316, #c026d3);
	color: #ffffff;
}

.day:disabled {
	background-image: repeating-linear-gradient(45deg, #e7e5e4 0 4px, #fafaf9 4px 8px);
	color: #a8a29e;
	cursor: not-allowed;
}

.day:focus-visible {
	outline: 2px solid #f43f5e;
	outline-offset: 2px;
}

.detail {
	margin-top: 12px;
	border-radius: 12px;
	background: #fafaf9;
	padding: 12px;
	font-size: 14px;
	line-height: 20px;
	color: #44403c;
}

@media (prefers-reduced-motion: reduce) {
	.nav-button,
	.day {
		transition: none;
	}
}
```

`solution/script.js`

```js
const app = document.querySelector('[data-app]');
const grid = app.querySelector('[data-grid]');
const title = app.querySelector('[data-title]');
const summary = app.querySelector('[data-summary]');
const detail = app.querySelector('[data-detail]');
const dayTemplate = app.querySelector('[data-day-template]');
const blankTemplate = app.querySelector('[data-blank-template]');

const monthFormatter = new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' });
const dayFormatter = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
const workouts = ['Chạy bộ 5 km', 'Yoga 30 phút', 'Bơi 20 vòng', 'Đạp xe 15 km'];
const levelNames = ['Ngày nghỉ', 'Cường độ nhẹ', 'Cường độ vừa', 'Cường độ nặng'];
const emptyDetail = 'Chọn một ngày để xem chi tiết.';

const today = new Date();
const state = { year: today.getFullYear(), month: today.getMonth(), selected: 0 };

function isRestDay(date) {
	return date.getDay() === 0;
}

function getLevel(date) {
	if (isRestDay(date)) {
		return 0;
	}
	return 1 + ((date.getDate() * 5 + date.getMonth()) % 3);
}

function isToday(date) {
	return (
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate()
	);
}

function createDayButton(date) {
	const button = dayTemplate.content.firstElementChild.cloneNode(true);
	button.dataset.day = date.getDate();
	button.dataset.level = getLevel(date);
	button.textContent = date.getDate();
	button.disabled = isRestDay(date);
	button.toggleAttribute('data-today', isToday(date));
	button.setAttribute('aria-pressed', String(state.selected === date.getDate()));
	return button;
}

function render() {
	const first = new Date(state.year, state.month, 1);
	const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
	const blanks = (first.getDay() + 6) % 7;
	const cells = [];
	let trained = 0;
	for (let i = 0; i < blanks; i += 1) {
		cells.push(blankTemplate.content.firstElementChild.cloneNode(true));
	}
	for (let day = 1; day <= daysInMonth; day += 1) {
		const date = new Date(state.year, state.month, day);
		if (!isRestDay(date)) {
			trained += 1;
		}
		cells.push(createDayButton(date));
	}
	grid.replaceChildren(...cells);
	title.textContent = monthFormatter.format(first);
	summary.textContent = trained + ' ngày tập · ' + (daysInMonth - trained) + ' ngày nghỉ';
}

function selectDay(day) {
	state.selected = day;
	const date = new Date(state.year, state.month, day);
	grid.querySelectorAll('[data-day]').forEach(function (button) {
		button.setAttribute('aria-pressed', String(Number(button.dataset.day) === day));
	});
	detail.textContent =
		dayFormatter.format(date) + ' · ' + levelNames[getLevel(date)] + ' · ' + workouts[(day + state.month) % workouts.length];
}

function changeMonth(step) {
	const next = new Date(state.year, state.month + step, 1);
	state.year = next.getFullYear();
	state.month = next.getMonth();
	state.selected = 0;
	detail.textContent = emptyDetail;
	render();
}

function handleClick(event) {
	const dayButton = event.target.closest('[data-day]');
	if (dayButton) {
		selectDay(Number(dayButton.dataset.day));
		return;
	}
	if (event.target.closest('[data-prev]')) {
		changeMonth(-1);
		return;
	}
	if (event.target.closest('[data-next]')) {
		changeMonth(1);
	}
}

app.addEventListener('click', handleClick);
render();
```

</details>

### Giải thích từng hàm

- `isRestDay(date)`: nhận một `Date`, trả `true` nếu là Chủ nhật. `date.getDay()` trả số thứ trong tuần, 0 là Chủ nhật, 6 là thứ Bảy; `===` so sánh chặt (cùng giá trị và cùng kiểu).
- `getLevel(date)`: trả mức cường độ 0 đến 3. Ngày nghỉ trả `0` ngay (return sớm: thoát hàm khỏi chỗ này, không chạy tiếp); ngày thường trả `1 + ((ngày * 5 + tháng) % 3)`. Toán tử `%` lấy phần dư, nên kết quả luôn là 1, 2 hoặc 3.
- `isToday(date)`: so sánh năm, tháng, ngày của `date` với `today`; `&&` chỉ cho `true` khi cả ba điều kiện đúng. `getFullYear()` trả năm 4 chữ số, `getMonth()` trả tháng từ 0 đến 11, `getDate()` trả ngày trong tháng từ 1 đến 31.
- `new Date(năm, tháng, ngày)`: tạo ngày theo giờ địa phương (lúc 00:00). Tham số ngoài khoảng sẽ được "cuộn": `new Date(2026, 12, 1)` là 1/1/2027, ngày `0` là ngày cuối của tháng trước. Khác `new Date()` không tham số là thời điểm hiện tại.
- `createDayButton(date)`: nhân bản nút từ template. `dayTemplate.content` là phần nội dung của `<template>`; `firstElementChild` là phần tử con đầu tiên; `cloneNode(true)` sao chép cả cây con (tham số `true` là sao sâu, `false` hoặc bỏ qua chỉ sao đúng thẻ). Rồi ghi `dataset.day`/`dataset.level` (thuộc tính `data-day`/`data-level`, giá trị tự thành chuỗi), `textContent` (chữ trong nút), `disabled` (thuộc tính khoá nút, `true`/`false`), `toggleAttribute('data-today', cờ)` (có tham số thứ hai: `true` thì thêm, `false` thì gỡ, khác bản một tham số vốn đảo ngược trạng thái) và `setAttribute('aria-pressed', ...)`. `String(true)` đổi `true` thành chuỗi `"true"` vì thuộc tính HTML luôn là chuỗi.
- `render()`: dựng lại cả lưới. `new Date(state.year, state.month + 1, 0).getDate()` là số ngày trong tháng; `(first.getDay() + 6) % 7` là số ô trống đầu tháng (T2 = 0 ... CN = 6); `cells.push(x)` thêm phần tử vào cuối mảng; `for (let i = 0; i < blanks; i += 1)` lặp `blanks` lần; `grid.replaceChildren(...cells)` thay toàn bộ con của lưới (dấu `...` là toán tử trải mảng thành từng tham số riêng, `replaceChildren` không trả về gì). `monthFormatter.format(first)` trả chuỗi như "tháng 11 năm 2026".
- `new Intl.DateTimeFormat('vi-VN', tuỳ chọn)`: tạo bộ định dạng ngày theo ngôn ngữ; tuỳ chọn `{ month: 'long', year: 'numeric' }` cho "tháng 11 năm 2026", `{ weekday: 'long', day: 'numeric', month: 'long' }` cho "Thứ Ba, 10 tháng 11". `.format(date)` nhận `Date` và trả chuỗi.
- `selectDay(day)`: ghi `state.selected`, rồi `grid.querySelectorAll('[data-day]')` (trả danh sách mọi nút ngày) và `forEach(function (button) {...})` (chạy hàm cho từng phần tử) đặt `aria-pressed` bằng `Number(button.dataset.day) === day` (`Number` đổi chuỗi sang số vì `dataset` luôn trả chuỗi). Cuối cùng ghi `detail.textContent` bằng chuỗi nối bằng `+`; `levelNames[...]` và `workouts[...]` lấy phần tử mảng theo chỉ số.
- `changeMonth(step)`: `step` là -1 hoặc 1. Dựng `new Date(state.year, state.month + step, 1)` (luôn **ngày 1** để tránh cái bẫy cuối tháng), đọc lại năm và tháng chuẩn hoá vào `state`, đặt lại ngày chọn và chi tiết rồi `render()`.
- `handleClick(event)`: uỷ quyền ở `data-app`. `event.target.closest(selector)` đi ngược lên cây DOM từ phần tử bị bấm, trả phần tử khớp đầu tiên hoặc `null`; `if (dayButton)` đúng khi khác `null`. Mỗi nhánh `return` sớm để không chạy nhánh sau.
- `app.addEventListener('click', handleClick)`: đăng ký hàm xử lý (truyền tên hàm, không có `()` vì ta muốn trình duyệt tự gọi khi có click).

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Tailwind trong starter | CSS trong `solution/style.css` |
|---|---|
| `bg-linear-115 from-orange-400 via-rose-500 to-fuchsia-600` trên `<header>` | `.head { background: linear-gradient(115deg, #fb923c, #f43f5e, #c026d3) }` |
| `disabled:bg-[repeating-linear-gradient(...)] disabled:cursor-not-allowed disabled:text-stone-400` | `.day:disabled { background-image: repeating-linear-gradient(45deg, #e7e5e4 0 4px, #fafaf9 4px 8px); color: #a8a29e; cursor: not-allowed }` |
| `data-[level=1]:bg-orange-100 data-[level=2]:bg-orange-300 data-[level=3]:bg-rose-400` | `.day[data-level="1"] { background-color: #ffedd5 }` và hai selector tương tự |
| `border-2 border-transparent data-today:border-stone-900` | `.day { border: 2px solid transparent }` và `.day[data-today] { border-color: #1c1917 }` |
| `aria-pressed:bg-linear-to-br aria-pressed:from-orange-500 aria-pressed:to-fuchsia-600` | `.day[aria-pressed="true"] { background-image: linear-gradient(to bottom right, #f97316, #c026d3) }` |
| `grid grid-cols-7 gap-1` | `.days { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px }` |
| `transition-colors motion-reduce:transition-none` | `transition: background-color 150ms` và trong `@media (prefers-reduced-motion: reduce)` đặt `transition: none` |
| `shadow-lg overflow-hidden rounded-3xl` | `.app { box-shadow: ...; overflow: hidden; border-radius: 24px }` |

Khác biệt nhỏ: Tailwind nội suy màu gradient trong không gian `oklab` nên các màu chuyển hơi khác CSS thuần; hướng và số điểm dừng giống nhau.
