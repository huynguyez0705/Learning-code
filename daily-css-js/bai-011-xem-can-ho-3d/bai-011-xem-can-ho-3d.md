# Bài 011: Xem căn hộ trên vòng quay 3D

Ngày học 5, bài 1/3, cấp 1, chủ đề CSS: 3D nâng cao (ứng dụng xem bất động sản), độ khó ★★★☆☆, thời gian ước tính 35 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Tải lại trang thì vòng quay về căn hộ đầu tiên. Đây là hành vi đúng của bài.

## Mục tiêu

- Sáu tấm thẻ căn hộ đứng quanh một vòng tròn 3D như sáu mặt của một lăng trụ. Căn đang chọn quay thẳng về phía bạn, năm căn còn lại mờ đi.
- Bấm "Sau →" hoặc "← Trước" thì cả vòng xoay 60° mượt mà. Ở căn đầu nút "Trước" bị khoá, ở căn cuối nút "Sau" bị khoá.
- Bấm chấm tròn thứ k thì nhảy thẳng tới căn k. Chấm của căn đang chọn có màu cam.
- Dòng thông tin dưới vòng luôn đúng: số thứ tự, tên, diện tích, giá (đọc từ `data-*` của thẻ, giá chia ra tỷ đồng).
- Phím `←` và `→` chuyển căn ở bất kỳ đâu trên trang.
- Tự thêm CSS 3D cho hai thẻ cuối và gặp cái bẫy thiếu `transform-3d` ở tầng giữa.

## Kết quả mong đợi

Trang "Xem căn hộ mẫu" hiện ba tấm thẻ màu: tấm giữa to, rõ nét ("Căn hộ Sen Hồng", nền cam); hai tấm hai bên nghiêng vào trong và mờ. Bấm "Sau →": vòng quay nửa giây, tấm "Căn hộ Lan Anh" màu hồng xoay ra giữa. Dòng chữ bên dưới đổi thành "2/6 · Căn hộ Lan Anh · 68 m² · 3,4 tỷ".

## Tư duy

**Vòng quay là một cái bánh xe có sáu nan.** Mỗi thẻ gắn vào một nan. Muốn thẻ k đứng ở phía trước, ta không di chuyển thẻ: ta quay cả bánh xe đi một góc. Vì vậy JS chỉ cần biết một con số: góc của bánh xe (`-k × 60°`).

**Hai tầng xoay, đặt đúng thứ tự.** Thẻ cần "xoay quanh tâm vòng rồi mới đẩy ra xa tâm". Nếu viết cả hai trên cùng một phần tử, CSS luôn áp `translate` trước `rotate`, ra thứ tự ngược lại. Cách làm: thẻ ngoài (`<li>`) xoay `rotateY(i × 60°)` quanh tâm, thẻ trong (`<div>`) đẩy ra bằng `translateZ`. Giống như cầm cây gậy ở tâm rồi xoay gậy, đầu gậy mới vẽ thành vòng tròn.

**Bán kính từ hình học.** Sáu thẻ rộng 192px đứng sát nhau thì bán kính vòng là `96 / tan(30°) ≈ 166px`. Ta làm tròn thành 168px, tức `translate-z-42` (42 × 4px). Vòng đẩy lùi một đoạn bằng bán kính (`-translate-z-42`), để thẻ phía trước nằm đúng mặt phẳng màn hình thay vì phình to lên.

**Bẫy CSS: `transform-3d` phải có ở mọi tầng.** `transform-3d` (`transform-style: preserve-3d`) chỉ giữ không gian 3D cho **con trực tiếp**. Chuỗi ở bài này là vòng → `<li>` → `<div>`. Quên `transform-3d` trên `<li>` thì `<li>` ép `<div>` phẳng xuống: `translateZ` của `<div>` không còn tác dụng, thẻ đó không nằm trên vòng mà bị kéo lùi vào giữa, nhỏ hơn các thẻ khác. Không có lỗi nào hiện ra, chỉ có hình sai.

