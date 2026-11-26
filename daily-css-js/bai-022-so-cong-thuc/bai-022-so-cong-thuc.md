# Bài 022: Sổ công thức, thanh lọc dính, tìm kiếm debounce và hai cái bẫy định vị

Ngày học 8, bài 3/3, cấp 2, chủ đề CSS: Định vị và quản lý layer (ứng dụng sổ công thức nấu ăn), độ khó ★★★★★, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này lưu **danh sách món yêu thích** bằng `localStorage` (khoá `bai-022-yeu-thich`). Ô tìm kiếm, bộ lọc loại món, món đang mở **không** được lưu; tải lại trang thì về mặc định. Danh sách công thức nằm sẵn trong `script.js`.

## Mục tiêu

- Một sổ công thức 8 món: lọc theo loại (Tất cả, Ăn sáng, Món chính, Tráng miệng), lọc "Yêu thích", và tìm theo tên không cần gõ dấu (gõ `ga xao` ra "Gà xào sả ớt").
- Ô tìm kiếm dùng **debounce 300 ms**: gõ liền 6 ký tự chỉ vẽ lại danh sách **một** lần. Dòng trạng thái ghi "đã vẽ lại N lần" để bạn tự chứng kiến.
- Bấm vào **bất kỳ chỗ nào trên thẻ** thì mở chi tiết nguyên liệu (kỹ thuật "liên kết kéo giãn"), nhưng bấm nút tim thì chỉ thêm yêu thích, không mở thẻ.
- Thanh tiêu đề và thanh lọc **dính** ở đầu khung khi cuộn trang (thanh lọc ngay dưới tiêu đề), dù khung có bo góc và cắt phần thừa.
- Yêu thích còn nguyên sau khi tải lại trang; huy hiệu đếm trên nút "Yêu thích" đúng; sau khi bấm tim, focus bàn phím vẫn ở nút tim.

## Kết quả mong đợi

Một khung bo tròn tối giữa trang. Đầu khung là tiêu đề "Sổ công thức" kèm nút "Yêu thích" có chấm đỏ đếm số món. Ngay dưới là thanh lọc mờ kính gồm ô tìm, bốn nút loại món và dòng "Hiện 8 món · đã vẽ lại 1 lần". Cuộn xuống: cả hai thanh đứng yên ở đầu màn hình, thẻ món ăn trượt phía sau chúng (nhìn xuyên mờ nhờ `backdrop-blur`). Bấm một thẻ thì viền xanh, hiện nguyên liệu; bấm tim thì tim đỏ, chấm đếm tăng.

## Tư duy

**State một nơi, giao diện vẽ lại từ state.** Giống bài 020 nhưng nhiều trạng thái hơn: `state = { query, tag, onlyFavorites, favorites, selectedId, renders }`. Mọi thao tác chỉ sửa state rồi gọi `render()`; `render()` lọc mảng `recipes`, dựng lại thẻ từ `<template>`, cập nhật huy hiệu và các nút `aria-pressed`. Chỉ `favorites` được ghi vào `localStorage`.

**Debounce: đợi người dùng ngừng tay.** Mỗi phím gõ sinh một sự kiện `input`. Nếu mỗi sự kiện vẽ lại danh sách thì gõ 6 ký tự là 6 lần vẽ. Debounce là "hẹn giờ rồi huỷ": mỗi lần có phím mới, `clearTimeout` huỷ hẹn giờ cũ rồi `setTimeout` hẹn lại 300 ms. Chỉ khi 300 ms trôi qua mà không có phím nào mới thì hàm lọc mới chạy. Giống thang máy chờ thêm một chút trước khi đóng cửa: ai bước vào thì đếm lại từ đầu.

**Sticky chết khi tổ tiên có `overflow` khác `visible`.** `position: sticky` bám theo "tổ tiên cuộn gần nhất". Muốn khung bo góc cắt phần thừa, ta hay viết `overflow-hidden`. Nhưng `overflow-hidden` biến khung thành một vùng cuộn (dù nó không cuộn), nên thanh `sticky` bên trong bám vào khung này thay vì cửa sổ, và không bao giờ dính. Cách sửa: `overflow-clip`. Nó cắt phần thừa y như `hidden` nhưng **không** tạo vùng cuộn, nên `sticky` vẫn bám cửa sổ.

**Liên kết kéo giãn và lớp phủ ăn click.** Muốn cả thẻ bấm được mà vẫn giữ một `<button>` duy nhất đọc được bằng trình đọc màn hình, ta cho nút tiêu đề một phần tử giả `::after` phủ kín thẻ (`absolute inset-0` với thẻ là `relative`). Mọi chỗ trên thẻ giờ thuộc về nút tiêu đề. Cái giá: phần tử giả cũng phủ lên nút tim, nên bấm tim lại mở thẻ. Nút tim phải được đẩy lên trên lớp phủ bằng `relative z-10` (phải có `position` thì `z-index` mới có hiệu lực).

