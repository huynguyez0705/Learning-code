# Bài 018: Két sắt mã PIN với cánh cửa 3D và bẫy bản lề

Ngày học 7, bài 2/3, cấp 1, chủ đề CSS: 3D cơ bản (ứng dụng két sắt nhập mã PIN), độ khó ★★★★, thời gian ước tính 40 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Mã PIN mẫu `2468` nằm sẵn trong HTML (`data-secret`) chỉ để luyện tập, **không phải cách bảo mật thật**: ai mở DevTools cũng đọc được. Tải lại trang thì két đóng lại, số lần sai về 0.

## Mục tiêu

- Cánh cửa là một tấm 3D **quay quanh bản lề bên trái** (`origin-left`), mở ra phía người xem khi nhập đúng mã, và khuất mặt sau (`backface-hidden`) để lộ kho vàng bên trong.
- Nhập PIN bằng cả **nút bấm** lẫn **bàn phím máy tính** (phím số, `Backspace`, `Enter`); ô hiển thị luôn có đủ 4 ký tự: `●` cho số đã nhập, `○` cho chỗ còn trống.
- Sai mã báo còn mấy lần thử; **sai 3 lần thì khoá bàn phím 5 giây** rồi tự mở lại.
- Khi cửa mở, các nút trên cửa không còn nhận Tab, và focus chuyển sang nút `Đóng két`; đóng két thì focus quay về nút số `1`.
- Mỗi lần sai không để lại số cũ trong ô nhập.

## Kết quả mong đợi

Một chiếc két xám có viền dày, mặt cửa có ô hiển thị `○○○○` màu lục và bàn phím 3×4. Nhập `2468` rồi bấm dấu `✓`: cánh cửa lật mở trong 1 giây như cửa thật, bản lề ở mép trái, bên trong hiện nền vàng nhạt với dòng "Bên trong két có 3 thỏi vàng." Nút `Đóng két` hiện bên dưới.

## Tư duy

**Cửa mở quanh bản lề, không quanh tâm.** Mặc định mọi phép xoay quay quanh **tâm** phần tử (`transform-origin: center`). Một cánh cửa xoay quanh tâm trông như một tấm bài đang lật, không giống cửa. Muốn có bản lề ở mép trái phải dời điểm quay: `origin-left`. Cùng góc xoay, chỉ đổi điểm quay là ra hai chuyển động hoàn toàn khác. Thử trong DevTools là thấy ngay.

**Ba lớp 3D tối thiểu.** Phần tử cha cần `perspective-*` (đặt "mắt" ở xa bao nhiêu, càng nhỏ càng méo); phần tử con xoay bằng `rotate-y-*`; và mặt sau của con ẩn đi bằng `backface-hidden` để khi cánh cửa quay quá 90° ta thấy kho bên trong chứ không thấy mặt lưng của cửa (bài 010 và 011).

**Bẫy: ẩn bằng mắt không phải ẩn với bàn phím.** Sau khi cửa lật ra, `backface-hidden` chỉ làm các nút **biến mất khỏi mắt**. Chúng vẫn còn trong cây trang: Tab vẫn nhảy vào các nút vô hình, người dùng đọc màn hình vẫn nghe thấy chúng, và focus có thể kẹt lại ở nút `✓` vừa bấm. Cách chữa quen thuộc từ bài 003: thuộc tính `inert` (cả khối không nhận Tab, chuột, hay trình đọc màn hình). Ngược lại kho vàng phía sau cửa phải `inert` **cho tới khi cửa mở**, nếu không chữ bên trong két đã bị đọc ra khi két đang đóng.

**Trạng thái nhập là một chuỗi.** Biến `pin` là một chuỗi `'24'`, `'246'`... Thêm số là `pin += key` (nối chuỗi), xoá số cuối là `pin.slice(0, -1)`. Ô hiển thị luôn **vẽ lại từ `pin`**, không sửa từng chữ: `'●'.repeat(pin.length).padEnd(4, '○')`. Viết một hàm `renderDisplay()` duy nhất rồi gọi mỗi khi `pin` đổi.