**Vì sao dùng `Math.max/Math.min` mà không quay vòng?** Nếu ở căn 6 bấm "Sau" để về căn 1, góc đi từ `-300deg` về `0deg` và vòng sẽ quay ngược 300° một lèo. Bài này chặn ở hai đầu cho đơn giản; thử thách thêm sẽ bàn cách quay vòng.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Phối cảnh, xếp sáu thẻ thành vòng (`rotate-y-[calc(var(--i)*60deg)]`, `translate-z-42`) | Không làm gì: hình học là việc của CSS |
| Xoay cả vòng theo góc `--angle` (`rotate-y-(--angle)`) và làm mượt (`transition-transform`) | Ghi `--angle` bằng `style.setProperty` |
| Thẻ đang chọn rõ nét (`group-data-active:opacity-100`) | Bật tắt `data-active` trên đúng một thẻ |
| Chấm đang chọn màu cam (`data-active:bg-amber-600`) | Bật tắt `data-active` và `aria-current` trên chấm |
| Nút bị khoá trông xám (`disabled:`) | Ghi `disabled` cho nút theo vị trí hiện tại |

JS không đặt `style.transform`, không tính toạ độ 3D, không thêm hoặc gỡ class, không tìm phần tử bằng class. Ngoại lệ duy nhất: `style.setProperty('--angle', ...)` ghi một biến CSS (một trạng thái), không ghi thuộc tính giao diện.

## Ôn lại

- Bài 010 (`bai-010-the-tu-vung-lat`): `transform-3d`, `backface-hidden`, `rotate-y-*`, `perspective-*`, `group-data-*:`.
- Bài 007 (`bai-007-the-thoi-tiet`): `bg-linear-to-br from-* to-*`, chuỗi mẫu, `keydown` và `event.key`.
- Bài 006 (`bai-006-gio-hang`): `Math.min/Math.max` để chặn giá trị, `disabled` và `disabled:`, `Intl.NumberFormat`.
- Bài 005 (`bai-005-binh-luan-dong`): uỷ quyền sự kiện với `closest`.

## Gợi ý từng bước

