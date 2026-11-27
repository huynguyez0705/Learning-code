# Bài 024: Phòng thử bóng đổ, nguồn sáng xoay và hai cái bẫy của thanh trượt

Ngày học 9, bài 2/3, cấp 2, chủ đề CSS: Đổ bóng (ứng dụng bảng điều khiển công cụ thiết kế), độ khó ★★★★☆, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này **không** lưu gì. Tải lại trang thì bốn thanh trượt trở về mẫu "Mềm".

## Mục tiêu

- Bốn thanh trượt (hướng ánh sáng 0 đến 359 độ, khoảng cách, độ nhoè, độ đậm) điều khiển bóng của một thẻ ngay khi kéo, và mỗi giá trị hiện bên cạnh nhãn.
- Bóng **ngược hướng ánh sáng**: kéo nguồn sáng lên đỉnh (0 độ) thì bóng rơi xuống dưới; kéo sang phải (90 độ) thì bóng lệch sang trái. Một chấm vàng (mặt trời) quay quanh thẻ đúng theo thanh "Hướng ánh sáng".
- Dòng "Bóng lan ra tối đa N px" cộng **đúng** khoảng cách và độ nhoè (12 và 32 ra 44, không ra "1232"), và khối mã bên dưới hiện đúng dòng `box-shadow: ...`.
- Ba nút mẫu Mềm, Cứng, Nổi nạp bộ số có sẵn. Kéo thanh trượt xong bấm lại mẫu vẫn về đúng số ban đầu của mẫu đó (không bị mẫu "bẩn").
- Bóng và vòng viền mảnh quanh thẻ cùng tồn tại (không cái nào xoá cái nào).

## Kết quả mong đợi

Bên trái là khung xám có một thẻ trắng ở giữa, chấm vàng quay quanh viền khung. Bên phải là bảng trắng: tiêu đề, bốn thanh trượt xanh ngọc kèm số, ba nút mẫu, dòng "Bóng lan ra tối đa", và một khối đen chứa mã `box-shadow` xanh nhạt, đổi theo từng pixel kéo. Màn hình hẹp thì hai khối xếp dọc.

## Tư duy

**JS tính con số, CSS vẽ.** Bài này không đụng `style.boxShadow`. JS tính ra **cả chuỗi** `-8px 8px 32px 0 rgb(0 0 0 / 0.20)` rồi ghi vào biến CSS `--shadow` bằng `style.setProperty`; Tailwind đọc biến đó qua `shadow-(--shadow)`. Tương tự `--angle` cho vòng quay của mặt trời. Muốn đổi cách vẽ bóng chỉ cần sửa class, không đụng JS.

**Cái bẫy 1: bóng đi ngược hướng ánh sáng, và trục y hướng xuống.** Đặt "hướng ánh sáng" là góc `θ` đo từ đỉnh, theo chiều kim đồng hồ (0 độ là sáng từ trên đỉnh, 90 độ là sáng từ bên phải). Mặt trời nằm ở hướng `(sin θ, -cos θ)` tính từ tâm thẻ, vì trên màn hình trục x hướng sang phải **còn trục y hướng xuống** (khác toán học). Bóng đổ ngược hướng đó, tức `(-sin θ, cos θ)` nhân khoảng cách. Nếu theo phản xạ viết `x = d * cos θ`, `y = d * sin θ` thì bóng rơi cùng phía với nguồn sáng: kéo sáng sang phải, bóng chạy xuống dưới. Giống nhìn người đứng trước đèn pin: cái bóng luôn nằm phía sau lưng họ so với đèn.

**Cái bẫy 2: `input.value` luôn là chuỗi.** Thanh trượt báo giá trị qua `.value`, mà `.value` là chuỗi `"12"`. Phép nhân thì JS tự đổi chuỗi thành số, nên `"12" * 0.5` vẫn ra 6; nhưng phép cộng thì nối chuỗi: `"12" + "32"` ra `"1232"`. `valueAsNumber` trả thẳng kiểu số, hết phải đoán.