**Vẽ lại làm mất focus.** `render()` thay toàn bộ thẻ bằng thẻ mới, nên nút bạn vừa bấm biến mất và focus rơi về `<body>`: người dùng bàn phím mất chỗ (đã gặp ở bài 016). Sau khi vẽ lại, tìm đúng nút trong thẻ mới theo `data-id` rồi `focus()` lại.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| `sticky top-0` / `sticky top-14` và `z-30` / `z-20` cho hai thanh | Không làm gì: dính là việc của CSS |
| `overflow-clip` cắt góc khung mà không phá sticky | Không làm gì |
| Liên kết kéo giãn `after:absolute after:inset-0`, nút tim `relative z-10` | Ghi `data-selected`, `aria-expanded`, `aria-pressed` |
| Hiện chi tiết `hidden group-data-selected:block`, nút bật `aria-pressed:` | Lọc, tìm, debounce, yêu thích, `localStorage` |
| Huy hiệu `absolute -top-1.5 -right-1.5` | Ghi số đếm và `hidden` cho huy hiệu |

JS không thêm hoặc gỡ class, không đặt `style.position` hay `style.display`, không tìm phần tử bằng class.

## Ôn lại

- Bài 014 (`bai-014-hop-thu-huy-hieu`): huy hiệu `absolute -top-1.5 -right-1.5 min-w-5`, `aria-pressed:`, `group-data-*:`.
- Bài 004 (`bai-004-bang-diem-cot-dinh`) và bài 013: `sticky`, `z-*`, `backdrop-blur-md`.
- Bài 016 (`bai-016-bang-viec-the-dan`): vẽ lại làm mất focus và cách trả focus.
- Bài 020 (`bai-020-ghi-chu-kinh-mo`): `localStorage` với `JSON.stringify` và `JSON.parse`, object `state`, `template`.
- Bài 008 (`bai-008-ke-dia-nhac`): `setTimeout`/`clearTimeout` và cái bẫy hẹn giờ cũ; bài 010: `findIndex`, `includes`; bài 013: `includes`.

## Gợi ý từng bước

> Starter đã điền sẵn: khung bo tròn, tiêu đề dính `sticky top-0 z-30 h-14 backdrop-blur-md`, nút "Yêu thích" với huy hiệu `absolute -top-1.5 -right-1.5`, thanh lọc (chỉ thiếu phần dính), ô tìm, bốn nút loại món với `aria-pressed:`, danh sách, và trong `<template>`: thẻ `group relative` với `data-selected:`, chi tiết `hidden group-data-selected:block`, nút tiêu đề (chưa có phần tử giả phủ thẻ), nút tim (chưa có `relative z-10`). Bạn tự thêm hai nhóm class mới: **thanh lọc dính cùng `overflow-clip`** và **liên kết kéo giãn cùng `relative z-10`**. Phần còn lại là JS.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc `data-app`, `data-only-favorites` (có `data-fav-count`), `data-search`, `data-tag` (mỗi nút một loại), `data-status`, `data-empty`, `data-list` và `<template data-recipe-template>` với `data-card`, `data-open` + `data-name`, `data-fav`, `data-meta`, `data-details`. Kiểm tra: mở trang thấy khung với thanh, chưa có thẻ nào.

2. **JS: dữ liệu, state, `render()`.** **Bạn làm:** toàn bộ JS. Mảng `recipes` 8 món `{ id, name, tag, minutes, ingredients }` (tag là `an-sang`, `mon-chinh`, `trang-mieng`); object `state`; hàm `createCard(recipe)` nhân bản template (`cloneNode`, `dataset`, `textContent`, `toggleAttribute`, `setAttribute` cho `aria-*`); hàm `render()` dùng `replaceChildren`, `hidden` cho dòng trống và huy hiệu, `aria-pressed` cho nút lọc. Kiểm tra: tám thẻ hiện ra, tim rỗng `♡`, chi tiết ẩn.

3. **JS: lọc theo loại, theo yêu thích và theo tên không dấu.** **Bạn làm:** toàn bộ JS. Viết `normalize(text)` bằng `toLowerCase`, `normalize('NFD')` (tách chữ và dấu), `replace` với biểu thức chính quy xoá dấu, và xử lý riêng chữ `đ`. Viết `getVisible()` bằng `filter`, kết hợp ba điều kiện bằng `&&`. Kiểm tra: gán tạm `state.tag = 'mon-chinh'` ở Console rồi `render()`: còn 3 món; `state.query = 'ga'` ra "Gà xào sả ớt" (đã bỏ dấu).