**Bẫy JS: Enter bị tính hai lần.** Khi bạn lắng nghe phím `Enter` trên toàn trang mà focus đang ở nút `✓`, trình duyệt gọi `click` của nút **và** `keydown` của trang: hàm kiểm tra mã chạy hai lần. Cách tránh: bỏ qua `Enter` khi sự kiện đến từ một nút (`event.target.closest('button')`). Giống bẫy phím `Space` ở bài 010.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Phối cảnh (`perspective-midrange`), bản lề (`origin-left`), góc mở (`data-open:-rotate-y-110`), ẩn mặt sau (`backface-hidden`) | Bật `data-open` ở cánh cửa khi mã đúng |
| Chuyển động mở cửa 1 giây (`transition-transform duration-1000`), tắt khi `motion-reduce:` | Giữ chuỗi `pin`, vẽ lại ô hiển thị |
| Bàn phím mờ khi khoá (`disabled:opacity-40`) | Khoá/mở cả bàn phím bằng `fieldset.disabled` |
| Chữ cách đều (`tracking-widest`) | `inert` cho cửa/kho, `hidden` cho nút đóng, trả focus |

JS không thêm hoặc gỡ class, không đặt `style.transform`, không tự tính góc xoay. JS chỉ tìm phần tử bằng `data-*`.

## Ôn lại

- Bài 010 (`bai-010-the-tu-vung-lat`): `perspective-*`, `backface-hidden`, bẫy phím `Space` bị tính hai lần, `keydown` trên `document`.
- Bài 011 (`bai-011-xem-can-ho-3d`): `rotate-y-*`, nhóm 3D lồng nhau.
- Bài 003 (`bai-003-hop-thoai-xac-nhan`): `inert`, trả focus.
- Bài 009 (`bai-009-quiz-kinh-mo`): `fieldset.disabled` khoá cả nhóm nút.
- Bài 008, 013, 016: `setTimeout` hẹn giờ, `closest` uỷ quyền, `dataset`.
- Bài 017 (`bai-017-dong-ho-bam-gio-kinh-mo`): `font-mono`.

## Gợi ý từng bước

