# Bài 012: Ví thẻ ảo kính mờ, ánh sáng đổi hướng và sự kiện reset

Ngày học 5, bài 2/3, cấp 1, chủ đề CSS: Glass + 3D + ánh sáng (ứng dụng ví thẻ ngân hàng), độ khó ★★★★☆, thời gian ước tính 40 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Tải lại trang thì thẻ về nguồn sáng "Giữa", hạng "Bạc", số thẻ hiện, nhật ký trống. Đây là hành vi đúng của bài.

## Mục tiêu

- Thẻ ngân hàng kính mờ nổi trên hai khối màu: nhìn xuyên qua thẻ thấy hai khối bị nhoè. Đổi hạng thẻ (Bạc, Vàng, Bạch kim) thì màu thẻ đổi (starter đã làm sẵn).
- Chọn nguồn sáng Trái, Giữa hoặc Phải: vệt sáng trên mặt thẻ chuyển về đúng phía, thẻ nghiêng 3D theo (Trái nghiêng sang trái, Phải nghiêng sang phải, Giữa ngả nhẹ về sau).
- Tích "Ẩn số thẻ" thì số thẻ chỉ còn 4 chữ số cuối: `•••• •••• •••• 6467`.
- Dòng tóm tắt và "Nhật ký thay đổi" luôn đúng: mỗi lần đổi một lựa chọn thêm một dòng "Nguồn sáng: Giữa → Trái", nhật ký giữ tối đa 4 dòng mới nhất.
- Bấm "Đặt lại" thì form, thẻ, tóm tắt và nhật ký cùng về trạng thái ban đầu. Bạn sẽ gặp và sửa cái bẫy của sự kiện `reset`.

## Kết quả mong đợi

Trang "Ví thẻ ảo" hiện thẻ xám bạc "Lumi Bank" với vệt sáng ở mép trên. Chọn "Trái": vệt sáng trượt sang góc trái, thẻ xoay nhẹ quanh trục dọc sang trái trong nửa giây. Chọn hạng "Vàng": thẻ chuyển sắc vàng. Tích "Ẩn số thẻ": số thẻ chỉ còn `6467`. Bên dưới, nhật ký có ba dòng tương ứng ba thao tác.

## Tư duy

**Ánh sáng giả lập bằng một lớp phủ.** Không có đèn thật. Ta đặt lên thẻ một lớp phủ trong suốt có gradient hình tròn (`bg-radial`): sáng ở một điểm rồi tắt dần. Dời điểm sáng sang trái hoặc phải là ra "nguồn sáng khác". Thẻ nghiêng về phía nguồn sáng cho thật hơn, như một tấm kính quay mặt về phía đèn.

**Kính mờ cần có thứ gì đó phía sau.** `backdrop-blur-md` làm nhoè những gì nằm **sau** thẻ. Hai khối màu `-z-10` trong khung `isolate` chính là thứ để nhoè (xem lại bài 009).

**Một nguồn sự thật: biến `data-light` trên thẻ.** CSS đọc `data-light` ở hai nơi: thẻ (để nghiêng) và lớp phủ (để dời vệt sáng, nhờ `group-data-[light=left]:`). JS chỉ ghi một chỗ, không cần biết ánh sáng trông ra sao.

**Bẫy JS: sự kiện `reset` chạy trước khi form được đặt lại.** Nút `type="reset"` làm form trả mọi ô về giá trị ban đầu. Nhưng trình duyệt phát sự kiện `reset` **trước** khi trả giá trị, để bạn còn kịp huỷ bằng `preventDefault()`. Nếu trong lúc đó bạn đọc `FormData`, bạn đọc phải giá trị **cũ**: thẻ vẫn nghiêng và vẫn màu vàng trong khi form đã về "Giữa", "Bạc". Cách sửa: hoãn việc đọc sang sau bằng `setTimeout(hàm, 0)`. Hẹn giờ `0` ms nghĩa là "chạy ngay khi trình duyệt xử lý xong việc hiện tại", lúc đó form đã được đặt lại.