4. **JS: uỷ quyền click, yêu thích, `localStorage`, trả focus.** **Bạn làm:** toàn bộ JS. Một listener `click` ở `data-app` dùng `closest` phân biệt nút tim, nút tiêu đề, nút loại món, nút lọc yêu thích. Hàm `loadFavorites()` đọc `getItem`/`JSON.parse` (lần đầu là `null` thì trả `[]`), hàm lưu dùng `setItem`/`JSON.stringify`. Sau `render()` gọi `focusInCard(id, selector)` để `focus()` lại đúng nút trong thẻ mới. Chưa viết CSS vội: ở bước này bấm vào thẻ **chưa** mở chi tiết (không có lớp phủ), chỉ bấm đúng chữ tiêu đề mới mở. Kiểm tra: bấm tim thì tim đỏ, chấm đếm tăng, tải lại trang vẫn còn; Tab từ nút tim sang thẻ sau thì đúng thứ tự (không nhảy về đầu trang); bật lọc "Yêu thích" thì chỉ còn món đã tim.

5. **JS: debounce ô tìm kiếm, và cái bẫy.** **Bạn làm:** toàn bộ JS. Làm **sai trước**: gắn `input` gọi thẳng hàm đọc ô tìm rồi `render()`. Gõ `ga xao` và nhìn dòng trạng thái: "đã vẽ lại" tăng 6 lần. Sửa: đặt `let searchTimer`, trong hàm xử lý `input` gọi `clearTimeout(searchTimer)` rồi `searchTimer = setTimeout(applySearch, 300)`. `setTimeout` trả số định danh hẹn giờ, `clearTimeout(số)` huỷ hẹn giờ đó. Kiểm tra: gõ liền `ga xao` chỉ tăng 1 lần, sau khoảng 0,3 giây mới thấy danh sách đổi. Xoá ô bằng nút `x` của `type="search"` cũng chạy đúng.

6. **CSS: thanh lọc dính và cái bẫy `overflow`.** **Bạn làm:** trên `<div>` thanh lọc (cha của ô tìm) thêm `sticky top-14 z-20`; trên `<div data-app>` thêm `overflow-clip`. Làm thử trước: thêm `overflow-hidden` vào `<div data-app>` để thấy các góc trên của khung được cắt gọn; cuộn trang xuống: **cả hai thanh không còn dính** (sticky chết vì `overflow-hidden`). Đổi `overflow-hidden` thành `overflow-clip`: cả hai thanh dính lại, góc vẫn được cắt. `top-14` bằng `3.5rem = 56px`, đúng chiều cao `h-14` của thanh tiêu đề, nên thanh lọc dính ngay dưới nó; `z-20` thấp hơn `z-30` để tiêu đề luôn nằm trên khi hai thanh chạm nhau. Kiểm tra: cuộn xuống, thấy hai thanh đứng yên, thẻ chui phía dưới mờ kính; DevTools tắt `overflow` của khung để thấy sticky hoạt động trở lại.

7. **CSS: liên kết kéo giãn và cái bẫy `z-index`.** **Bạn làm:** trên `<button data-open>` trong template thêm `after:absolute after:inset-0 after:content-['']`; trên `<button data-fav>` trong template thêm `relative z-10`, chỉ **sau khi** tự thấy lỗi. Thêm lớp phủ trước: bấm vào khoảng trống của thẻ thì mở chi tiết (tốt). Nhưng bấm tim cũng mở thẻ mà không đổi tim: phần tử `::after` phủ lên nút tim. Thêm `relative z-10` cho nút tim: bấm tim chạy đúng, bấm khoảng trống vẫn mở thẻ. `after:` áp style cho phần tử giả `::after`; `content-['']` là bắt buộc để phần tử giả tồn tại; `inset-0` là `top/right/bottom/left: 0` so với thẻ `relative`. Kiểm tra: bấm khắp thẻ đều mở; bấm tim chỉ tim; DevTools bật `::after` thấy vùng phủ kín thẻ.

8. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra, đặc biệt thử bằng bàn phím.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `sticky top-14 z-20` | `position: sticky; top: 56px; z-index: 20` |
| `sticky top-0 z-30 h-14` | `position: sticky; top: 0; z-index: 30; height: 56px` |
| `overflow-clip` | `overflow: clip` (cắt phần thừa, không tạo vùng cuộn) |
| `overflow-hidden` | `overflow: hidden` (cắt phần thừa và tạo vùng cuộn, làm sticky chết) |
| `after:absolute after:inset-0 after:content-['']` | `.recipe-open::after { content: ''; position: absolute; inset: 0 }` |
| `relative z-10` | `position: relative; z-index: 10` |
| `group-data-selected:block` | `.recipe[data-selected] .details { display: block }` |
| `aria-pressed:bg-rose-500/30` | `.fav-button[aria-pressed="true"] { background: rgb(244 63 94 / 0.3) }` |
| `absolute -top-1.5 -right-1.5` | `position: absolute; top: -6px; right: -6px` |
| `backdrop-blur-md` | `backdrop-filter: blur(12px)` |