> Starter đã điền sẵn: nền tối, tiêu đề, khung két (`relative h-96 w-72 border-8 border-slate-500 bg-slate-800 perspective-midrange`), kho vàng (`absolute inset-0 grid place-items-center bg-amber-100`), cánh cửa (`absolute inset-0 bg-linear-to-br from-slate-600 to-slate-800 backface-hidden transition-transform duration-1000 motion-reduce:transition-none data-open:-rotate-y-110`), ô hiển thị (`font-mono text-3xl text-emerald-300`), mười hai nút bàn phím (nền, `hover:`, viền focus, `disabled:opacity-40`) và nút `Đóng két`. **Chưa có**: `origin-left` ở cánh cửa và `tracking-widest` ở ô hiển thị.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-safe` (kèm `data-secret="2468"`), `data-vault` (đã có `inert`), `data-door`, `data-display` (kèm `tabindex="-1"` để JS đưa focus vào được), `data-keypad` (thẻ `<fieldset>` có `<legend class="sr-only">`), mười hai nút `data-key="1"` ... `"9"`, `"back"`, `"0"`, `"enter"`, `data-message` (có `role="status"`), `data-close` (đang `hidden`). Kiểm tra: thấy két với cửa phẳng, ô hiển thị `○○○○`, chưa thấy nút `Đóng két` và kho vàng.

2. **CSS: bản lề, và cái bẫy.** **Bạn làm:** trên `<div data-door>` thêm `origin-left`. Làm **theo đúng thứ tự** để gặp bẫy: trước khi thêm, mở DevTools, gõ vào phần tử `<div data-door>` một thuộc tính `data-open` (nhấn `A` trong bảng Elements). Cửa lật quanh **tâm** như một tấm bài: nửa phải nhô ra phía bạn, nửa trái thụt vào trong, nhìn không giống cửa. Bỏ `data-open`, thêm `origin-left` rồi gõ lại `data-open`: cửa quay quanh mép trái, mở ra phía người xem. `origin-left` đặt `transform-origin` ở giữa mép trái. Kiểm tra: cửa mở có bản lề cố định bên trái, hết 1 giây thấy kho vàng; góc quay `-110°` (âm) nghĩa là mép phải đi về phía người xem. Bật `prefers-reduced-motion` thì cửa mở tức thì.

3. **CSS: chữ ô hiển thị cách đều.** **Bạn làm:** trên `<p data-display>` thêm `tracking-widest`. `tracking-widest` tăng khoảng cách giữa các chữ (`letter-spacing: 0.1em`) để bốn ký tự `●` tách rõ. Kiểm tra: `○○○○` thưa hơn, dễ đếm bốn ký tự.

4. **JS: ô hiển thị và nút số.** **Bạn làm:** toàn bộ JS. Lấy `safe`, `vault`, `door`, `display`, `keypad`, `message`, `closeButton` bằng `querySelector` theo `data-*`. Khai báo `const secret = safe.dataset.secret`, `const maxTries = 3`, `const lockSeconds = 5`, `let pin = ''`, `let tries = 0`. Viết `renderDisplay()`: `display.textContent = '●'.repeat(pin.length).padEnd(secret.length, '○')`. **`repeat(n)`** lặp chuỗi `n` lần (`'●'.repeat(2)` ra `'●●'`); **`padEnd(độ dài, ký tự)`** thêm ký tự vào **cuối** chuỗi cho đủ độ dài (ngược `padStart` ở bài 017). Viết `pressKey(key)`: nếu `key === 'back'` thì `pin = pin.slice(0, -1)`; ngược lại nếu `pin.length < secret.length` thì `pin += key`. `slice(0, -1)` lấy từ đầu tới **trước** ký tự cuối: chỉ số âm đếm từ cuối chuỗi. Sau đó `renderDisplay()`. Gắn **một** `click` ở `keypad`: `closest('[data-key]')`, `null` thì `return`; không thì `pressKey(button.dataset.key)`. Gọi `renderDisplay()` cuối file. Kiểm tra: bấm `2`, `4` thì ô thành `●●○○`; `⌫` xoá từng số; bấm quá 4 số thì không thêm; chưa làm xong `enter` nên bấm `✓` chưa có gì xảy ra.

5. **JS: gõ bằng bàn phím máy tính, và bẫy Enter.** **Bạn làm:** toàn bộ JS. Gắn `keydown` ở `document`. Với phím số dùng **biểu thức chính quy**: `/^[0-9]$/.test(event.key)` (`/.../` là mẫu so khớp; `^` đầu chuỗi, `[0-9]` một chữ số, `$` cuối chuỗi; `.test(chuỗi)` trả `true` nếu khớp; `event.key` là tên phím như `'5'`, `'Backspace'`, `'Enter'`) thì `pressKey(event.key)`. Nếu `event.key === 'Backspace'` thì `pressKey('back')`. Làm tạm `Enter` **có bẫy**: `else if (event.key === 'Enter')` gọi `pressKey('enter')`. Sau bước 6, dùng Tab tới nút `✓` rồi nhấn Enter, bạn sẽ thấy hàm kiểm tra chạy **hai lần** (một lần do `click`, một lần do `keydown`). Sửa: thêm điều kiện `&& !event.target.closest('button')` (`event.target` là phần tử đang giữ focus khi bấm phím). Kiểm tra: gõ `2468` trên bàn phím thì ô đầy; `Backspace` xoá từng số; chưa làm bước 6 nên `Enter` chưa có tác dụng.

6. **JS: kiểm tra mã và mở cửa.** **Bạn làm:** toàn bộ JS. Viết `setOpen(open)`: nếu `open` thì `closeButton.hidden = false` **rồi mới** `closeButton.focus()` (phần tử đang `hidden` không nhận focus, nên đảo thứ tự là `focus()` thất bại); ngược lại `closeButton.hidden = true`. Rồi `door.toggleAttribute('data-open', open)`. Viết `submitPin()`: nếu `pin.length < secret.length` thì ghi `message.textContent` báo "Cần nhập đủ 4 chữ số." rồi `return`; nếu `pin === secret` thì `message.textContent = 'Mã đúng. Cửa két đã mở.'`, `setOpen(true)`, `return`; còn lại là sai: `tries += 1`, `pin = ''`, `renderDisplay()`, rồi ghi `Sai mã. Còn ${maxTries - tries} lần thử.`. Trong `pressKey` thêm nhánh đầu: nếu `key === 'enter'` thì `submitPin()` và `return`. **Thử bẫy:** nhập đúng `2468` rồi nhấn Tab liên tục: focus vẫn nhảy vào các nút vô hình trên cánh cửa đã mở, và `data-vault` (đang `inert`) chưa đọc được. Kiểm tra: nhập đúng thì cửa mở, nút `Đóng két` hiện ra và nhận focus; nhập sai thì báo số lần còn lại; thiếu số thì báo thiếu.

7. **JS: sửa bẫy bằng `inert`, và nút đóng két.** **Bạn làm:** toàn bộ JS. Trong `setOpen` thêm `door.toggleAttribute('inert', open)` (cửa mở thì `inert`) và `vault.toggleAttribute('inert', !open)` (kho chỉ nhận tương tác khi cửa mở). Trong `pressKey` thêm điều kiện ở đầu: nếu cửa đang mở (`door.hasAttribute('data-open')`) thì `return`, để phím số không đổi `pin` khi két đã mở. Gắn `click` cho `closeButton`: `pin = ''`, `renderDisplay()`, xoá `message.textContent`, `setOpen(false)`, rồi `keypad.querySelector('[data-key="1"]').focus()` (trả focus về nút `1`; selector có dấu nháy kép bên trong dấu nháy đơn). Kiểm tra: cửa mở rồi, Tab chỉ đi tới nút `Đóng két`, không vào các nút trên cửa; bấm `Đóng két` thì cửa đóng lại và focus nằm ở nút `1`; Enter ở nút `✓` chỉ kiểm tra một lần.

8. **JS: khoá bàn phím sau 3 lần sai.** **Bạn làm:** toàn bộ JS. Viết `lockKeypad()`: `keypad.disabled = true` (`<fieldset disabled>` khoá mọi nút bên trong, bài 009); `display.focus()` (nút đang giữ focus vừa bị khoá nên focus rơi mất, ta đưa nó sang ô hiển thị đã có `tabindex="-1"`); ghi `message.textContent` thông báo khoá `${lockSeconds}` giây; rồi `setTimeout(hàm, lockSeconds * 1000)` với hàm mở lại `keypad.disabled = false`, `tries = 0` và ghi thông báo mở khoá. Trong nhánh sai của `submitPin`: nếu `tries >= maxTries` thì `lockKeypad()`, ngược lại mới báo số lần còn lại. Trong `pressKey` mở rộng điều kiện đầu hàm: `keypad.disabled || door.hasAttribute('data-open')` thì `return` (để bàn phím máy tính cũng bị khoá, vì `fieldset disabled` chỉ chặn nút bấm, không chặn `keydown` của trang). Kiểm tra: sai ba lần liên tiếp thì các nút mờ đi, gõ phím số vô tác dụng, sau 5 giây tự mở; nhập đúng sau khi mở khoá vẫn mở được cửa.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương (gần đúng) |
|---|---|
| `perspective-midrange` | `perspective: 800px` (đặt ở phần tử cha của cánh cửa) |
| `origin-left` | `transform-origin: left` (bản lề ở giữa mép trái) |
| `data-open:-rotate-y-110` | `.door[data-open] { transform: rotateY(-110deg) }` |
| `backface-hidden` | `backface-visibility: hidden` |
| `transition-transform duration-1000` | `transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1)` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |
| `tracking-widest` | `letter-spacing: 0.1em` |
| `border-8 border-slate-500` | `border: 8px solid #64748b` |
| `bg-linear-to-br from-slate-600 to-slate-800` | `background: linear-gradient(to bottom right, #475569, #1e293b)` |
| `disabled:opacity-40` | `.key:disabled { opacity: 0.4 }` |