**Cái bẫy 3: hai biến cùng trỏ vào một object.** `state = presets.mem` không sao chép gì cả, `state` và `presets.mem` là **cùng một object**. Kéo thanh trượt sửa `state` cũng là sửa luôn mẫu; bấm lại "Mềm" thì "nạp" đúng object đã bị sửa. `structuredClone(object)` tạo bản sao độc lập hoàn toàn (kể cả object lồng nhau), nên sửa bản sao không ảnh hưởng bản gốc.

**Các lớp bóng cộng dồn.** `shadow-*` và `ring-*` của Tailwind cùng viết vào thuộc tính `box-shadow` qua các biến trung gian rồi ghép chung, nên viền mảnh `ring-1 ring-black/5` đứng cạnh bóng lớn mà không đè nhau. Lời giải CSS thuần phải tự ghép thành `box-shadow: var(--shadow), 0 0 0 1px ...` (hai lớp, ngăn cách bằng dấu phẩy).

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| `shadow-(--shadow)` vẽ bóng từ biến, `ring-1 ring-black/5` viền mảnh | Tính chuỗi bóng bằng `Math.sin`/`Math.cos`, ghi `--shadow` |
| `rotate-(--angle)` quay cả cánh tay mang mặt trời | Ghi `--angle` (ví dụ `330deg`) |
| `aria-pressed:border-teal-600 aria-pressed:bg-teal-50` nút mẫu đang chọn | Ghi `aria-pressed` cho ba nút mẫu |
| `accent-teal-600` màu thanh trượt, `focus-visible:` viền focus | Đọc `valueAsNumber`, ghi số hiển thị, mã và "bóng lan ra" |

JS không đặt `style.boxShadow` hay `style.transform`, không thêm hoặc gỡ class, không tìm phần tử bằng class.

## Ôn lại

- Bài 008 (`bai-008-ke-dia-nhac`): bóng `shadow-*` và `inset-shadow-*` theo trạng thái; bài 016 (`bai-016-bang-viec-the-dan`): `drop-shadow-*`.
- Bài 011 (`bai-011-xem-can-ho-3d`) và bài 020 (`bai-020-ghi-chu-kinh-mo`): `style.setProperty('--x', ...)` kết hợp `rotate-*-(--x)`.
- Bài 006 (`bai-006-gio-hang`): `accent-*`, `Number`; bài 021 (`bai-021-dang-ky-thanh-vien`): `form.elements`, sự kiện `input`, `Math`.
- Bài 014 (`bai-014-hop-thu-huy-hieu`): `aria-pressed:` cho nút bật tắt; bài 020: object `state` và hàm `render()`.

## Gợi ý từng bước

> Starter đã điền sẵn: bố cục hai khối (`md:grid-cols-2`), khung xám, mặt trời `absolute` trong cánh tay (`pointer-events-none absolute inset-0`), thẻ trắng (chỉ thiếu bóng), bảng điều khiển, bốn hàng nhãn, số và thanh trượt `accent-teal-600`, ba nút mẫu `aria-pressed:`, dòng "Bóng lan ra", khối mã. Bạn tự thêm hai nhóm class mới: **bóng từ biến kèm viền ring** trên thẻ và **vòng quay** trên cánh tay.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc `data-app`, `data-controls` (form có bốn `<input type="range">` với `name` là `angle`, `distance`, `blur`, `opacity`), bốn `<output data-output="...">`, `data-card`, `data-arm`, ba nút `data-preset` (`mem`, `cung`, `noi`), `data-reach`, `data-code`. Kiểm tra: mở trang thấy bố cục, thanh trượt ở giữa, chưa có số, chưa có bóng.

2. **JS: state và đọc thanh trượt.** **Bạn làm:** toàn bộ JS. Mảng `controls` tên bốn thanh, object `units` (`°`, ` px`, ` px`, `%`), object `presets` ba mẫu `{ angle, distance, blur, opacity }`, và `let state` copy từ mẫu "Mềm" (tạm viết `{ angle: 330, distance: 12, blur: 32, opacity: 20 }`, bước 7 sẽ đổi). Viết `render()` điền từng thanh (`form.elements[tên].value = state[tên]`) và `<output>` (`querySelector('[data-output="' + tên + '"]')`, `textContent`), và dòng `reach.textContent`. Gắn `input` ở form: `handleInput(event)` đọc `event.target.name`, bỏ qua nếu không nằm trong `controls` (`includes`), rồi gán `state[name]`. **Bẫy:** làm sai trước bằng `event.target.value`: kéo "Khoảng cách" và "Độ nhoè" rồi nhìn dòng "bóng lan ra": 12 và 32 thành "1232 px". Sửa thành `event.target.valueAsNumber` (trả số). Kiểm tra: dòng đó ra đúng tổng, kéo thanh số nhảy theo.