## Tự kiểm tra

- [ ] Gõ `ga xao` chỉ làm "đã vẽ lại" tăng **một** lần; gõ `CA` ra hai món cá; ô trống ra lại 8 món. Không khớp gì thì hiện dòng "Không có công thức nào khớp."
- [ ] Bốn nút loại món đổi đúng danh sách; nút đang chọn có viền xanh. Kết hợp được loại món, từ khoá và "Yêu thích" cùng lúc.
- [ ] Cuộn trang: tiêu đề và thanh lọc dính, thanh lọc nằm ngay dưới tiêu đề, không hở khe, không chồng nhau. Thẻ chui phía dưới thấy mờ.
- [ ] Bấm vào mép thẻ, vào dòng meta, vào chữ tiêu đề: đều mở và đóng chi tiết. Bấm tim: chỉ đổi tim, không mở thẻ.
- [ ] Tải lại trang: yêu thích còn đúng, mục Application, Local Storage thấy `bai-022-yeu-thich` chứa mảng số như `[2,4]`.
- [ ] DevTools: đổi `overflow-clip` thành `overflow-hidden` để thấy sticky chết; bỏ `z-10` khỏi nút tim để thấy tim bị phủ. Hãy tắt `::after` bằng cách bỏ `after:absolute`: bấm khoảng trống không còn mở thẻ.
- [ ] Bàn phím: Tab qua tiêu đề thẻ, tim, mọi nút; Enter hoặc Space trên tiêu đề mở thẻ, trên tim bật tắt yêu thích; sau mỗi lần bấm focus vẫn nằm trên chính nút đó (viền focus còn hiện).
- [ ] Bật `prefers-reduced-motion: reduce`: bài này không có chuyển động nào ngoài hiệu ứng hover, nên không có gì bị thay đổi; xác nhận không có `transition` nào trong CSS của bạn mà thiếu `motion-reduce:`.
- [ ] Tự hỏi: vì sao `overflow-clip` giữ được sticky còn `overflow-hidden` thì không? Vì sao nút tim cần cả `relative` lẫn `z-10`? Nếu quên `clearTimeout` thì chuyện gì xảy ra khi gõ nhanh?

## Thử thách thêm

1. Lưu thêm loại món đang chọn và bật tắt "Yêu thích" vào `localStorage` (một object `{ tag, onlyFavorites, favorites }` qua `JSON.stringify`), và đọc lại khi mở trang. Nhớ kiểm tra chuỗi không hợp lệ bằng `try`/`catch` quanh `JSON.parse`.
2. Phím `Escape` đóng thẻ đang mở (`keydown` trên `document`), và thêm thanh ghim ở đáy khung bằng `sticky bottom-0 z-20` cho dòng "Đang mở: tên món". Cẩn thận: nếu thêm `overflow-hidden` ở đâu đó trong cây cha thì sticky này chết như bước 6.

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
		<title>Bài 022 - Sổ công thức</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<div data-app class="app">
			<header class="top-bar">
				<h1 class="title">Sổ công thức</h1>
				<button type="button" data-only-favorites aria-pressed="false" class="fav-filter">
					Yêu thích
					<span data-fav-count hidden class="badge">0</span>
				</button>
			</header>
			<div class="filter-bar">
				<label for="search" class="sr-only">Tìm công thức</label>
				<input id="search" data-search type="search" autocomplete="off" placeholder="Tìm món, ví dụ: ga xao" class="search" />
				<div role="group" aria-label="Lọc theo loại món" class="chips">
					<button type="button" data-tag="all" aria-pressed="true" class="chip">Tất cả</button>
					<button type="button" data-tag="an-sang" aria-pressed="false" class="chip">Ăn sáng</button>
					<button type="button" data-tag="mon-chinh" aria-pressed="false" class="chip">Món chính</button>
					<button type="button" data-tag="trang-mieng" aria-pressed="false" class="chip">Tráng miệng</button>
				</div>
				<p data-status aria-live="polite" class="status"></p>
			</div>
			<main class="content">
				<p data-empty hidden class="empty">Không có công thức nào khớp.</p>
				<ul data-list class="recipes"></ul>
			</main>
			<template data-recipe-template>
				<li data-card class="recipe">
					<div class="recipe-head">
						<h2 class="recipe-title">
							<button type="button" data-open aria-expanded="false" data-name class="recipe-open"></button>
						</h2>
						<button type="button" data-fav aria-pressed="false" class="fav-button"></button>
					</div>
					<p data-meta class="meta"></p>
					<p data-details class="details"></p>
				</li>
			</template>
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

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	margin: -1px;
	padding: 0;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
	border: 0;
}