## Tự kiểm tra

- [ ] Cửa mở quanh mép trái, mở ra phía người xem; mở hết thì cánh cửa biến mất (mặt lưng bị ẩn) và thấy kho vàng.
- [ ] Nhập bằng nút bấm và bằng bàn phím máy tính đều ra đúng; `⌫` và `Backspace` xoá số cuối; không thể nhập quá 4 số.
- [ ] Sai mã: báo "Còn 2 lần thử", rồi "Còn 1 lần thử", rồi khoá; sau 5 giây mở lại và số lần thử bắt đầu lại từ 3.
- [ ] Bàn phím: Tab tới nút `✓` rồi Enter chỉ kiểm tra **một lần** (số lần thử chỉ giảm 1 khi sai). Khi cửa mở, Tab không vào được các nút trên cửa.
- [ ] DevTools: thêm `data-open` bằng tay thì cửa mở; gỡ `origin-left` thì cửa quay quanh tâm; gỡ `inert` khỏi cửa đã mở rồi Tab thì focus chui vào nút vô hình.
- [ ] Bật `prefers-reduced-motion: reduce`: cửa mở tức thì, không trượt.
- [ ] Tự hỏi: vì sao `perspective` đặt ở khung két mà không đặt ở cánh cửa? Vì sao `closeButton.focus()` phải đứng **sau** `hidden = false`? Vì sao `fieldset disabled` không chặn được phím gõ trên bàn phím máy tính?