**Ô tích chưa chọn thì không có trong `FormData`.** Radio và select luôn có giá trị, còn checkbox chưa tích thì tên của nó vắng hẳn. Tích rồi thì giá trị là `'on'` (giá trị mặc định khi thẻ `<input>` không có thuộc tính `value`). Vì vậy kiểm tra `values.mask === 'on'`, không kiểm tra `values.mask` có tồn tại hay không rồi đoán.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Kính mờ, màu theo hạng thẻ (`data-[tier=gold]:from-...`) | Ghi `data-tier` trên thẻ |
| Vệt sáng dời theo hướng (`group-data-[light=left]:bg-radial-[at_0%_20%]`) | Ghi `data-light` trên thẻ |
| Nghiêng 3D theo hướng (`data-[light=left]:-rotate-y-12`) và làm mượt (`transition-transform`) | Không làm gì: nghiêng là việc của CSS |
| Bố cục, màu form và nhật ký | Đọc form, viết chữ vào thẻ, tóm tắt, nhật ký |

JS không đặt `style.transform`, không đổi màu bằng `style`, không thêm hoặc gỡ class, không tìm phần tử bằng class.

## Ôn lại

- Bài 009 (`bai-009-quiz-kinh-mo`): `backdrop-blur-md`, `-z-10` với `isolate`, `FormData`, `template.content.cloneNode(true)`, `replaceChildren`.
- Bài 007 (`bai-007-the-thoi-tiet`): `bg-linear-to-br from-* to-*` với `data-[...=...]:`, chuỗi mẫu.
- Bài 010 (`bai-010-the-tu-vung-lat`): `perspective-midrange`.
- Bài 008 (`bai-008-ke-dia-nhac`): `setTimeout`, bóng đổ `shadow-*`.
- Bài 011 (`bai-011-xem-can-ho-3d`): `rotate-y-*`, `group-data-*:`.

## Gợi ý từng bước