3. **JS: `getShadow` và cái bẫy hướng bóng.** **Bạn làm:** toàn bộ JS. Hàm `getShadow(values)` đổi độ sang radian (`độ * Math.PI / 180`), tính `x = Math.round(-Math.sin(radians) * distance)` và `y = Math.round(Math.cos(radians) * distance)`, giá trị đậm `(opacity / 100).toFixed(2)`, rồi ghép chuỗi `x px y px blur px 0 rgb(0 0 0 / alpha)`. Làm sai trước: dùng `x = cos`, `y = sin` không đổi dấu rồi chạy bước 4, 5, 6 để thấy: kéo ánh sáng sang phải mà bóng chạy xuống. Sửa theo công thức trên (đây là lý do có dấu trừ trước `Math.sin`). `toFixed(2)` đổi số thành chuỗi có đúng 2 chữ số thập phân. Hiện mã: `code.textContent = 'box-shadow: ' + shadow + ';'`. Kiểm tra: trong Console gọi `getShadow({ angle: 0, distance: 10, blur: 0, opacity: 50 })` phải ra `0px 10px 0px 0 rgb(0 0 0 / 0.50)` (sáng từ đỉnh, bóng rơi xuống); với `angle: 90` phải ra `-10px 0px ...`.

4. **JS: ghi biến CSS.** **Bạn làm:** toàn bộ JS. Trong `render()` gọi `card.style.setProperty('--shadow', shadow)` và `arm.style.setProperty('--angle', state.angle + 'deg')`. `setProperty(tên, giá trị)` ghi một CSS custom property vào thuộc tính `style` của phần tử, không động tới thuộc tính khác. Kiểm tra: DevTools thấy `style="--shadow: ...; "` trên thẻ và `--angle` trên cánh tay; giao diện chưa đổi vì CSS chưa đọc biến.

5. **CSS: bóng từ biến và viền ring.** **Bạn làm:** trên `<div data-card>` thêm `shadow-(--shadow) ring-1 ring-black/5`. `shadow-(--shadow)` nghĩa là `box-shadow: var(--shadow)`; `ring-1 ring-black/5` thêm viền mảnh 1px đen 5% (thực chất cũng là một lớp `box-shadow` 0 0 0 1px). Kiểm tra: kéo thanh trượt, bóng đổi theo; DevTools, tab Computed của thẻ, thấy `box-shadow` gồm **hai** lớp (bóng và viền). Nếu bóng không hiện, thử `shadow-[var(--shadow)]` và so sánh Computed.

6. **CSS: mặt trời quay quanh thẻ.** **Bạn làm:** trên `<div data-arm>` thêm `rotate-(--angle)`, tức `rotate: var(--angle)`. Cánh tay phủ kín khung (`inset-0`) nên xoay quanh tâm khung, còn chấm vàng nằm ở đầu cánh tay. Kiểm tra: kéo "Hướng ánh sáng" sang 90 thì chấm vàng ở bên phải, 180 ở dưới, 270 ở bên trái; bóng luôn ở phía đối diện chấm vàng.

7. **JS: nút mẫu, `structuredClone` và cái bẫy tham chiếu.** **Bạn làm:** toàn bộ JS. Một listener `click` ở `data-app`, dùng `closest('[data-preset]')`. `applyPreset(name)`: làm sai trước bằng `state = presets[name]` (đổi `const` thành `let` nếu cần). Bấm "Cứng", kéo "Độ nhoè" lên 30, rồi bấm lại "Cứng": độ nhoè vẫn 30 (mẫu bị sửa). Sửa: `state = structuredClone(presets[name])`. Dùng biến `activePreset` (chuỗi tên mẫu, rỗng khi người dùng tự kéo thanh trượt) để `render()` đặt `aria-pressed` cho ba nút. Kiểm tra: kéo thanh nào đó thì không nút mẫu nào sáng; bấm lại mẫu thì số quay đúng về gốc.

8. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra, đặc biệt thử bàn phím với thanh trượt (phím mũi tên, Home, End).

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `shadow-(--shadow)` | `box-shadow: var(--shadow)` |
| `shadow-(--shadow) ring-1 ring-black/5` | `box-shadow: var(--shadow), 0 0 0 1px rgb(0 0 0 / 0.05)` |
| `rotate-(--angle)` | `rotate: var(--angle)` |
| `absolute inset-0 pointer-events-none` | `position: absolute; inset: 0; pointer-events: none` |
| `absolute inset-x-0 top-3 mx-auto h-5 w-5` | `position: absolute; left: 0; right: 0; top: 12px; margin: 0 auto; width: 20px; height: 20px` |
| `accent-teal-600` | `accent-color: #0d9488` |
| `aria-pressed:border-teal-600 aria-pressed:bg-teal-50` | `.preset[aria-pressed="true"] { border-color: #0d9488; background: #f0fdfa }` |
| `md:grid-cols-2` | `@media (min-width: 768px) { grid-template-columns: repeat(2, minmax(0, 1fr)) }` |

## Tự kiểm tra

- [ ] Hướng 0 độ: chấm vàng ở đỉnh, bóng rơi thẳng xuống. 90 độ: chấm bên phải, bóng sang trái. 180 độ: chấm ở dưới, bóng lên trên. 270 độ: chấm bên trái, bóng sang phải.
- [ ] Khoảng cách 12 và độ nhoè 32 cho "44 px" (cộng số, không nối chuỗi). Mã trong khối đen khớp từng giá trị với thẻ (so với Computed `box-shadow`).
- [ ] Ba nút mẫu cho ba kiểu bóng khác rõ (Cứng có bóng sắc cạnh vì độ nhoè 0). Kéo thanh trượt thì nút mẫu tắt sáng; bấm lại mẫu thì số về đúng giá trị gốc, kể cả sau khi đã kéo nhiều lần.
- [ ] DevTools: xoá `ring-1` thì viền mảnh biến mất mà bóng còn; xoá `rotate-(--angle)` thì chấm vàng đứng yên ở đỉnh; sửa tay `--shadow` ở thuộc tính `style` thấy bóng đổi tức thì.
- [ ] Bàn phím: Tab đi qua bốn thanh trượt (có viền focus xanh ngọc) rồi ba nút mẫu; mũi tên đổi giá trị 1 đơn vị và gửi sự kiện `input`; Enter hoặc Space bấm được nút mẫu.
- [ ] Bật `prefers-reduced-motion: reduce`: bài này không có chuyển động lớn nào, chỉ `transition-colors` của nút mẫu bị `motion-reduce:transition-none` tắt; xác nhận không có chuyển động nào bị thiếu `motion-reduce:`.
- [ ] Thu nhỏ cửa sổ dưới 768px: hai khối xếp dọc, không có thanh cuộn ngang trang (khối mã tự có thanh cuộn riêng).
- [ ] Tự hỏi: vì sao bóng phải ngược hướng ánh sáng, và vì sao có dấu trừ trước `Math.sin` mà không có trước `Math.cos`? Vì sao `"12" + "32"` ra `"1232"`? `structuredClone` khác gán `state = presets.mem` ở chỗ nào?

## Thử thách thêm