## Thử thách thêm

1. **Tay nắm lồi ra.** Thêm một chấm tròn làm tay nắm ở mép phải cánh cửa và cho nó nhô ra khỏi cửa bằng `translate-z-4` (cửa cần `transform-3d` để tay nắm nhô ra thật). Gợi ý: mở cửa và nhìn tay nắm khi cửa lật.
2. **Ô nhập báo lỗi.** Mỗi lần sai mã, ghi `data-wrong` vào `<p data-display>` rồi gỡ sau 600 ms bằng `setTimeout` (mỗi lần ghi nhớ mã hẹn giờ và `clearTimeout` trước, như bài 008). Bên Tailwind dùng `data-wrong:text-rose-300 data-wrong:bg-rose-950` kèm `transition-colors motion-reduce:transition-none`. Gợi ý: nhập sai hai lần thật nhanh, hiệu ứng phải kéo dài đủ 600 ms sau lần cuối.

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
		<title>Bài 018 - Két sắt mã PIN</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<h1 class="title">Két sắt mã PIN</h1>
			<p class="hint">Mã mẫu của bài là 2468. Sai 3 lần, bàn phím khoá 5 giây.</p>
			<div data-safe data-secret="2468" class="safe">
				<div data-vault inert class="vault">
					<p class="vault-text">Bên trong két có 3 thỏi vàng.</p>
				</div>
				<div data-door class="door">
					<p data-display tabindex="-1" class="display">○○○○</p>
					<fieldset data-keypad class="keypad">
						<legend class="sr-only">Bàn phím số</legend>
						<button type="button" data-key="1" class="key">1</button>
						<button type="button" data-key="2" class="key">2</button>
						<button type="button" data-key="3" class="key">3</button>
						<button type="button" data-key="4" class="key">4</button>
						<button type="button" data-key="5" class="key">5</button>
						<button type="button" data-key="6" class="key">6</button>
						<button type="button" data-key="7" class="key">7</button>
						<button type="button" data-key="8" class="key">8</button>
						<button type="button" data-key="9" class="key">9</button>
						<button type="button" data-key="back" aria-label="Xoá số cuối" class="key">⌫</button>
						<button type="button" data-key="0" class="key">0</button>
						<button type="button" data-key="enter" aria-label="Mở két" class="key key-enter">✓</button>
					</fieldset>
				</div>
			</div>
			<p data-message role="status" class="message"></p>
			<button type="button" data-close hidden class="close-button">Đóng két</button>
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

[hidden] {
	display: none !important;
}

button {
	font: inherit;
	color: inherit;
	background: none;
	border: 0;
	cursor: pointer;
}

fieldset {
	border: 0;
	min-width: 0;
}

legend {
	padding: 0;
}

h1 {
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
	border-width: 0;
}

.site {
	min-height: 100vh;
	background: #020617;
	color: #ffffff;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	max-width: 448px;
	margin: 0 auto;
	padding: 32px 16px;
}

.title {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 700;
}

.hint {
	font-size: 0.875rem;
	line-height: 1.25rem;
	color: #94a3b8;
}

.safe {
	position: relative;
	width: 288px;
	height: 384px;
	border: 8px solid #64748b;
	border-radius: 16px;
	background: #1e293b;
	perspective: 800px;
}

.vault {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	padding: 16px;
	border-radius: 8px;
	background: #fef3c7;
	color: #78350f;
	text-align: center;
}

.vault-text {
	font-size: 1.125rem;
	line-height: 1.75rem;
	font-weight: 600;
}