> Starter đã điền sẵn: màu, chữ, khoảng cách, form và viền focus (`accent-fuchsia-500`, `focus-visible:`), hai khối màu `-z-10` trong khung `isolate`, `perspective-midrange` ở khung ngoài, thẻ kính mờ với `backdrop-blur-md`, `border-white/40`, `shadow-xl`, màu thẻ theo hạng (`data-[tier=gold]:from-amber-300/60 ...`), `transition-transform duration-500`, `group` trên thẻ, và phần `from-white/50 to-transparent to-60%` của lớp phủ sáng. Bạn tự thêm hai nhóm class mới: **vệt sáng** (`bg-radial`) và **nghiêng 3D** (`rotate-x/-y`).

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-controls` (form), `data-card` (thẻ, kèm `data-light`, `data-tier`, `data-number`), `data-shine` (lớp phủ sáng, `aria-hidden` vì chỉ là trang trí), `data-number-text`, `data-tier-text`, `data-summary`, `data-log` (danh sách nhật ký, lúc đầu trống), `data-log-template`, `data-log-text`. Ô radio "Giữa" có `checked`, `<option value="silver">` có `selected`: đó là giá trị ban đầu khi bấm "Đặt lại". Kiểm tra: mở trang thấy thẻ kính mờ xám bạc, nhưng chưa có vệt sáng.

2. **CSS: vệt sáng.** **Bạn làm:** trên `<div data-shine>` thêm `bg-radial-[at_50%_0%] group-data-[light=left]:bg-radial-[at_0%_20%] group-data-[light=right]:bg-radial-[at_100%_20%]`. `bg-radial-[at_X_Y]` là gradient hình tròn có tâm tại vị trí X Y (dấu `_` thành dấu cách); các màu lấy từ `from-white/50 to-transparent to-60%` đã có. `group-data-[light=left]:` nghĩa là "khi phần tử `group` (là thẻ) có `data-light="left"`". Kiểm tra: thấy vệt sáng ở mép trên giữa thẻ. Trong DevTools đổi `data-light` của thẻ thành `left` rồi `right`: vệt sáng dời góc trái, góc phải.

3. **CSS: nghiêng 3D theo nguồn sáng.** **Bạn làm:** trên `<article data-card>` thêm `data-[light=left]:-rotate-y-12 data-[light=right]:rotate-y-12 data-[light=center]:rotate-x-6`. `rotate-y-12` là `rotateY(12deg)`; dấu `-` đầu class cho giá trị âm. `rotate-x-*` xoay quanh trục ngang. Hiệu ứng có chiều sâu nhờ `perspective-midrange` của khung ngoài. Kiểm tra: ở `data-light="center"` mép trên thẻ lùi nhẹ; đổi sang `left`, `right` thẻ xoay mượt nửa giây. Trước khi qua bước sau, thử gỡ `perspective-midrange` khỏi khung ngoài: thẻ vẫn xoay nhưng trông phẳng, mất chiều sâu. Gắn lại.

4. **JS: đọc form thành một object.** **Bạn làm:** toàn bộ JS. Lấy form bằng `document.querySelector('[data-controls]')`. Viết `readValues()`: `const values = Object.fromEntries(new FormData(form))`. `new FormData(form)` gom mọi ô có `name` đang hợp lệ; `Object.fromEntries(...)` biến cặp tên–giá trị thành object `{ light: 'center', tier: 'silver' }`, trả về object mới. Trả về `{ light: values.light, tier: values.tier, masked: values.mask === 'on' }`. Kiểm tra: gõ `readValues()` vào Console của trang (tạm gán ra `window`, hoặc `console.log` rồi xoá): ra `masked: false`; tích "Ẩn số thẻ" ra `masked: true`.

5. **JS: vẽ thẻ khi form thay đổi.** **Bạn làm:** toàn bộ JS. Viết `paint(values)`: gán `card.dataset.light = values.light` và `card.dataset.tier = values.tier` (ghi `dataset` tự tạo hoặc cập nhật `data-light`, `data-tier`). Số thẻ lấy từ `card.dataset.number`; nếu `values.masked` thì ghi `` `•••• •••• •••• ${number.slice(-4)}` ``, không thì ghi số đầy đủ, bằng toán tử ba ngôi. `number.slice(-4)` cắt chuỗi: số âm đếm từ cuối, nên `-4` lấy 4 ký tự cuối. Hạng thẻ: tạo object `tierNames = { silver: 'Bạc', gold: 'Vàng', platinum: 'Bạch kim' }` rồi ghi `tierText.textContent = ` + chuỗi mẫu; tra object bằng `tierNames[values.tier]`. Làm tương tự `lightNames` và dòng tóm tắt. Gắn `form.addEventListener('change', function () { paint(readValues()); })`. Sự kiện `change` nổi bọt lên form nên một listener ở form nghe được mọi radio, select, checkbox. Gọi `paint(readValues())` cuối file để vẽ lần đầu. Kiểm tra: chọn "Phải" thì thẻ nghiêng, vệt sáng sang phải; chọn "Bạch kim" thì thẻ tím; tích ẩn số thấy `6467`.

6. **JS: nhật ký thay đổi.** **Bạn làm:** toàn bộ JS. Viết `describe(values)` trả object `{ light: tên nguồn sáng, tier: tên hạng, mask: 'đang ẩn' hoặc 'đang hiện' }`. Khai báo `let previous = describe(readValues())`. Trong `change`, sau khi `paint`: `const now = describe(values)` rồi `Object.entries(now).forEach(function (entry) { ... })`. `Object.entries(obj)` trả mảng các cặp `[khoá, giá trị]`: `entry[0]` là khoá, `entry[1]` là giá trị. Với mỗi cặp, nếu `entry[1] !== previous[entry[0]]` thì gọi `addLog(` `` `${labels[entry[0]]}: ${previous[entry[0]]} → ${entry[1]}` `` `)`; `labels = { light: 'Nguồn sáng', tier: 'Hạng thẻ', mask: 'Số thẻ' }`. Cuối `change` gán `previous = now`. Viết `addLog(text)`: `logTemplate.content.cloneNode(true)`, gán `textContent` cho `[data-log-text]` trong bản sao, `log.append(item)`, rồi `while (log.children.length > 4) { log.firstElementChild.remove(); }`. `children` là danh sách con là phần tử; `firstElementChild` là con đầu tiên; `remove()` gỡ nó ra khỏi trang; `while` lặp lại chừng nào điều kiện còn đúng. Kiểm tra: đổi nguồn sáng, hạng, tích ẩn số thấy ba dòng; đổi thêm hai lần nữa vẫn chỉ còn 4 dòng, dòng cũ nhất biến mất.

7. **JS: nút Đặt lại và cái bẫy.** **Bạn làm:** toàn bộ JS. Viết `handleReset()`: `const values = readValues()`, `log.replaceChildren()` để xoá hết nhật ký, `previous = describe(values)`, `paint(values)`. Trước tiên gắn **sai**: `form.addEventListener('reset', handleReset)`. Đổi nguồn sáng sang "Trái", hạng "Vàng", tích ẩn số thẻ, rồi bấm "Đặt lại". Bạn thấy form về "Giữa", "Bạc", bỏ tích, nhưng thẻ vẫn nghiêng trái, vàng, số vẫn ẩn. Lý do: `reset` chạy trước khi form được trả giá trị, nên `readValues()` đọc phải giá trị cũ. Sửa: `form.addEventListener('reset', function () { setTimeout(handleReset, 0); })`. `setTimeout(hàm, 0)` hẹn chạy `hàm` sau 0 ms, tức ngay sau khi trình duyệt xong việc hiện tại; truyền `handleReset` không có `()`, vì có `()` là gọi ngay. Kiểm tra lại: bấm "Đặt lại" thì thẻ, tóm tắt, nhật ký về đúng trạng thái đầu.

8. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `bg-radial-[at_50%_0%]` | `background-image: radial-gradient(at 50% 0%, <các màu from/to>)` |
| `from-white/50 to-transparent to-60%` | màu đầu trắng 50%, màu cuối trong suốt, dừng ở 60% |
| `group-data-[light=left]:bg-radial-[at_0%_20%]` | `.card[data-light="left"] .shine { background-image: radial-gradient(at 0% 20%, ...) }` |
| `data-[light=left]:-rotate-y-12` | `.card[data-light="left"] { transform: rotateY(-12deg) }` |
| `data-[light=center]:rotate-x-6` | `.card[data-light="center"] { transform: rotateX(6deg) }` |
| `perspective-midrange` | `perspective: 800px` |
| `backdrop-blur-md` | `backdrop-filter: blur(12px)` |
| `border-white/40` | `border-color: rgb(255 255 255 / 0.4)` |
| `transition-transform duration-500` | `transition: transform 500ms` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Nhìn qua thẻ thấy hai khối màu phía sau bị nhoè; vệt sáng dời đúng phía khi chọn Trái, Giữa, Phải; thẻ nghiêng đúng hướng.
- [ ] Số thẻ ẩn chỉ còn 4 chữ số cuối; bỏ tích thì hiện lại số đầy đủ.
- [ ] Mỗi lần đổi **một** lựa chọn thêm **một** dòng nhật ký; chọn lại đúng giá trị đang chọn không thêm dòng nào; nhật ký tối đa 4 dòng.
- [ ] Đổi cả ba lựa chọn rồi bấm "Đặt lại": form, thẻ, tóm tắt về như ban đầu, nhật ký trống, và lần đổi tiếp theo ghi đúng "từ ... sang ...".
- [ ] DevTools: đổi `data-tier` của thẻ thành `gold` bằng tay, thẻ đổi màu mà không cần JS. Gỡ `perspective-midrange` thì thẻ xoay phẳng. Gỡ khối màu `-z-10` thì thẻ hết nhoè gì cả.
- [ ] Bàn phím: Tab qua ba radio, select, checkbox, nút "Đặt lại" đều thấy viền focus; mũi tên đổi radio; Space tích checkbox.
- [ ] Bật `prefers-reduced-motion: reduce` trong DevTools: thẻ đổi hướng tức thì, không xoay mượt.
- [ ] Tự hỏi: vì sao `reset` cần `setTimeout(..., 0)` còn `change` thì không? Vì sao kiểm tra `values.mask === 'on'` mà không dùng `values.mask` trực tiếp làm điều kiện? Nếu bỏ `aria-hidden="true"` khỏi lớp phủ thì trình đọc màn hình bị ảnh hưởng gì?

## Thử thách thêm

1. Thêm nút "Sao chép số thẻ" dùng `navigator.clipboard.writeText(card.dataset.number)`. Khi thành công đổi chữ nút thành "Đã chép" trong 1,5 giây rồi trả lại, nhớ `clearTimeout` hẹn giờ cũ (bẫy ở bài 008). Class gợi ý: `disabled:`, `aria-live`.
2. Thêm lựa chọn nguồn sáng thứ tư "Dưới" làm vệt sáng ở mép dưới và thẻ ngả ra trước: `data-[light=bottom]:-rotate-x-6`, `group-data-[light=bottom]:bg-radial-[at_50%_100%]`. Chỉ thêm một radio và hai class, không sửa JS ngoài `lightNames`.

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
		<title>Bài 012 - Ví thẻ ảo</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<h1 class="title">Ví thẻ ảo</h1>
			<p class="subtitle">Chọn nguồn sáng và hạng thẻ để xem thẻ đổi hình.</p>
			<div class="stage">
				<div class="blob blob-a"></div>
				<div class="blob blob-b"></div>
				<div class="card-wrap">
					<article data-card data-light="center" data-tier="silver" data-number="4539 1488 0343 6467" class="card">
						<div data-shine aria-hidden="true" class="shine"></div>
						<div class="card-body">
							<p class="brand">Lumi Bank</p>
							<p data-number-text class="number"></p>
							<div class="card-foot">
								<p class="holder">NGUYEN VAN AN</p>
								<p data-tier-text class="tier"></p>
							</div>
						</div>
					</article>
				</div>
			</div>
			<form data-controls class="controls">
				<fieldset>
					<legend class="legend">Nguồn sáng</legend>
					<div class="radios">
						<label class="check"><input type="radio" name="light" value="left" class="control" />Trái</label>
						<label class="check"><input type="radio" name="light" value="center" checked class="control" />Giữa</label>
						<label class="check"><input type="radio" name="light" value="right" class="control" />Phải</label>
					</div>
				</fieldset>
				<label class="field-label">Hạng thẻ
					<select name="tier" class="select">
						<option value="silver" selected>Bạc</option>
						<option value="gold">Vàng</option>
						<option value="platinum">Bạch kim</option>
					</select>
				</label>
				<label class="check"><input type="checkbox" name="mask" class="control" />Ẩn số thẻ</label>
				<button type="reset" class="reset-button">Đặt lại</button>
			</form>
			<p data-summary aria-live="polite" class="summary"></p>
			<h2 class="log-title">Nhật ký thay đổi</h2>
			<ol data-log class="log"></ol>
			<template data-log-template>
				<li class="log-item"><span data-log-text></span></li>
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
select {
	font: inherit;
	color: inherit;
}

button {
	background: none;
	cursor: pointer;
}

ol {
	list-style: none;
}

fieldset {
	border: 0;
}

h1,
h2 {
	font-size: inherit;
	font-weight: inherit;
}

.site {
	background: #020617;
	color: #f1f5f9;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	margin: 0 auto;
	min-height: 100vh;
	max-width: 448px;
	padding: 40px 24px;
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
	margin-top: 32px;
	overflow: hidden;
	border-radius: 24px;
	padding: 32px;
}

.blob {
	position: absolute;
	z-index: -10;
	border-radius: 9999px;
}

.blob-a {
	top: -24px;
	left: -24px;
	width: 160px;
	height: 160px;
	background: linear-gradient(to bottom right, #d946ef, #fb923c);
}

.blob-b {
	right: -24px;
	bottom: -32px;
	width: 176px;
	height: 176px;
	background: linear-gradient(to bottom right, #22d3ee, #2563eb);
}

.card-wrap {
	perspective: 800px;
}

.card {
	position: relative;
	height: 192px;
	width: 100%;
	overflow: hidden;
	border: 1px solid rgb(255 255 255 / 0.4);
	border-radius: 16px;
	color: #ffffff;
	background: linear-gradient(to bottom right, rgb(203 213 225 / 0.5), rgb(100 116 139 / 0.5));
	box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
	backdrop-filter: blur(12px);
	transition: transform 500ms;
}

.card[data-tier="gold"] {
	background: linear-gradient(to bottom right, rgb(252 211 77 / 0.6), rgb(217 119 6 / 0.6));
}

.card[data-tier="platinum"] {
	background: linear-gradient(to bottom right, rgb(165 180 252 / 0.6), rgb(217 70 239 / 0.6));
}

.card[data-light="left"] {
	transform: rotateY(-12deg);
}

.card[data-light="right"] {
	transform: rotateY(12deg);
}

.card[data-light="center"] {
	transform: rotateX(6deg);
}

.shine {
	position: absolute;
	inset: 0;
	background-image: radial-gradient(at 50% 0%, rgb(255 255 255 / 0.5), transparent 60%);
}

.card[data-light="left"] .shine {
	background-image: radial-gradient(at 0% 20%, rgb(255 255 255 / 0.5), transparent 60%);
}

.card[data-light="right"] .shine {
	background-image: radial-gradient(at 100% 20%, rgb(255 255 255 / 0.5), transparent 60%);
}

.card-body {
	position: relative;
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
	padding: 20px;
}

.brand,
.tier {
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
}

.number {
	font-size: 20px;
	line-height: 28px;
	font-weight: 600;
	font-variant-numeric: tabular-nums;
}

.card-foot {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
}

.holder {
	font-size: 14px;
	line-height: 20px;
}

.controls {
	margin-top: 24px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	border: 1px solid #1e293b;
	border-radius: 16px;
	background: #0f172a;
	padding: 20px;
}

.legend,
.field-label {
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	color: #cbd5e1;
}

.field-label {
	display: block;
}

.radios {
	margin-top: 8px;
	display: flex;
	gap: 16px;
}

.check {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	line-height: 20px;
}

.control {
	accent-color: #d946ef;
}

.select {
	margin-top: 4px;
	display: block;
	width: 100%;
	border: 1px solid #334155;
	border-radius: 8px;
	background: #1e293b;
	padding: 8px 12px;
	font-size: 14px;
	line-height: 20px;
	color: #f1f5f9;
}

.reset-button {
	align-self: flex-start;
	border: 1px solid #475569;
	border-radius: 8px;
	padding: 8px 16px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
}

.control:focus-visible,
.select:focus-visible,
.reset-button:focus-visible {
	outline: 2px solid #e879f9;
	outline-offset: 2px;
}

.summary {
	margin-top: 16px;
	text-align: center;
	font-size: 14px;
	line-height: 20px;
	color: #cbd5e1;
}

.log-title {
	margin-top: 32px;
	font-size: 18px;
	line-height: 28px;
	font-weight: 600;
}

.log {
	margin-top: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	font-size: 14px;
	line-height: 20px;
	color: #cbd5e1;
}

.log-item {
	border-radius: 8px;
	background: #0f172a;
	padding: 8px 12px;
}

@media (prefers-reduced-motion: reduce) {
	.card {
		transition: none;
	}
}
```