1. Thêm thanh trượt "Lan rộng" (spread) từ -10 đến 20 px làm tham số thứ tư của `box-shadow` (thay số `0` cố định trong `getShadow`), nhớ thêm vào `controls`, `units`, `presets` và một `<input name="spread">` trong HTML.
2. Thêm nút bật "Bóng trong" đổi chuỗi bóng thành `inset ...` (thêm từ khoá `inset` ở đầu), rồi so sánh với `inset-shadow-*` của Tailwind ở bài 008.

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
		<title>Bài 024 - Phòng thử bóng đổ</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main data-app class="app">
			<section aria-label="Xem trước bóng đổ" class="stage">
				<div data-arm aria-hidden="true" class="arm">
					<span class="sun"></span>
				</div>
				<div data-card class="card">Thẻ mẫu</div>
			</section>
			<section class="panel">
				<h1 class="heading">Phòng thử bóng đổ</h1>
				<form data-controls class="controls">
					<div class="control">
						<div class="control-head">
							<label for="angle" class="control-label">Hướng ánh sáng</label>
							<output data-output="angle" for="angle" class="control-value"></output>
						</div>
						<input id="angle" name="angle" type="range" min="0" max="359" step="1" class="range" />
					</div>
					<div class="control">
						<div class="control-head">
							<label for="distance" class="control-label">Khoảng cách</label>
							<output data-output="distance" for="distance" class="control-value"></output>
						</div>
						<input id="distance" name="distance" type="range" min="0" max="40" step="1" class="range" />
					</div>
					<div class="control">
						<div class="control-head">
							<label for="blur" class="control-label">Độ nhoè</label>
							<output data-output="blur" for="blur" class="control-value"></output>
						</div>
						<input id="blur" name="blur" type="range" min="0" max="60" step="1" class="range" />
					</div>
					<div class="control">
						<div class="control-head">
							<label for="opacity" class="control-label">Độ đậm</label>
							<output data-output="opacity" for="opacity" class="control-value"></output>
						</div>
						<input id="opacity" name="opacity" type="range" min="0" max="100" step="1" class="range" />
					</div>
				</form>
				<div role="group" aria-label="Mẫu bóng" class="presets">
					<button type="button" data-preset="mem" aria-pressed="false" class="preset">Mềm</button>
					<button type="button" data-preset="cung" aria-pressed="false" class="preset">Cứng</button>
					<button type="button" data-preset="noi" aria-pressed="false" class="preset">Nổi</button>
				</div>
				<p class="reach-text">Bóng lan ra tối đa <strong data-reach class="reach-value"></strong>.</p>
				<pre class="code"><code data-code></code></pre>
			</section>
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
input {
	font: inherit;
	color: inherit;
}

button {
	background: none;
	cursor: pointer;
}

h1 {
	font-size: 20px;
	line-height: 28px;
	font-weight: 700;
}