> Starter đã điền sẵn: màu, chữ, khoảng cách, nền gradient của từng thẻ, `absolute inset-0`, `transition-opacity`, `backface-hidden`, `group-data-active:opacity-100`, nút và viền focus, `disabled:`, chấm tròn và `data-active:bg-amber-600`. **Bốn thẻ đầu** (Sen Hồng, Lan Anh, Mây Trắng, Hoa Sữa) đã có đủ class 3D. **Hai thẻ cuối** (Thạch Thảo, Bình Minh) chưa có class 3D nào: bạn chép theo bốn thẻ đầu ở bước 3. Khung và vòng quay (`<div data-scene>` và `<ul data-ring>`) chưa có class 3D.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-scene` (khung phối cảnh), `data-ring` (vòng quay), `data-panel` (một thẻ, kèm `data-name`, `data-area`, `data-price`, `data-bedrooms`), `style="--i: 0"` (số thứ tự thẻ, là một biến CSS), `data-go="k"` (chấm thứ k, đếm từ 0), `data-prev`, `data-next`, `data-info`. Mỗi thẻ có hai tầng: `<li>` ngoài và `<div>` trong. Kiểm tra: mở trang, các thẻ bị ép phẳng và nghiêng chồng lên nhau, chưa thành vòng (chưa có 3D).

2. **CSS: khung phối cảnh và vòng quay.** **Bạn làm:** `<div data-scene>` thêm `perspective-distant`; `<ul data-ring>` thêm `transform-3d -translate-z-42 rotate-y-(--angle)`. `perspective-distant` đặt mắt người xem cách 1200px. `rotate-y-(--angle)` là cú pháp Tailwind lấy giá trị từ biến CSS: sinh ra `rotateY(var(--angle))`. Kiểm tra: mở DevTools, gõ vào `style` của `<ul data-ring>` dòng `--angle: -60deg` thì cả vòng xoay sang trái 60° (4 thẻ đã có sẵn class 3D nên đã nằm đúng chỗ trên vòng). Gõ `--angle: 0deg` để quay về.

3. **CSS: thẻ trên vòng và cái bẫy.** **Bạn làm:** trên **2 thẻ `<li data-panel>` cuối**: `<li>` thêm `rotate-y-[calc(var(--i)*60deg)]` rồi sau đó `transform-3d`; `<div>` bên trong thêm `translate-z-42`. `rotate-y-[...]` là giá trị tuỳ ý: Tailwind ghi nguyên biểu thức `calc()` vào CSS, mỗi thẻ có `--i` khác nhau nên ra góc khác nhau. Làm **theo đúng thứ tự** để gặp bẫy: với thẻ 5 chỉ thêm `rotate-y-[...]` và `translate-z-42`, **chưa** thêm `transform-3d` trên `<li>`. Gõ `--angle: -240deg` vào vòng. Thẻ 5 không nằm trên vòng: nó nhỏ hơn và lùi vào sâu hơn các thẻ khác. Thêm `transform-3d` vào `<li>` của thẻ 5: thẻ về đúng chỗ. Làm tiếp thẻ 6.

4. **JS: ghi góc của vòng.** **Bạn làm:** toàn bộ JS. Lấy các phần tử bằng `document.querySelector('[data-ring]')` và `Array.from(ring.querySelectorAll('[data-panel]'))`. Khai báo `let current = 0` (vị trí đang chọn) và `const step = 60`. Viết `render()`: `ring.style.setProperty('--angle', ...)`. `setProperty(tên, giá trị)` ghi một biến CSS vào thuộc tính `style` của phần tử, trả về `undefined`; tên biến phải có `--` ở đầu, giá trị là chuỗi. Giá trị là chuỗi mẫu `` `${-current * step}deg` ``. Trong `render()` cũng dùng `panels.forEach(function (panel, index) { ... })` với `panel.toggleAttribute('data-active', index === current)`. Gọi `render()` cuối file. Kiểm tra: tải trang thấy căn Sen Hồng ở giữa, rõ nét; sửa `current` thành 2 rồi tải lại thì vòng dừng ở căn 3.

5. **JS: nút Trước/Sau và chặn hai đầu.** **Bạn làm:** toàn bộ JS. Viết `goTo(index)`: `current = Math.max(0, Math.min(panels.length - 1, index))`, rồi gọi `render()`. `Math.min(a, b)` trả số nhỏ hơn, `Math.max(a, b)` trả số lớn hơn; lồng hai hàm để kẹp `index` vào khoảng 0–5. Gắn `click` cho `[data-prev]` gọi `goTo(current - 1)` và `[data-next]` gọi `goTo(current + 1)`. Trong `render()` ghi `prevButton.disabled = current === 0` và `nextButton.disabled = current === panels.length - 1`: thuộc tính `disabled` nhận `true` hoặc `false`, `true` thì nút không bấm được và `disabled:` của Tailwind có tác dụng. Kiểm tra: ở căn 1 nút "Trước" xám; bấm "Sau" 5 lần thì "Sau" xám, vòng quay mượt.

6. **JS: chấm tròn bằng uỷ quyền sự kiện.** **Bạn làm:** toàn bộ JS. Gắn **một** `click` lên `[data-dots]` (cha của sáu chấm). Trong hàm: `const dot = event.target.closest('[data-go]')`; `closest` đi từ phần tử bấm lên các cha, trả về phần tử khớp đầu tiên hoặc `null`. Nếu `dot` là `null` (bấm vào khoảng trống giữa các chấm) thì `return`. Nếu không, `goTo(Number(dot.dataset.go))`; `dataset.go` đọc `data-go` và luôn là **chuỗi**, nên bọc `Number(...)` để thành số. Trong `render()` thêm `dots.forEach(...)`: `dot.toggleAttribute('data-active', index === current)`; với chấm đang chọn dùng `setAttribute('aria-current', 'true')`, các chấm khác dùng `removeAttribute('aria-current')` để trình đọc màn hình biết chấm nào đang chọn. Kiểm tra: bấm chấm 4 nhảy thẳng tới căn 4, chấm 4 màu cam.

7. **JS: dòng thông tin và phím mũi tên.** **Bạn làm:** toàn bộ JS. Trong `render()`: `const data = panels[current].dataset;` rồi ghi `info.textContent` bằng chuỗi mẫu gồm số thứ tự, `data.name`, `data.area` và giá. Giá: tạo một lần `const formatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 })`, rồi `formatter.format(Number(data.price) / 1000000000)`. `maximumFractionDigits: 2` cho tối đa hai chữ số thập phân, và `vi-VN` dùng dấu phẩy thập phân ("3,9"). Gắn `keydown` lên `document`: `event.key === 'ArrowLeft'` gọi `goTo(current - 1)`, `'ArrowRight'` gọi `goTo(current + 1)`. Kiểm tra: dòng "3/6 · Căn hộ Mây Trắng · 72 m² · 3,9 tỷ"; mũi tên điều khiển vòng khi chưa focus vào nút nào.

8. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `perspective-distant` | `perspective: 1200px` |
| `transform-3d` | `transform-style: preserve-3d` |
| `-translate-z-42` | `translate: 0 0 -168px` (42 × 4px) |
| `translate-z-42` | `translate: 0 0 168px` |
| `rotate-y-(--angle)` | `transform: rotateY(var(--angle))` |
| `rotate-y-[calc(var(--i)*60deg)]` | `transform: rotateY(calc(var(--i) * 60deg))` |
| `group-data-active:opacity-100` | `.group[data-active] .x { opacity: 1 }` |
| `transition-transform duration-700` | `transition: transform 700ms` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Sáu thẻ xếp thành vòng tròn đều nhau, không thẻ nào nhỏ hơn hay lùi vào giữa vòng.
- [ ] "Trước" bị khoá ở căn 1, "Sau" bị khoá ở căn 6; bấm chấm nhảy đúng căn.
- [ ] Dòng thông tin đổi theo từng căn; giá có dấu phẩy ("2,65 tỷ" ở căn 1).
- [ ] DevTools: gỡ `transform-3d` khỏi `<li>` của thẻ 2 thì thẻ đó lùi vào giữa; gỡ `backface-hidden` khỏi một `<div>` thì thấy chữ ngược hiện qua khe hở khi xoay.
- [ ] DevTools: sửa `--i` của một thẻ từ 1 thành 3, thẻ nhảy sang vị trí khác trên vòng.
- [ ] Bàn phím: `←`/`→` chuyển căn; Tab tới từng nút và chấm đều thấy viền focus; Enter trên chấm đang focus nhảy tới căn đó.
- [ ] Bật `prefers-reduced-motion: reduce` trong DevTools: vòng đổi căn tức thì, không xoay.
- [ ] Tự hỏi: vì sao `translate-z` đặt ở `<div>` bên trong chứ không ở `<li>`? Vì sao `Number(dot.dataset.go)` cần bọc `Number`? Nếu cho quay vòng ở căn 6 bấm "Sau" thì góc phải tính thế nào để không quay ngược 300°?

## Thử thách thêm

1. Cho vòng quay tròn: ở căn 6 bấm "Sau" quay tiếp sang căn 1. Gợi ý: giữ biến `turns` tăng mãi (không cắt về 0), tính vị trí hiển thị bằng `((turns % 6) + 6) % 6`, góc ghi `-turns * step`. Không cần class mới.
2. Thêm hiệu ứng nghiêng nhẹ khi hover cho thẻ đang chọn. Gợi ý class: `group-data-active:hover:rotate-x-6` ở thẻ trong, nhớ `transition-[opacity,rotate]`.

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
		<title>Bài 011 - Xem căn hộ 3D</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<h1 class="title">Xem căn hộ mẫu</h1>
			<p class="subtitle">Xoay vòng quanh 6 căn hộ đang mở bán.</p>
			<div data-scene class="scene">
				<ul data-ring class="ring">
					<li data-panel data-name="Căn hộ Sen Hồng" data-area="54" data-price="2650000000" data-bedrooms="2" style="--i: 0" class="panel panel-0">
						<div class="panel-face">
							<p class="panel-rooms">2 phòng ngủ</p>
							<h2 class="panel-name">Căn hộ Sen Hồng</h2>
						</div>
					</li>
					<li data-panel data-name="Căn hộ Lan Anh" data-area="68" data-price="3400000000" data-bedrooms="2" style="--i: 1" class="panel panel-1">
						<div class="panel-face">
							<p class="panel-rooms">2 phòng ngủ</p>
							<h2 class="panel-name">Căn hộ Lan Anh</h2>
						</div>
					</li>
					<li data-panel data-name="Căn hộ Mây Trắng" data-area="72" data-price="3900000000" data-bedrooms="3" style="--i: 2" class="panel panel-2">
						<div class="panel-face">
							<p class="panel-rooms">3 phòng ngủ</p>
							<h2 class="panel-name">Căn hộ Mây Trắng</h2>
						</div>
					</li>
					<li data-panel data-name="Căn hộ Hoa Sữa" data-area="45" data-price="2100000000" data-bedrooms="1" style="--i: 3" class="panel panel-3">
						<div class="panel-face">
							<p class="panel-rooms">1 phòng ngủ</p>
							<h2 class="panel-name">Căn hộ Hoa Sữa</h2>
						</div>
					</li>
					<li data-panel data-name="Căn hộ Thạch Thảo" data-area="85" data-price="5200000000" data-bedrooms="3" style="--i: 4" class="panel panel-4">
						<div class="panel-face">
							<p class="panel-rooms">3 phòng ngủ</p>
							<h2 class="panel-name">Căn hộ Thạch Thảo</h2>
						</div>
					</li>
					<li data-panel data-name="Căn hộ Bình Minh" data-area="60" data-price="3000000000" data-bedrooms="2" style="--i: 5" class="panel panel-5">
						<div class="panel-face">
							<p class="panel-rooms">2 phòng ngủ</p>
							<h2 class="panel-name">Căn hộ Bình Minh</h2>
						</div>
					</li>
				</ul>
			</div>
			<p data-info aria-live="polite" class="info"></p>
			<div class="controls">
				<button type="button" data-prev class="nav-button">← Trước</button>
				<div data-dots class="dots">
				<button type="button" data-go="0" aria-label="Xem căn 1" class="dot"></button>
				<button type="button" data-go="1" aria-label="Xem căn 2" class="dot"></button>
				<button type="button" data-go="2" aria-label="Xem căn 3" class="dot"></button>
				<button type="button" data-go="3" aria-label="Xem căn 4" class="dot"></button>
				<button type="button" data-go="4" aria-label="Xem căn 5" class="dot"></button>
				<button type="button" data-go="5" aria-label="Xem căn 6" class="dot"></button>
				</div>
				<button type="button" data-next class="nav-button">Sau →</button>
			</div>
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
	border: 0;
	background: none;
	font: inherit;
	color: inherit;
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
	background: #f5f5f4;
	color: #1c1917;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	margin: 0 auto;
	min-height: 100vh;
	max-width: 448px;
	overflow-x: hidden;
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
	color: #57534e;
}

.scene {
	margin: 48px auto 0;
	height: 224px;
	width: 192px;
	perspective: 1200px;
}

.ring {
	position: relative;
	height: 100%;
	width: 100%;
	transform-style: preserve-3d;
	transform: translateZ(-168px) rotateY(var(--angle));
	transition: transform 700ms;
}

.panel {
	position: absolute;
	inset: 0;
	transform-style: preserve-3d;
	transform: rotateY(calc(var(--i) * 60deg));
}

.panel-face {
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: flex-end;
	border-radius: 16px;
	padding: 16px;
	color: #ffffff;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	opacity: 0.4;
	transform: translateZ(168px);
	backface-visibility: hidden;
	transition: opacity 500ms;
}

.panel[data-active] .panel-face {
	opacity: 1;
}

.panel-rooms {
	font-size: 14px;
	line-height: 20px;
}

.panel-name {
	font-size: 20px;
	line-height: 28px;
	font-weight: 700;
}

.panel-0 .panel-face {
	background: linear-gradient(to bottom right, #fbbf24, #ea580c);
}

.panel-1 .panel-face {
	background: linear-gradient(to bottom right, #fb7185, #db2777);
}

.panel-2 .panel-face {
	background: linear-gradient(to bottom right, #38bdf8, #2563eb);
}

.panel-3 .panel-face {
	background: linear-gradient(to bottom right, #34d399, #0d9488);
}

.panel-4 .panel-face {
	background: linear-gradient(to bottom right, #a78bfa, #9333ea);
}

.panel-5 .panel-face {
	background: linear-gradient(to bottom right, #a3e635, #16a34a);
}

.info {
	margin-top: 48px;
	text-align: center;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	font-variant-numeric: tabular-nums;
}

.controls {
	margin-top: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
}

.nav-button {
	border-radius: 8px;
	background: #d97706;
	padding: 8px 16px;
	font-weight: 500;
	color: #ffffff;
}

.nav-button:disabled {
	cursor: not-allowed;
	background: #d6d3d1;
	color: #78716c;
}

.nav-button:focus-visible,
.dot:focus-visible {
	outline: 2px solid #d97706;
	outline-offset: 2px;
}

.dots {
	display: flex;
	gap: 8px;
}

.dot {
	width: 12px;
	height: 12px;
	border-radius: 9999px;
	background: #d6d3d1;
}

.dot[data-active] {
	background: #d97706;
}

@media (prefers-reduced-motion: reduce) {
	.ring,
	.panel-face {
		transition: none;
	}
}
```