.site {
	min-height: 100vh;
	background: #0f172a;
	padding: 16px;
	color: #f1f5f9;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.app {
	margin: 0 auto;
	max-width: 448px;
	overflow: clip;
	border: 1px solid rgb(255 255 255 / 0.1);
	border-radius: 24px;
	background: #020617;
}

.top-bar {
	position: sticky;
	top: 0;
	z-index: 30;
	display: flex;
	height: 56px;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid rgb(255 255 255 / 0.1);
	border-radius: 24px 24px 0 0;
	background: rgb(15 23 42 / 0.8);
	padding: 0 16px;
	backdrop-filter: blur(12px);
}

.title {
	font-size: 18px;
	line-height: 28px;
	font-weight: 700;
}

.fav-filter {
	position: relative;
	border: 1px solid rgb(255 255 255 / 0.2);
	border-radius: 9999px;
	padding: 4px 12px;
	font-size: 14px;
	line-height: 20px;
}

.fav-filter:hover {
	background: rgb(255 255 255 / 0.1);
}

.fav-filter[aria-pressed="true"] {
	border-color: #fb7185;
	background: rgb(244 63 94 / 0.2);
	color: #fecdd3;
}

.badge {
	position: absolute;
	top: -6px;
	right: -6px;
	display: grid;
	min-width: 20px;
	place-items: center;
	border-radius: 9999px;
	background: #f43f5e;
	padding: 0 4px;
	font-size: 12px;
	line-height: 16px;
	font-weight: 700;
	color: #ffffff;
}

.filter-bar {
	position: sticky;
	top: 56px;
	z-index: 20;
	display: flex;
	flex-direction: column;
	gap: 12px;
	border-bottom: 1px solid rgb(255 255 255 / 0.1);
	background: rgb(15 23 42 / 0.8);
	padding: 12px 16px;
	backdrop-filter: blur(12px);
}

.search {
	width: 100%;
	border: 1px solid #475569;
	border-radius: 8px;
	background: #1e293b;
	padding: 8px 12px;
	font-size: 14px;
	line-height: 20px;
	color: #f1f5f9;
}

.search::placeholder {
	color: #64748b;
}