.door {
	position: absolute;
	inset: 0;
	padding: 16px;
	border-radius: 8px;
	background: linear-gradient(to bottom right, #475569, #1e293b);
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
	transform-origin: left;
	transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}

.door[data-open] {
	transform: rotateY(-110deg);
}

.display {
	margin-bottom: 12px;
	padding: 12px 0;
	border-radius: 8px;
	background: rgb(0 0 0 / 0.4);
	text-align: center;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 1.875rem;
	line-height: 2.25rem;
	letter-spacing: 0.1em;
	color: #6ee7b7;
}

.display:focus-visible {
	outline: 2px solid #fcd34d;
	outline-offset: 2px;
}

.keypad {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 8px;
}

.key {
	padding: 12px 0;
	border-radius: 8px;
	background: rgb(15 23 42 / 0.6);
	font-size: 1.125rem;
	line-height: 1.75rem;
	font-weight: 600;
}

.key-enter {
	background: #047857;
}

.key:hover {
	background: #0f172a;
}

.key:focus-visible {
	outline: 2px solid #fcd34d;
	outline-offset: 2px;
}

.key:disabled {
	cursor: not-allowed;
	opacity: 0.4;
}

.message {
	min-height: 24px;
	font-size: 0.875rem;
	line-height: 1.25rem;
	color: #fcd34d;
}

.close-button {
	padding: 8px 16px;
	border-radius: 8px;
	background: #f59e0b;
	font-weight: 600;
	color: #0f172a;
}

.close-button:focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
	.door {
		transition: none;
	}
}
```

`solution/script.js`

```js
const safe = document.querySelector('[data-safe]');
const vault = document.querySelector('[data-vault]');
const door = document.querySelector('[data-door]');
const display = document.querySelector('[data-display]');
const keypad = document.querySelector('[data-keypad]');
const message = document.querySelector('[data-message]');
const closeButton = document.querySelector('[data-close]');
const secret = safe.dataset.secret;
const maxTries = 3;
const lockSeconds = 5;
let pin = '';
let tries = 0;

function renderDisplay() {
	display.textContent = '●'.repeat(pin.length).padEnd(secret.length, '○');
}

function setOpen(open) {
	if (open) {
		closeButton.hidden = false;
		closeButton.focus();
	} else {
		closeButton.hidden = true;
	}
	door.toggleAttribute('data-open', open);
	door.toggleAttribute('inert', open);
	vault.toggleAttribute('inert', !open);
}

function lockKeypad() {
	keypad.disabled = true;
	display.focus();
	message.textContent = `Sai ${maxTries} lần. Bàn phím khoá ${lockSeconds} giây.`;
	setTimeout(function () {
		keypad.disabled = false;
		tries = 0;
		message.textContent = 'Bàn phím đã mở khoá. Hãy thử lại.';
	}, lockSeconds * 1000);
}

function submitPin() {
	if (pin.length < secret.length) {
		message.textContent = `Cần nhập đủ ${secret.length} chữ số.`;
		return;
	}
	if (pin === secret) {
		tries = 0;
		message.textContent = 'Mã đúng. Cửa két đã mở.';
		setOpen(true);
		return;
	}
	tries += 1;
	pin = '';
	renderDisplay();
	if (tries >= maxTries) {
		lockKeypad();
	} else {
		message.textContent = `Sai mã. Còn ${maxTries - tries} lần thử.`;
	}
}

function pressKey(key) {
	if (keypad.disabled || door.hasAttribute('data-open')) {
		return;
	}
	if (key === 'enter') {
		submitPin();
		return;
	}
	if (key === 'back') {
		pin = pin.slice(0, -1);
	} else if (pin.length < secret.length) {
		pin += key;
	}
	message.textContent = '';
	renderDisplay();
}

keypad.addEventListener('click', function (event) {
	const button = event.target.closest('[data-key]');
	if (!button) {
		return;
	}
	pressKey(button.dataset.key);
});

document.addEventListener('keydown', function (event) {
	if (/^[0-9]$/.test(event.key)) {
		pressKey(event.key);
	} else if (event.key === 'Backspace') {
		pressKey('back');
	} else if (event.key === 'Enter' && !event.target.closest('button')) {
		pressKey('enter');
	}
});

closeButton.addEventListener('click', function () {
	pin = '';
	renderDisplay();
	message.textContent = '';
	setOpen(false);
	keypad.querySelector('[data-key="1"]').focus();
});