`solution/script.js`

```js
const ring = document.querySelector('[data-ring]');
const panels = Array.from(ring.querySelectorAll('[data-panel]'));
const dotsBox = document.querySelector('[data-dots]');
const dots = Array.from(dotsBox.querySelectorAll('[data-go]'));
const info = document.querySelector('[data-info]');
const prevButton = document.querySelector('[data-prev]');
const nextButton = document.querySelector('[data-next]');
const formatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });
const step = 60;
let current = 0;

function render() {
	ring.style.setProperty('--angle', `${-current * step}deg`);
	panels.forEach(function (panel, index) {
		panel.toggleAttribute('data-active', index === current);
	});
	dots.forEach(function (dot, index) {
		dot.toggleAttribute('data-active', index === current);
		if (index === current) {
			dot.setAttribute('aria-current', 'true');
		} else {
			dot.removeAttribute('aria-current');
		}
	});
	const data = panels[current].dataset;
	const price = formatter.format(Number(data.price) / 1000000000);
	info.textContent = `${current + 1}/${panels.length} · ${data.name} · ${data.area} m² · ${price} tỷ`;
	prevButton.disabled = current === 0;
	nextButton.disabled = current === panels.length - 1;
}

function goTo(index) {
	current = Math.max(0, Math.min(panels.length - 1, index));
	render();
}

prevButton.addEventListener('click', function () {
	goTo(current - 1);
});

nextButton.addEventListener('click', function () {
	goTo(current + 1);
});

dotsBox.addEventListener('click', function (event) {
	const dot = event.target.closest('[data-go]');
	if (!dot) {
		return;
	}
	goTo(Number(dot.dataset.go));
});

document.addEventListener('keydown', function (event) {
	if (event.key === 'ArrowLeft') {
		goTo(current - 1);
	}
	if (event.key === 'ArrowRight') {
		goTo(current + 1);
	}
});

render();
```