.chips {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.chip {
	border: 1px solid rgb(255 255 255 / 0.2);
	border-radius: 9999px;
	padding: 4px 12px;
	font-size: 14px;
	line-height: 20px;
}

.chip:hover {
	background: rgb(255 255 255 / 0.1);
}

.chip[aria-pressed="true"] {
	border-color: #38bdf8;
	background: rgb(14 165 233 / 0.2);
	color: #bae6fd;
}

.status {
	font-size: 12px;
	line-height: 16px;
	color: #94a3b8;
}

.content {
	padding: 16px;
}

.empty {
	border: 1px dashed rgb(255 255 255 / 0.2);
	border-radius: 16px;
	padding: 24px;
	text-align: center;
	font-size: 14px;
	line-height: 20px;
	color: #94a3b8;
}

.recipes {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.recipe {
	position: relative;
	border: 1px solid rgb(255 255 255 / 0.1);
	border-radius: 16px;
	background: rgb(15 23 42 / 0.7);
	padding: 16px;
}

.recipe[data-selected] {
	border-color: #38bdf8;
	background: #1e293b;
}

.recipe-head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
}

.recipe-open {
	text-align: left;
	font-size: 16px;
	line-height: 24px;
	font-weight: 600;
}

.recipe-open::after {
	content: '';
	position: absolute;
	inset: 0;
}

.fav-button {
	position: relative;
	z-index: 10;
	border-radius: 9999px;
	background: rgb(255 255 255 / 0.1);
	padding: 4px 12px;
	font-size: 14px;
	line-height: 20px;
}

.fav-button:hover {
	background: rgb(255 255 255 / 0.2);
}

.fav-button[aria-pressed="true"] {
	background: rgb(244 63 94 / 0.3);
	color: #fecdd3;
}

.meta {
	margin-top: 4px;
	font-size: 12px;
	line-height: 16px;
	color: #94a3b8;
}

.details {
	display: none;
	margin-top: 12px;
	font-size: 14px;
	line-height: 20px;
	color: #cbd5e1;
}

.recipe[data-selected] .details {
	display: block;
}

.search:focus-visible,
.fav-filter:focus-visible,
.chip:focus-visible,
.fav-button:focus-visible {
	outline: 2px solid #38bdf8;
	outline-offset: 2px;
}

.recipe-open:focus-visible {
	outline: 2px solid #38bdf8;
	outline-offset: 4px;
}
```

`solution/script.js`

```js
const storageKey = 'bai-022-yeu-thich';
const searchDelay = 300;
const tagNames = { 'an-sang': 'Ăn sáng', 'mon-chinh': 'Món chính', 'trang-mieng': 'Tráng miệng' };
const recipes = [
	{ id: 1, name: 'Trứng ốp la bơ tỏi', tag: 'an-sang', minutes: 10, ingredients: ['2 quả trứng', '1 thìa bơ', '1 tép tỏi'] },
	{ id: 2, name: 'Cháo yến mạch chuối', tag: 'an-sang', minutes: 15, ingredients: ['50 g yến mạch', '1 quả chuối', '200 ml sữa'] },
	{ id: 3, name: 'Bánh mì nướng phô mai', tag: 'an-sang', minutes: 8, ingredients: ['2 lát bánh mì', '2 lát phô mai'] },
	{ id: 4, name: 'Gà xào sả ớt', tag: 'mon-chinh', minutes: 30, ingredients: ['300 g đùi gà', '2 cây sả', '2 quả ớt'] },
	{ id: 5, name: 'Cá kho tộ', tag: 'mon-chinh', minutes: 45, ingredients: ['400 g cá', 'nước màu', 'tiêu xay'] },
	{ id: 6, name: 'Canh chua cá', tag: 'mon-chinh', minutes: 35, ingredients: ['300 g cá', '2 quả cà chua', 'rau thơm'] },
	{ id: 7, name: 'Chè đậu xanh', tag: 'trang-mieng', minutes: 40, ingredients: ['150 g đậu xanh', '100 g đường', 'nước cốt dừa'] },
	{ id: 8, name: 'Sữa chua trái cây', tag: 'trang-mieng', minutes: 10, ingredients: ['1 hũ sữa chua', 'xoài', 'dâu tây'] },
];
const app = document.querySelector('[data-app]');
const searchInput = document.querySelector('[data-search]');
const list = document.querySelector('[data-list]');
const empty = document.querySelector('[data-empty]');
const summary = document.querySelector('[data-status]');
const favCount = document.querySelector('[data-fav-count]');
const favFilter = document.querySelector('[data-only-favorites]');
const chips = Array.from(document.querySelectorAll('[data-tag]'));
const template = document.querySelector('[data-recipe-template]');
let searchTimer = 0;

function loadFavorites() {
	const saved = localStorage.getItem(storageKey);
	return saved === null ? [] : JSON.parse(saved);
}

const state = { query: '', tag: 'all', onlyFavorites: false, favorites: loadFavorites(), selectedId: null, renders: 0 };

function normalize(text) {
	return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
}

function getVisible() {
	return recipes.filter(function (recipe) {
		const matchTag = state.tag === 'all' || recipe.tag === state.tag;
		const matchQuery = normalize(recipe.name).includes(state.query);
		const matchFavorite = !state.onlyFavorites || state.favorites.includes(recipe.id);
		return matchTag && matchQuery && matchFavorite;
	});
}

function createCard(recipe) {
	const card = template.content.firstElementChild.cloneNode(true);
	const isFavorite = state.favorites.includes(recipe.id);
	const isSelected = state.selectedId === recipe.id;
	const favButton = card.querySelector('[data-fav]');
	card.dataset.id = recipe.id;
	card.toggleAttribute('data-selected', isSelected);
	card.querySelector('[data-name]').textContent = recipe.name;
	card.querySelector('[data-open]').setAttribute('aria-expanded', String(isSelected));
	card.querySelector('[data-meta]').textContent = `${tagNames[recipe.tag]} · ${recipe.minutes} phút`;
	card.querySelector('[data-details]').textContent = `Nguyên liệu: ${recipe.ingredients.join(', ')}.`;
	favButton.setAttribute('aria-pressed', String(isFavorite));
	favButton.setAttribute('aria-label', `Yêu thích ${recipe.name}`);
	favButton.textContent = isFavorite ? '♥' : '♡';
	return card;
}

function render() {
	const items = getVisible();
	state.renders += 1;
	list.replaceChildren(...items.map(createCard));
	empty.hidden = items.length > 0;
	summary.textContent = `Hiện ${items.length} món · đã vẽ lại ${state.renders} lần`;
	favCount.textContent = state.favorites.length;
	favCount.hidden = state.favorites.length === 0;
	favFilter.setAttribute('aria-pressed', String(state.onlyFavorites));
	chips.forEach(function (chip) {
		chip.setAttribute('aria-pressed', String(chip.dataset.tag === state.tag));
	});
}

function focusInCard(id, selector) {
	const target = list.querySelector(`[data-id="${id}"] ${selector}`);
	if (target !== null) {
		target.focus();
	}
}

function toggleFavorite(id) {
	if (state.favorites.includes(id)) {
		state.favorites = state.favorites.filter(function (item) {
			return item !== id;
		});
	} else {
		state.favorites.push(id);
	}
	localStorage.setItem(storageKey, JSON.stringify(state.favorites));
	render();
	focusInCard(id, '[data-fav]');
}

function toggleSelected(id) {
	state.selectedId = state.selectedId === id ? null : id;
	render();
	focusInCard(id, '[data-open]');
}

function handleClick(event) {
	const fav = event.target.closest('[data-fav]');
	const open = event.target.closest('[data-open]');
	const chip = event.target.closest('[data-tag]');
	if (fav !== null) {
		toggleFavorite(Number(fav.closest('[data-card]').dataset.id));
	} else if (open !== null) {
		toggleSelected(Number(open.closest('[data-card]').dataset.id));
	} else if (chip !== null) {
		state.tag = chip.dataset.tag;
		render();
	} else if (event.target.closest('[data-only-favorites]') !== null) {
		state.onlyFavorites = !state.onlyFavorites;
		render();
	}
}

function applySearch() {
	state.query = normalize(searchInput.value.trim());
	render();
}

function handleSearchInput() {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(applySearch, searchDelay);
}

app.addEventListener('click', handleClick);
searchInput.addEventListener('input', handleSearchInput);

render();
```

</details>

### Giải thích từng hàm

- `loadFavorites()`: không tham số, đọc `localStorage` và trả mảng `id` món yêu thích; trả `[]` nếu chưa lưu gì (`getItem` trả `null`).
- `normalize(text)`: nhận chuỗi, trả chuỗi viết thường, không dấu, để so sánh tên món không phân biệt dấu và hoa thường.
- `getVisible()`: trả mảng các món khớp loại, từ khoá và bộ lọc yêu thích đang bật.
- `createCard(recipe)`: nhận một món, trả phần tử `<li>` mới đã điền tên, loại, thời gian, nguyên liệu, trạng thái tim và trạng thái mở.
- `render()`: vẽ lại toàn bộ danh sách từ `state`, cập nhật dòng trạng thái, huy hiệu đếm và các nút `aria-pressed`. Không trả về gì.
- `focusInCard(id, selector)`: tìm nút theo `selector` trong thẻ có `data-id` bằng `id` rồi `focus()`; bỏ qua nếu không tìm thấy (ví dụ thẻ vừa biến mất khỏi danh sách lọc).
- `toggleFavorite(id)`: thêm hoặc bỏ `id` khỏi `state.favorites`, lưu `localStorage`, vẽ lại và trả focus.
- `toggleSelected(id)`: mở hoặc đóng chi tiết của thẻ, vẽ lại và trả focus.
- `handleClick(event)`: uỷ quyền click ở `data-app`, xác định đã bấm tim, tiêu đề, nút loại món hay nút "Yêu thích" rồi gọi hàm tương ứng.
- `applySearch()`: đọc ô tìm, chuẩn hoá, gán vào `state.query` và vẽ lại. `handleSearchInput()`: hàm debounce, huỷ hẹn giờ cũ và hẹn `applySearch` sau 300 ms.
- `document.querySelector(selector)`, `card.querySelector(selector)`: trả phần tử đầu tiên khớp hoặc `null`. `document.querySelectorAll(selector)`: trả danh sách mọi phần tử khớp. `Array.from(danhSách)`: đổi danh sách thành mảng thật.
- `template.content.firstElementChild.cloneNode(true)`: lấy phần tử con đầu tiên trong ruột `<template>` rồi nhân bản toàn bộ cây con (`true`); trả phần tử mới chưa gắn vào trang.
- `list.replaceChildren(...mảng)`: thay toàn bộ con của `list` bằng các phần tử trong mảng; `...` là toán tử trải, tách mảng thành từng đối số.
- `array.map(createCard)`: gọi hàm cho từng phần tử, trả mảng kết quả (truyền tên hàm, không có `()`). `array.filter(hàm)`: trả mảng mới giữ phần tử mà hàm trả `true`. `array.forEach(hàm)`: gọi hàm cho từng phần tử, trả `undefined`.
- `array.join(', ')`: nối các phần tử của mảng thành một chuỗi, giữa hai phần tử là chuỗi truyền vào (ở đây là dấu phẩy và dấu cách). Trả chuỗi, không sửa mảng.
- `array.includes(giá trị)`: trả `true` nếu mảng có giá trị đó. `string.includes(chuỗi con)`: trả `true` nếu chuỗi chứa chuỗi con. `array.push(giá trị)`: thêm vào cuối mảng, sửa chính mảng, trả độ dài mới.
- `string.toLowerCase()`: trả chuỗi viết thường. `string.normalize('NFD')`: tách mỗi chữ có dấu thành chữ gốc cộng dấu rời (ví dụ `ả` thành `a` và dấu hỏi). `string.replace(regex, thay)`: trả chuỗi mới đã thay mọi chỗ khớp (có cờ `g` là thay tất cả); `/[\u0300-\u036f]/g` khớp mọi dấu rời. `string.trim()`: cắt khoảng trắng hai đầu.
- `localStorage.getItem(khoá)`: trả chuỗi đã lưu hoặc `null`. `localStorage.setItem(khoá, chuỗi)`: ghi chuỗi. `JSON.stringify(mảng)`: biến mảng thành chuỗi JSON. `JSON.parse(chuỗi)`: biến ngược lại thành mảng.
- `setTimeout(hàm, 300)`: hẹn chạy hàm sau 300 ms, trả số định danh. `clearTimeout(số)`: huỷ hẹn giờ đó; số `0` hoặc số đã chạy xong thì không làm gì. Truyền `applySearch` không có `()`.
- `event.target.closest(selector)`: đi từ phần tử được bấm ngược lên cha, trả phần tử khớp đầu tiên hoặc `null`.
- `Number(chuỗi)`: đổi `dataset.id` (luôn là chuỗi) về số. `String(giá trị)`: đổi `true`, `false` hoặc số thành chuỗi để dùng cho `setAttribute`.
- `card.dataset.id = giá trị`: ghi `data-id`. `card.toggleAttribute('data-selected', điều kiện)`: bật thuộc tính khi `true`, gỡ khi `false` (tham số thứ hai `force`). `setAttribute(tên, chuỗi)`: đặt thuộc tính.
- `element.hidden = true/false`: ẩn hoặc hiện phần tử. `element.textContent = giá trị`: gán chữ thuần. `element.focus()`: đưa focus bàn phím vào phần tử.
- `` `...${biểu thức}...` ``: chuỗi mẫu. `điều kiện ? a : b`: toán tử ba ngôi. `!` phủ định. `&&` đúng khi cả hai vế đúng; `||` đúng khi một trong hai vế đúng. `===` và `!==`: so sánh chặt chẽ. `let`: biến gán lại được (`searchTimer`). `+= 1`: cộng thêm 1. `if`, `else if`, `else`: các nhánh điều kiện. `return;` sớm hoặc `return` giá trị: thoát khỏi hàm.
- `addEventListener('input', hàm)`: `input` chạy sau mỗi lần giá trị ô đổi. `addEventListener('click', hàm)` ở `data-app` nghe được cả thẻ tạo sau nhờ sự kiện nổi bọt.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `sticky top-14 z-20` trên thanh lọc | `.filter-bar { position: sticky; top: 56px; z-index: 20 }` |
| `overflow-clip` trên `<div data-app>` | `.app { overflow: clip }` |
| `sticky top-0 z-30 h-14 rounded-t-3xl` | `.top-bar { position: sticky; top: 0; z-index: 30; height: 56px; border-radius: 24px 24px 0 0 }` |
| `after:absolute after:inset-0 after:content-['']` trên nút tiêu đề | `.recipe-open::after { content: ''; position: absolute; inset: 0 }` |
| `relative z-10` trên nút tim | `.fav-button { position: relative; z-index: 10 }` |
| `group relative` trên `<li>` | `.recipe { position: relative }` (thẻ là mốc cho lớp phủ) |
| `hidden group-data-selected:block` | `.details { display: none }` và `.recipe[data-selected] .details { display: block }` |
| `data-selected:border-sky-400 data-selected:bg-slate-800` | `.recipe[data-selected] { border-color: #38bdf8; background: #1e293b }` |
| `absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center` | `.badge { position: absolute; top: -6px; right: -6px; display: grid; min-width: 20px; place-items: center }` |
| `aria-pressed:border-sky-400 aria-pressed:bg-sky-500/20` | `.chip[aria-pressed="true"] { border-color: #38bdf8; background: rgb(14 165 233 / 0.2) }` |
| `sr-only` | `.sr-only { position: absolute; width: 1px; height: 1px; ...; clip-path: inset(50%) }` |

Khác biệt nhỏ: Tailwind nội suy màu trong không gian `oklab` nên sắc độ hơi khác bản CSS thuần; hình dạng và vị trí giống nhau.