pre,
code {
	font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.site {
	min-height: 100vh;
	background: #f4f4f5;
	padding: 16px;
	color: #18181b;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.app {
	margin: 0 auto;
	display: grid;
	max-width: 768px;
	gap: 16px;
}

.stage {
	position: relative;
	display: grid;
	height: 288px;
	place-items: center;
	border-radius: 24px;
	background: #e4e4e7;
}

.arm {
	position: absolute;
	inset: 0;
	pointer-events: none;
	rotate: var(--angle);
}

.sun {
	position: absolute;
	left: 0;
	right: 0;
	top: 12px;
	margin: 0 auto;
	width: 20px;
	height: 20px;
	border-radius: 9999px;
	background: #fcd34d;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.card {
	display: grid;
	width: 112px;
	height: 112px;
	place-items: center;
	border-radius: 16px;
	background: #ffffff;
	font-weight: 600;
	color: #52525b;
	box-shadow: var(--shadow), 0 0 0 1px rgb(0 0 0 / 0.05);
}

.panel {
	border: 1px solid #e4e4e7;
	border-radius: 24px;
	background: #ffffff;
	padding: 20px;
}

.controls {
	margin-top: 16px;
	display: grid;
	gap: 16px;
}

.control {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.control-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	line-height: 20px;
}

.control-label {
	font-weight: 500;
}

.control-value {
	font-variant-numeric: tabular-nums;
	color: #71717a;
}

.range {
	width: 100%;
	accent-color: #0d9488;
}

.range:focus-visible {
	outline: 2px solid #0d9488;
	outline-offset: 4px;
}

.presets {
	margin-top: 20px;
	display: flex;
	gap: 8px;
}

.preset {
	border: 1px solid #d4d4d8;
	border-radius: 9999px;
	padding: 4px 12px;
	font-size: 14px;
	line-height: 20px;
	transition: background-color 150ms, border-color 150ms;
}

.preset:hover {
	background: #f4f4f5;
}

.preset[aria-pressed="true"] {
	border-color: #0d9488;
	background: #f0fdfa;
	color: #115e59;
}

.preset:focus-visible {
	outline: 2px solid #0d9488;
	outline-offset: 2px;
}

.reach-text {
	margin-top: 20px;
	font-size: 14px;
	line-height: 20px;
	color: #52525b;
}

.reach-value {
	font-weight: 600;
	font-variant-numeric: tabular-nums;
}

.code {
	margin-top: 12px;
	overflow-x: auto;
	border-radius: 12px;
	background: #18181b;
	padding: 12px;
	font-size: 12px;
	line-height: 16px;
	color: #99f6e4;
}

@media (min-width: 768px) {
	.app {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (prefers-reduced-motion: reduce) {
	.preset {
		transition: none;
	}
}
```

`solution/script.js`

```js
const app = document.querySelector('[data-app]');
const form = app.querySelector('[data-controls]');
const card = app.querySelector('[data-card]');
const arm = app.querySelector('[data-arm]');
const code = app.querySelector('[data-code]');
const reach = app.querySelector('[data-reach]');
const presetButtons = app.querySelectorAll('[data-preset]');

const presets = {
	mem: { angle: 330, distance: 12, blur: 32, opacity: 20 },
	cung: { angle: 315, distance: 10, blur: 0, opacity: 35 },
	noi: { angle: 20, distance: 28, blur: 48, opacity: 40 },
};
const controls = ['angle', 'distance', 'blur', 'opacity'];
const units = { angle: '°', distance: ' px', blur: ' px', opacity: '%' };

let state = structuredClone(presets.mem);
let activePreset = 'mem';

function getShadow(values) {
	const radians = (values.angle * Math.PI) / 180;
	const x = Math.round(-Math.sin(radians) * values.distance);
	const y = Math.round(Math.cos(radians) * values.distance);
	const alpha = (values.opacity / 100).toFixed(2);
	return x + 'px ' + y + 'px ' + values.blur + 'px 0 rgb(0 0 0 / ' + alpha + ')';
}

function render() {
	const shadow = getShadow(state);
	card.style.setProperty('--shadow', shadow);
	arm.style.setProperty('--angle', state.angle + 'deg');
	controls.forEach(function (name) {
		form.elements[name].value = state[name];
		form.querySelector('[data-output="' + name + '"]').textContent = state[name] + units[name];
	});
	code.textContent = 'box-shadow: ' + shadow + ';';
	reach.textContent = state.distance + state.blur + ' px';
	presetButtons.forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.preset === activePreset));
	});
}

function handleInput(event) {
	const name = event.target.name;
	if (!controls.includes(name)) {
		return;
	}
	state[name] = event.target.valueAsNumber;
	activePreset = '';
	render();
}

function applyPreset(name) {
	state = structuredClone(presets[name]);
	activePreset = name;
	render();
}

function handleClick(event) {
	const button = event.target.closest('[data-preset]');
	if (button) {
		applyPreset(button.dataset.preset);
	}
}