</details>

### Giải thích từng hàm

- `render()`: vẽ lại toàn bộ giao diện theo `current`. Không nhận tham số, không trả về gì. Ghi `--angle` cho vòng, bật `data-active` cho đúng một thẻ và một chấm, ghi dòng thông tin, khoá hoặc mở hai nút. Mọi thao tác của người dùng đều kết thúc bằng gọi hàm này.
- `goTo(index)`: nhận vị trí muốn tới (có thể ngoài khoảng), kẹp vào 0–5, gán cho `current` rồi gọi `render()`. Không trả về gì.
- `document.querySelector(selector)`: trả phần tử đầu tiên khớp selector hoặc `null`. Bài này chỉ dùng selector thuộc tính như `'[data-ring]'`.
- `querySelectorAll(selector)`: trả `NodeList` mọi phần tử khớp. `Array.from(...)` đổi nó thành mảng thật để dùng `forEach`.
- `Array.from(nodeList)`: tạo mảng mới từ một danh sách giống mảng, trả về mảng đó.
- `forEach(function (item, index) { ... })`: gọi hàm cho từng phần tử, truyền thêm vị trí làm tham số thứ hai. Trả `undefined`.
- `style.setProperty(name, value)`: ghi một thuộc tính CSS hoặc biến CSS vào `style` nội tuyến của phần tử. Khác `style.angle = ...`: với biến CSS bắt buộc dùng `setProperty` và tên phải bắt đầu bằng `--`. Ở đây ghi `--angle` để `rotate-y-(--angle)` hoặc `rotateY(var(--angle))` đọc.
- `toggleAttribute(name, force)`: có thêm tham số thứ hai so với `toggleAttribute(name)`. `force` là `true` thì luôn thêm thuộc tính, `false` thì luôn gỡ, không phụ thuộc trạng thái cũ. Ở đây `force` là `index === current`, nên chỉ thẻ đang chọn có `data-active`.
- `setAttribute(name, value)` và `removeAttribute(name)`: ghi hoặc gỡ một thuộc tính HTML. Dùng cho `aria-current="true"` trên chấm đang chọn.
- `element.dataset`: object chứa mọi thuộc tính `data-*` của phần tử, tên chuyển sang camelCase (`data-go` thành `dataset.go`). Giá trị luôn là chuỗi.
- `Number(value)`: đổi chuỗi thành số (`Number('3')` là `3`). Dùng cho `dataset.go` và `dataset.price`.
- `Math.max(a, b)` và `Math.min(a, b)`: trả số lớn hơn, số nhỏ hơn. `Math.max(0, Math.min(5, index))` kẹp `index` vào 0–5.
- `new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 })`: tạo bộ định dạng số theo kiểu Việt Nam. `.format(n)` trả chuỗi như `'3,9'`. Tuỳ chọn `maximumFractionDigits: 2` giới hạn tối đa hai chữ số sau dấu phẩy, số thừa số 0 thì bỏ (`3,90` thành `3,9`).
- `event.target.closest(selector)`: đi từ phần tử vừa bị bấm lên các tổ tiên, trả phần tử đầu tiên khớp selector hoặc `null`. Dùng để biết bấm vào chấm nào dù chỉ gắn một listener lên cha.
- `if (!dot) { return; }`: `!` đảo giá trị đúng sai; `null` là "sai" nên `!dot` là `true` khi không bấm trúng chấm nào. `return` sớm thoát hàm ngay, phần sau không chạy.
- `element.textContent = chuỗi`: gán toàn bộ chữ bên trong phần tử, thay chữ cũ; chuỗi được coi là chữ thường, không phải HTML. Dùng cho dòng thông tin `[data-info]`.
- `button.disabled = điều kiện`: thuộc tính `disabled` nhận `true` hoặc `false`. `current === 0` so sánh bằng nhau chặt chẽ và cho kết quả `true`/`false`.
- `` `${biểu thức}` ``: chuỗi mẫu, ghép giá trị vào chuỗi. `-current * step` là phép toán, kết quả đổi thành chữ.
- `addEventListener('click', hàm)`: đăng ký hàm chạy khi bấm. Truyền tên hàm hoặc hàm vô danh, không thêm `()`.
- `event.key`: tên phím vừa nhấn, ví dụ `'ArrowLeft'`, `'ArrowRight'`.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `perspective-distant` trên `<div data-scene>` | `.scene { perspective: 1200px }` |
| `transform-3d -translate-z-42 rotate-y-(--angle)` trên `<ul data-ring>` | `.ring { transform-style: preserve-3d; transform: translateZ(-168px) rotateY(var(--angle)) }` |
| `transform-3d rotate-y-[calc(var(--i)*60deg)]` trên `<li>` | `.panel { transform-style: preserve-3d; transform: rotateY(calc(var(--i) * 60deg)) }` |
| `translate-z-42` trên `<div>` | `.panel-face { transform: translateZ(168px) }` |
| `backface-hidden` | `backface-visibility: hidden` |
| `group-data-active:opacity-100` | `.panel[data-active] .panel-face { opacity: 1 }` |
| `data-active:bg-amber-600` trên chấm | `.dot[data-active] { background: #d97706 }` |
| `disabled:bg-stone-300 disabled:text-stone-500` | `.nav-button:disabled { background: #d6d3d1; color: #78716c }` |

Khác biệt nhỏ: Tailwind ghi `translate` và `rotate` thành hai thuộc tính riêng (`translate` áp trước, `rotate` áp sau), còn bản CSS thuần gộp vào `transform` theo thứ tự `translateZ(...) rotateY(...)`: kết quả hình giống nhau.