`solution/script.js`

```js
const form = document.querySelector('[data-controls]');
const card = document.querySelector('[data-card]');
const numberText = document.querySelector('[data-number-text]');
const tierText = document.querySelector('[data-tier-text]');
const summary = document.querySelector('[data-summary]');
const log = document.querySelector('[data-log]');
const logTemplate = document.querySelector('[data-log-template]');
const lightNames = { left: 'Trái', center: 'Giữa', right: 'Phải' };
const tierNames = { silver: 'Bạc', gold: 'Vàng', platinum: 'Bạch kim' };
const labels = { light: 'Nguồn sáng', tier: 'Hạng thẻ', mask: 'Số thẻ' };
const maxLogItems = 4;

function readValues() {
	const values = Object.fromEntries(new FormData(form));
	return {
		light: values.light,
		tier: values.tier,
		masked: values.mask === 'on',
	};
}

function describe(values) {
	return {
		light: lightNames[values.light],
		tier: tierNames[values.tier],
		mask: values.masked ? 'đang ẩn' : 'đang hiện',
	};
}

function paint(values) {
	const number = card.dataset.number;
	card.dataset.light = values.light;
	card.dataset.tier = values.tier;
	numberText.textContent = values.masked ? `•••• •••• •••• ${number.slice(-4)}` : number;
	tierText.textContent = `Hạng ${tierNames[values.tier]}`;
	summary.textContent = `Nguồn sáng: ${lightNames[values.light]} · Hạng ${tierNames[values.tier]} · Số thẻ ${values.masked ? 'đang ẩn' : 'đang hiện'}`;
}

function addLog(text) {
	const item = logTemplate.content.cloneNode(true);
	item.querySelector('[data-log-text]').textContent = text;
	log.append(item);
	while (log.children.length > maxLogItems) {
		log.firstElementChild.remove();
	}
}

let previous = describe(readValues());

function handleChange() {
	const values = readValues();
	const now = describe(values);
	paint(values);
	Object.entries(now).forEach(function (entry) {
		const key = entry[0];
		const text = entry[1];
		if (text !== previous[key]) {
			addLog(`${labels[key]}: ${previous[key]} → ${text}`);
		}
	});
	previous = now;
}

function handleReset() {
	const values = readValues();
	log.replaceChildren();
	previous = describe(values);
	paint(values);
}

form.addEventListener('change', handleChange);

form.addEventListener('reset', function () {
	setTimeout(handleReset, 0);
});

paint(readValues());
```