renderDisplay();
```

</details>

### Giải thích từng hàm

- `renderDisplay()`: hàm tự đặt, vẽ lại ô hiển thị từ chuỗi `pin`: `●` cho số đã nhập, `○` cho chỗ trống.
- `setOpen(open)`: hàm tự đặt, mở hoặc đóng két: hiện/ẩn nút `Đóng két`, ghi `data-open` và `inert` cho cửa và kho.
- `lockKeypad()`: hàm tự đặt, khoá bàn phím và hẹn giờ mở lại.
- `submitPin()`: hàm tự đặt, kiểm tra độ dài rồi so `pin` với mã thật; mở cửa, báo sai, hoặc khoá.
- `pressKey(key)`: hàm tự đặt, xử lý một phím (số, `'back'` hoặc `'enter'`) dù đến từ nút bấm hay bàn phím máy tính.
- `safe.dataset.secret`: đọc thuộc tính `data-secret` thành chuỗi `'2468'`.
- `'●'.repeat(pin.length)`: `repeat(n)` trả chuỗi lặp lại `n` lần; `repeat(0)` ra chuỗi rỗng. `.padEnd(secret.length, '○')`: thêm `'○'` vào **cuối** cho tới khi đủ độ dài, trả chuỗi mới.
- `pin.slice(0, -1)`: `slice(bắt đầu, kết thúc)` trả đoạn chuỗi từ vị trí `bắt đầu` tới **trước** `kết thúc`; số âm đếm từ cuối, nên `-1` là bỏ ký tự cuối.
- `pin += key`: nối `key` vào cuối chuỗi `pin` rồi gán lại.
- `closeButton.hidden`: `true` thì ẩn nút; phần tử ẩn không nhận được `focus()`. `closeButton.focus()`: đưa focus bàn phím vào phần tử.
- `element.toggleAttribute(tên, force)`: có `force` đúng thì thêm thuộc tính, sai thì gỡ. `door.hasAttribute('data-open')`: trả `true` nếu phần tử có thuộc tính đó.
- `inert`: thuộc tính HTML làm cả khối không nhận Tab, chuột, và bị trình đọc màn hình bỏ qua.
- `keypad.disabled`: với `<fieldset>`, `true` khoá mọi nút bên trong. `keypad.disabled || door.hasAttribute('data-open')`: `||` đúng khi **một** trong hai vế đúng.
- `setTimeout(hàm, ms)`: hẹn chạy `hàm` sau `ms` mili giây. `lockSeconds * 1000` đổi giây ra mili giây.
- Chuỗi mẫu `` `Sai mã. Còn ${maxTries - tries} lần thử.` ``: dấu huyền; `${...}` chèn kết quả biểu thức vào chuỗi.
- `tries += 1`: tăng `tries` lên 1. `tries >= maxTries`: so sánh lớn hơn hoặc bằng.
- `event.target.closest('[data-key]')`: đi **ngược lên** từ chỗ bấm, trả tổ tiên đầu tiên khớp (kể cả chính nó) hoặc `null`. `if (!button) { return; }`: return sớm khi không bấm vào nút số; `!` đảo đúng sai.
- `button.dataset.key`: đọc `data-key` của nút, luôn là chuỗi.
- `/^[0-9]$/.test(event.key)`: `/.../` là biểu thức chính quy; `^` đầu chuỗi, `[0-9]` đúng một chữ số, `$` cuối chuỗi. `.test(chuỗi)` trả `true` hoặc `false`. `event.key` là tên phím được bấm.
- `!event.target.closest('button')`: `true` khi phím được bấm **không** nằm trong một nút; dùng để bỏ qua `Enter` đã được nút xử lý bằng `click`.
- `document.addEventListener('keydown', hàm)`: lắng nghe mọi lần nhấn phím trên trang. `keypad.querySelector('[data-key="1"]')`: selector thuộc tính có giá trị, trả nút số `1`.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `perspective-midrange` trên khung két | `.safe { perspective: 800px }` |
| `origin-left backface-hidden` trên cửa | `.door { transform-origin: left; backface-visibility: hidden }` |
| `data-open:-rotate-y-110` | `.door[data-open] { transform: rotateY(-110deg) }` |
| `transition-transform duration-1000 motion-reduce:transition-none` | `.door { transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1) }` và `@media (prefers-reduced-motion: reduce) { .door { transition: none } }` |
| `tracking-widest font-mono text-3xl` | `.display { letter-spacing: 0.1em; font-family: ui-monospace, ...; font-size: 1.875rem }` |
| `grid grid-cols-3 gap-2` trên `<fieldset>` | `.keypad { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px }` |
| `sr-only` trên `<legend>` | `.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); ... }` |
| `bg-linear-to-br from-slate-600 to-slate-800` | `.door { background: linear-gradient(to bottom right, #475569, #1e293b) }` |
| `disabled:opacity-40` | `.key:disabled { opacity: 0.4; cursor: not-allowed }` |

Khác biệt nhỏ: Tailwind v4 viết `-rotate-y-110` bằng biến `--tw-rotate-y` gộp vào `transform`; lời giải viết thẳng `rotateY(-110deg)`. Hai cách cho kết quả giống nhau.