form.addEventListener('input', handleInput);
app.addEventListener('click', handleClick);
render();
```

</details>

### Giải thích từng hàm

- `getShadow(values)`: nhận object `{ angle, distance, blur, opacity }`, trả chuỗi giá trị `box-shadow`. `Math.PI` là hằng số π; `độ * Math.PI / 180` đổi độ sang radian vì `Math.sin`/`Math.cos` tính theo radian. `Math.sin(r)` và `Math.cos(r)` trả số từ -1 đến 1. Dấu `-` trước `Math.sin` đảo chiều để bóng đi ngược nguồn sáng. `Math.round(số)` làm tròn tới số nguyên gần nhất. `(số).toFixed(2)` trả **chuỗi** với 2 chữ số thập phân (ví dụ `0.2` thành `"0.20"`). Cuối cùng ghép chuỗi bằng `+`.
- `render()`: vẽ lại mọi thứ từ `state`. `card.style.setProperty('--shadow', shadow)` ghi một CSS custom property: tham số thứ nhất là tên (phải có `--`), thứ hai là giá trị chuỗi; khác `style.boxShadow = ...` ở chỗ nó ghi vào biến chứ không phải thuộc tính CSS thật, nên chính class Tailwind quyết định biến được dùng ở đâu. `controls.forEach(function (name) {...})` chạy hàm cho từng tên. `form.elements[name]` lấy ô nhập trong form theo thuộc tính `name`; `.value = số` ghi giá trị (trình duyệt đổi thành chuỗi). `form.querySelector('[data-output="' + name + '"]')` tìm `<output>` theo thuộc tính `data-output` có giá trị bằng `name`. `textContent = chuỗi` ghi chữ vào phần tử, thay mọi nội dung con (an toàn hơn `innerHTML` vì không dựng HTML). `state.distance + state.blur + ' px'` cộng hai số trước (từ trái sang phải), rồi nối chuỗi. `presetButtons.forEach(...)` đặt `aria-pressed` cho ba nút bằng `String(button.dataset.preset === activePreset)`: `===` so sánh chặt, `String(true)` đổi sang `"true"`.
- `handleInput(event)`: nhận sự kiện `input` (nổi bọt từ từng thanh trượt lên form). `event.target` là thanh đang kéo, `.name` là thuộc tính `name` của nó. `controls.includes(name)` trả `true` nếu mảng có chuỗi đó; `!` đảo kết quả; `return` sớm thoát khi không phải bốn thanh của ta. `event.target.valueAsNumber` trả giá trị thanh trượt dạng **số** (khác `.value` luôn là chuỗi). `state[name] = ...` gán theo khoá động. Gán `activePreset = ''` để không nút mẫu nào sáng.
- `applyPreset(name)`: `structuredClone(presets[name])` trả bản sao sâu, độc lập với object gốc (khác `state = presets[name]` chỉ trỏ chung một object). Rồi ghi `activePreset` và `render()`.
- `handleClick(event)`: uỷ quyền click ở `data-app`. `event.target.closest('[data-preset]')` đi ngược lên cây DOM tìm phần tử có thuộc tính `data-preset`, trả `null` nếu không có; `if (button)` chỉ chạy khi tìm thấy. `button.dataset.preset` trả giá trị thuộc tính `data-preset` (`"mem"`, `"cung"`, `"noi"`).
- `form.addEventListener('input', handleInput)` và `app.addEventListener('click', handleClick)`: đăng ký hàm xử lý bằng cách truyền tên hàm, không có `()` vì trình duyệt sẽ tự gọi khi có sự kiện. `render()` ở cuối file chạy một lần để dựng trạng thái đầu.
- `let state` và `let activePreset`: dùng `let` vì sẽ gán lại. `const presets`, `controls`, `units`: `const` vì không gán lại biến (nội dung mảng, object vẫn đọc được).
- `querySelectorAll('[data-preset]')`: trả danh sách mọi nút có thuộc tính đó, ở đây gọi một lần lúc khởi động.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Tailwind trong starter | CSS trong `solution/style.css` |
|---|---|
| `shadow-(--shadow) ring-1 ring-black/5` trên thẻ | `.card { box-shadow: var(--shadow), 0 0 0 1px rgb(0 0 0 / 0.05) }` |
| `rotate-(--angle)` trên cánh tay | `.arm { rotate: var(--angle) }` |
| `pointer-events-none absolute inset-0` | `.arm { position: absolute; inset: 0; pointer-events: none }` |
| `relative grid h-72 place-items-center rounded-3xl bg-zinc-200` | `.stage { position: relative; display: grid; height: 288px; place-items: center; border-radius: 24px; background: #e4e4e7 }` |
| `mx-auto grid max-w-3xl gap-4 md:grid-cols-2` | `.app { margin: 0 auto; display: grid; max-width: 768px; gap: 16px }` và trong `@media (min-width: 768px)` hai cột |
| `w-full accent-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4` | `.range { width: 100%; accent-color: #0d9488 }` và `.range:focus-visible { outline: 2px solid #0d9488; outline-offset: 4px }` |
| `flex items-center justify-between text-sm` | `.control-head { display: flex; align-items: center; justify-content: space-between; font-size: 14px }` |
| `transition-colors motion-reduce:transition-none` trên nút mẫu | `transition: background-color 150ms, border-color 150ms` và trong `@media (prefers-reduced-motion: reduce)` đặt `transition: none` |

Khác biệt nhỏ: bên Tailwind, `shadow-*` và `ring-*` ghép qua các biến `--tw-shadow`, `--tw-ring-shadow`; bên CSS thuần ta phải tự viết danh sách hai bóng cách nhau bằng dấu phẩy.