</details>

### Giải thích từng hàm

- `readValues()`: không nhận tham số, đọc mọi ô của form và trả object `{ light, tier, masked }`. `masked` là `true` khi checkbox đang tích.
- `describe(values)`: nhận object từ `readValues()`, trả object `{ light, tier, mask }` chứa chữ tiếng Việt để hiển thị và so sánh với lần trước.
- `paint(values)`: ghi `data-light`, `data-tier`, số thẻ, hạng thẻ và dòng tóm tắt theo `values`. Không trả về gì.
- `addLog(text)`: nhân bản template thành một dòng nhật ký, gắn vào cuối danh sách và gỡ bớt dòng cũ nếu quá 4 dòng. Không trả về gì.
- `handleChange()`: chạy mỗi khi một ô của form đổi. Đọc form, vẽ thẻ, so sánh với `previous` để thêm dòng nhật ký, rồi cập nhật `previous`.
- `handleReset()`: chạy sau khi form đã được đặt lại. Xoá nhật ký, đặt `previous` về trạng thái mới, vẽ lại thẻ.
- `new FormData(form)`: gom giá trị các ô có `name` trong form. Ô checkbox chưa tích và ô bị `disabled` không có mặt. Trả về đối tượng `FormData`.
- `Object.fromEntries(entries)`: nhận các cặp khoá–giá trị (`FormData` duyệt được) và trả một object thường. Ngược với `Object.entries`.
- `Object.entries(obj)`: trả mảng các cặp `[khoá, giá trị]` của object, mỗi cặp là mảng hai phần tử. Dùng để duyệt mọi mục bằng `forEach`.
- `forEach(function (item) { ... })`: gọi hàm cho từng phần tử của mảng. Trả `undefined`.
- `string.slice(-4)`: cắt chuỗi con. Một tham số âm nghĩa là đếm từ cuối, nên `slice(-4)` trả 4 ký tự cuối. Khác `slice(4)` (bỏ 4 ký tự đầu, lấy phần còn lại).
- `element.dataset`: object chứa mọi `data-*` của phần tử, tên camelCase. Gán `card.dataset.light = 'left'` đặt `data-light="left"`; đọc `card.dataset.number` lấy `data-number`. Giá trị luôn là chuỗi.
- `element.textContent = chuỗi`: gán toàn bộ chữ bên trong phần tử, coi chuỗi là chữ thường chứ không phải HTML.
- `template.content.cloneNode(true)`: `content` là phần ruột của `<template>`; `cloneNode(true)` nhân bản toàn bộ cây con (tham số `true` là sao chép cả phần tử con, `false` chỉ sao chép đúng một thẻ). Trả về `DocumentFragment`.
- `item.querySelector(selector)`: tìm phần tử con đầu tiên khớp selector trong bản sao, trả phần tử hoặc `null`.
- `log.append(item)`: gắn nội dung vào cuối `log`. Với `DocumentFragment` thì gắn mọi con của nó.
- `log.children`: danh sách các phần tử con (không tính chữ trống), `.length` là số con. `log.firstElementChild` là con đầu tiên.
- `element.remove()`: gỡ chính phần tử khỏi trang. Không trả về gì.
- `while (điều kiện) { ... }`: lặp lại khối lệnh chừng nào điều kiện còn đúng. Ở đây gỡ dòng cũ nhất cho tới khi còn tối đa 4 dòng.
- `log.replaceChildren()`: gọi không tham số thì xoá hết con của `log`. Có tham số thì thay toàn bộ con bằng các nút đó.
- `setTimeout(hàm, 0)`: hẹn chạy `hàm` sau ít nhất 0 ms, tức sau khi việc hiện tại kết thúc. Trả về số định danh hẹn giờ. Truyền tên hàm không có `()`.
- `addEventListener('change', hàm)`: đăng ký hàm chạy khi một ô nhập thay đổi giá trị. Sự kiện nổi bọt nên gắn ở form. `'reset'` phát ngay khi bấm nút đặt lại, trước khi các ô được trả về giá trị ban đầu.
- `` `...${biểu thức}...` ``: chuỗi mẫu, nhúng giá trị vào chuỗi. `điều kiện ? a : b` là toán tử ba ngôi, trả `a` nếu đúng, `b` nếu sai.
- `!==`: so sánh khác nhau chặt chẽ, không đổi kiểu. `===` là bằng nhau chặt chẽ: `values.mask === 'on'` cho `true` hoặc `false`.
- `obj[key]`: lấy giá trị của object theo khoá nằm trong biến, ví dụ `tierNames[values.tier]`.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `bg-radial-[at_50%_0%]` và `from-white/50 to-transparent to-60%` trên `<div data-shine>` | `.shine { background-image: radial-gradient(at 50% 0%, rgb(255 255 255 / 0.5), transparent 60%) }` |
| `group-data-[light=left]:bg-radial-[at_0%_20%]` | `.card[data-light="left"] .shine { background-image: radial-gradient(at 0% 20%, ...) }` |
| `group-data-[light=right]:bg-radial-[at_100%_20%]` | `.card[data-light="right"] .shine { background-image: radial-gradient(at 100% 20%, ...) }` |
| `data-[light=left]:-rotate-y-12` | `.card[data-light="left"] { transform: rotateY(-12deg) }` |
| `data-[light=right]:rotate-y-12` | `.card[data-light="right"] { transform: rotateY(12deg) }` |
| `data-[light=center]:rotate-x-6` | `.card[data-light="center"] { transform: rotateX(6deg) }` |
| `backdrop-blur-md border border-white/40` | `backdrop-filter: blur(12px); border: 1px solid rgb(255 255 255 / 0.4)` |
| `data-[tier=gold]:from-amber-300/60 data-[tier=gold]:to-amber-600/60` | `.card[data-tier="gold"] { background: linear-gradient(to bottom right, ...) }` |

Khác biệt nhỏ: Tailwind nội suy màu gradient trong không gian `oklab` nên sắc độ hơi khác bản CSS thuần; hình dạng và vị trí giống nhau.
