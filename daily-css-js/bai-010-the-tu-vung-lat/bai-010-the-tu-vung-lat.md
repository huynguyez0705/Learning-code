# Bài 010: Thẻ từ vựng lật 3D và phím Space bấm hai lần

Ngày học 4, bài thêm 4/3, cấp 1, chủ đề CSS: 3D cơ bản, độ khó ★★★★☆, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Tải lại trang thì mọi thẻ về mặt trước và chưa thẻ nào được đánh dấu "Đã thuộc". Đây là hành vi đúng của bài.

## Mục tiêu

- Bấm "Lật thẻ" thì thẻ xoay 180° quanh trục dọc, mặt trước chìm đi, mặt sau hiện nghĩa tiếng Việt. Chữ mặt sau đọc xuôi, không bị ngược như soi gương.
- Nút "← Trước" và "Sau →" chuyển thẻ theo vòng tròn: đứng ở thẻ 5 bấm "Sau" về thẻ 1, đứng ở thẻ 1 bấm "Trước" về thẻ 5. Chuyển thẻ thì thẻ mới luôn hiện mặt trước.
- Dòng "Thẻ x/5" và "Đã thuộc y/5 từ" luôn đúng. Đánh dấu đủ 5 thẻ thì hiện "Bạn đã thuộc hết bộ thẻ!".
- Phím tắt: Space hoặc Enter lật thẻ, `←` và `→` chuyển thẻ. Đang focus ở nút "Lật thẻ" mà nhấn Space thì thẻ lật đúng **một** lần.
- Tự thêm CSS 3D cho 2 thẻ cuối và tự gặp cái bẫy thiếu `transform-3d`.

## Kết quả mong đợi

Trang "Thẻ từ vựng tiếng Anh" hiện một thẻ trắng ghi "Serendipity". Bấm "Lật thẻ": thẻ xoay nửa giây rồi hiện mặt xanh "Sự tình cờ may mắn" kèm câu ví dụ, nút "Lật thẻ" đổi sang nền xanh. Bấm "Đã thuộc": góc thẻ hiện nhãn xanh lá "Đã thuộc", dòng trên cùng thành "Đã thuộc 1/5 từ". Cả 5 thẻ lật giống hệt nhau.

## Tư duy

**Một thẻ là hai tấm bìa dán lưng vào nhau.** Mặt trước nằm yên. Mặt sau được xoay sẵn 180°, nên lúc đầu nó quay lưng về phía bạn. Khi xoay cả khối thêm 180°, mặt sau quay về phía bạn còn mặt trước quay đi. Muốn tấm nào quay lưng thì biến mất, ta dùng `backface-hidden`: mặt sau của một tấm bìa trở nên vô hình.

**Phối cảnh làm cú xoay trông có chiều sâu.** `perspective-midrange` đặt trên thẻ cha giống như đặt mắt người xem cách thẻ 800px. Không có nó, phần thẻ quay ra xa vẫn to bằng phần quay lại gần, cú xoay trông như thẻ bị bóp dẹt.

**Bẫy CSS: thiếu `transform-3d` thì mọi con bị ép phẳng.** Mặc định trình duyệt vẽ các phần tử con lên mặt phẳng của cha, giống in hai tấm bìa thành một tờ giấy. Xoay tờ giấy 180° thì bạn thấy mặt trước bị ngược như soi gương, còn mặt sau không bao giờ hiện. `transform-3d` (`transform-style: preserve-3d`) bảo trình duyệt giữ các con trong không gian 3D, mỗi tấm bìa tự xoay theo góc của nó.

**Bẫy JS: Space trên nút được tính hai lần.** Bạn gắn `keydown` lên cả trang để nhấn Space là lật thẻ. Nhưng khi focus đang ở một `<button>`, trình duyệt cũng tự biến Space thành một cú `click` lên nút đó. Nếu focus ở nút "Lật thẻ", thẻ lật hai lần liền nhau và quay về chỗ cũ, trông như không có gì xảy ra. Cách sửa: trong `keydown`, nếu phím là Space hoặc Enter và `event.target` nằm trong một nút thì `return`, để cú `click` tự làm việc.

**Một danh sách, một thẻ đang hiện.** Cả 5 thẻ có sẵn trong HTML. Thẻ đang hiện có `data-active`. JS không tạo hay xoá thẻ; nó chỉ chuyển `data-active` sang thẻ khác và bật tắt `data-flipped`, `data-known`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Ẩn mọi thẻ, chỉ hiện thẻ có `data-active` (`hidden data-active:block`) | Chuyển `data-active` sang thẻ trước hoặc sau |
| Xoay khối thẻ khi thẻ có `data-flipped` (`group-data-flipped:rotate-y-180`) | Bật tắt `data-flipped` trên thẻ đang hiện |
| Phối cảnh, `transform-3d`, `backface-hidden`, mặt sau xoay sẵn | Không làm gì: 3D là việc của CSS |
| Hiện nhãn "Đã thuộc" khi thẻ có `data-known` (`group-data-known:block`) | Bật tắt `data-known`, đếm số thẻ đã thuộc |
| Đổi màu nút theo `aria-pressed:` | Ghi `aria-pressed` là `"true"` hoặc `"false"` |

JS không đặt `style.transform`, không thêm hoặc gỡ class, không tìm phần tử bằng class.

## Ôn lại

- Bài 002 (`bai-002-menu-ba-cham`): `group` và `group-data-*:` để thẻ con đọc trạng thái của thẻ cha.
- Bài 004 (`bai-004-bang-diem-cot-dinh`): `aria-pressed` và variant `aria-pressed:`.
- Bài 006 (`bai-006-gio-hang`): `Array.from`, `filter`, `.length`, `toggleAttribute(name, force)`.
- Bài 007 (`bai-007-the-thoi-tiet`): `Array.find`, `keydown` và `event.key`. Bài này dùng `findIndex`, họ hàng của `find`.
- Bài 008 (`bai-008-ke-dia-nhac`): toán tử ba ngôi `điều kiện ? a : b`.

## Gợi ý từng bước

> Starter đã điền sẵn: màu, chữ, khoảng cách, `flex`, nút và viền focus, `aria-pressed:` cho hai nút lớn, `hidden data-active:block` để chỉ hiện một thẻ, `group-data-known:block` cho nhãn "Đã thuộc", `transition-transform duration-500` cho khối thẻ. **Ba thẻ đầu** (Serendipity, Resilient, Meticulous) đã có đủ class 3D. **Hai thẻ cuối** (Procrastinate, Ubiquitous) chưa có class 3D nào: bạn chép theo ba thẻ đầu ở bước 4.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-deck` (danh sách thẻ), `data-card` (một thẻ), `data-active` (thẻ đang hiện, lúc đầu là thẻ 1), `data-progress`, `data-position`, `data-status`, `data-prev`, `data-next`, `data-flip`, `data-known-toggle`. Mỗi thẻ có hai tầng `<div>`: tầng ngoài là khối sẽ xoay, bên trong là mặt trước và mặt sau. Kiểm tra: mở trang thấy thẻ "Serendipity"; mở DevTools, gỡ `data-active` khỏi thẻ 1 và gắn cho thẻ 2 thì thẻ "Resilient" hiện ra.

2. **JS: tìm thẻ đang hiện và vẽ các dòng chữ.** **Bạn làm:** toàn bộ JS. Lấy mảng thẻ bằng `Array.from(deck.querySelectorAll('[data-card]'))`. Viết hàm nhận một thẻ, trả `true` nếu thẻ có `data-active`, dùng `card.hasAttribute('data-active')`. Tìm vị trí thẻ đang hiện bằng `cards.findIndex(hàm)`: giống `find`, nhưng trả **vị trí** (0, 1, 2...) thay vì phần tử, và trả `-1` nếu không thấy. Viết hàm `render()` ghi "Thẻ x/5" (x là vị trí + 1) và "Đã thuộc y/5 từ" (đếm thẻ có `data-known` bằng `filter`). Gọi `render()` cuối file. Kiểm tra: tải trang thấy "Thẻ 1/5" và "Đã thuộc 0/5 từ".

3. **JS: chuyển thẻ theo vòng tròn.** **Bạn làm:** toàn bộ JS. Viết `showCard(index)`. Vị trí có thể ra `-1` hoặc `5`, nên đưa về khoảng 0–4 bằng `(index + cards.length) % cards.length`. Toán tử `%` trả phần dư của phép chia: `5 % 5` là `0`, `(-1 + 5) % 5` là `4`. Duyệt thẻ bằng `cards.forEach(function (card, cardIndex) { ... })`: `forEach` truyền thêm vị trí làm tham số thứ hai. Trong đó dùng `card.toggleAttribute('data-active', cardIndex === next)` và `card.removeAttribute('data-flipped')`, rồi gọi `render()`. Gắn `click` cho `[data-prev]` và `[data-next]`. Kiểm tra: bấm "Sau" 5 lần quay về "Thẻ 1/5"; ở thẻ 1 bấm "Trước" ra "Thẻ 5/5".

4. **JS lật thẻ, CSS 3D cho 2 thẻ cuối, và cái bẫy.** **Bạn làm:** JS lật thẻ, và trên **2 thẻ `<li>` cuối**: `<li data-card>` thêm `perspective-midrange`; `<div>` khối xoay (con trực tiếp của `<li>`) thêm `group-data-flipped:rotate-y-180` rồi sau đó `transform-3d`; `<div>` mặt trước thêm `backface-hidden`; `<div>` mặt sau thêm `rotate-y-180 backface-hidden`. JS: viết `flipCard()` gọi `toggleAttribute('data-flipped')` trên thẻ đang hiện rồi `render()`; trong `render()` ghi `aria-pressed` của nút "Lật thẻ" bằng `setAttribute('aria-pressed', String(...))`. Gắn `click` cho `[data-flip]`. Kiểm tra thẻ 1: lật mượt, mặt sau đọc xuôi. Với thẻ 4, làm **theo đúng thứ tự** để gặp bẫy: thêm mọi class trên **trừ** `transform-3d`, lật thử. Bạn sẽ thấy chữ "Procrastinate" bị ngược như soi gương và mặt sau không hiện. Thêm `transform-3d` vào khối xoay: thẻ lật đúng. Làm tiếp thẻ 5.

5. **JS: đánh dấu đã thuộc.** **Bạn làm:** toàn bộ JS. Viết `toggleKnown()` bật tắt `data-known` trên thẻ đang hiện rồi `render()`. Trong `render()`, ghi `aria-pressed` cho nút "Đã thuộc". Dùng `cards.every(hàm)` để biết **mọi** thẻ đã thuộc chưa: `every` trả `true` khi hàm trả `true` với tất cả phần tử, gặp một phần tử `false` là dừng và trả `false`. Ghi câu chúc mừng vào `[data-status]` bằng toán tử ba ngôi, ngược lại ghi chuỗi rỗng. Kiểm tra: đánh dấu thẻ 1 thấy nhãn xanh lá ở góc, "Đã thuộc 1/5 từ"; đánh dấu đủ 5 thẻ thấy câu chúc mừng; bỏ một thẻ thì câu đó biến mất.

6. **JS: phím tắt và cái bẫy Space.** **Bạn làm:** toàn bộ JS. Gắn **một** `keydown` lên `document`. `event.key` là `'ArrowRight'`, `'ArrowLeft'`, `' '` (một dấu cách, tức phím Space) hoặc `'Enter'`. Mũi tên thì chuyển thẻ. Space hoặc Enter thì gọi `event.preventDefault()` (chặn trang cuộn xuống khi nhấn Space) rồi lật thẻ. Bấm chuột vào "Lật thẻ" để focus nút đó, nhấn Space: thẻ lật hai lần và đứng yên. Sửa bằng cách thêm trước `preventDefault()` một dòng: nếu `event.target.closest('button')` có giá trị thì `return`. Kiểm tra lại: focus ở "Lật thẻ" nhấn Space lật đúng một lần; bấm ra vùng trống rồi nhấn Space vẫn lật được.

7. **Hoàn thiện.** **Bạn làm:** không có class mới. Thử cả 5 thẻ bằng chuột và bàn phím, rồi chạy phần Tự kiểm tra.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `perspective-midrange` | `perspective: 800px` |
| `transform-3d` | `transform-style: preserve-3d` |
| `backface-hidden` | `backface-visibility: hidden` |
| `rotate-y-180` | `transform: rotateY(180deg)` |
| `group-data-flipped:rotate-y-180` | `.group[data-flipped] .x { transform: rotateY(180deg) }` |
| `transition-transform duration-500` | `transition: transform 500ms` |
| `hidden data-active:block` | `display: none`, và `[data-active] { display: block }` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Lật cả 5 thẻ: mặt sau đọc xuôi, mặt trước không lộ ra phía sau.
- [ ] Ở thẻ 5 bấm "Sau" về thẻ 1; ở thẻ 1 bấm "Trước" về thẻ 5; thẻ mới luôn hiện mặt trước.
- [ ] Đánh dấu đủ 5 thẻ thì hiện câu chúc mừng; bỏ một thẻ thì câu đó mất.
- [ ] DevTools: gỡ `transform-3d` khỏi khối xoay của thẻ 1 rồi lật, thấy chữ bị ngược như soi gương. Gỡ `perspective-midrange` khỏi `<li>`: cú xoay trông dẹt, không còn chiều sâu.
- [ ] DevTools: gỡ `backface-hidden` khỏi mặt trước, lật thẻ, thấy chữ mặt trước ngược đè lên mặt sau.
- [ ] Bàn phím: Tab tới "Lật thẻ", nhấn Space lật đúng một lần; `←`/`→` chuyển thẻ ở bất kỳ đâu trên trang; nhấn Space ở vùng trống không làm trang cuộn.
- [ ] Bật `prefers-reduced-motion: reduce` trong DevTools: thẻ đổi mặt tức thì, không xoay.
- [ ] Tự hỏi: vì sao mặt sau phải xoay sẵn 180°? Vì sao lật thẻ chỉ cần một thuộc tính `data-flipped` mà không cần JS tính góc? Vì sao kiểm tra `closest('button')` chỉ đặt trong nhánh Space/Enter, còn nhánh mũi tên thì không cần?

## Thử thách thêm

1. Thêm nút "Xáo trộn": đổi thứ tự thẻ trong danh sách bằng `append` theo một mảng đã xáo, rồi hiện lại thẻ đầu tiên. Gợi ý: `Math.random`, `sort`, `deck.append(...)`. Không cần class mới.
2. Thêm nút "Chỉ ôn thẻ chưa thuộc": khi bật, "Sau" và "Trước" bỏ qua các thẻ có `data-known`. Gợi ý: `aria-pressed` cho nút, vòng lặp tìm vị trí kế tiếp, class `aria-pressed:bg-sky-700 aria-pressed:text-white`.

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
		<title>Bài 010 - Thẻ từ vựng lật</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<h1 class="title">Thẻ từ vựng tiếng Anh</h1>
			<p data-progress aria-live="polite" class="progress"></p>
			<ul data-deck class="deck">
				<li data-card data-active class="card">
					<div class="card-inner">
						<div class="face face-front">
							<div>
								<p class="label">Từ tiếng Anh</p>
								<h2 class="word">Serendipity</h2>
							</div>
							<span class="badge">Đã thuộc</span>
						</div>
						<div class="face face-back">
							<div>
								<p class="back-label">Nghĩa</p>
								<p class="meaning">Sự tình cờ may mắn</p>
								<p class="example">“Finding this café was pure serendipity.”</p>
							</div>
						</div>
					</div>
				</li>
				<li data-card class="card">
					<div class="card-inner">
						<div class="face face-front">
							<div>
								<p class="label">Từ tiếng Anh</p>
								<h2 class="word">Resilient</h2>
							</div>
							<span class="badge">Đã thuộc</span>
						</div>
						<div class="face face-back">
							<div>
								<p class="back-label">Nghĩa</p>
								<p class="meaning">Kiên cường, mau hồi phục</p>
								<p class="example">“Children are often more resilient than adults.”</p>
							</div>
						</div>
					</div>
				</li>
				<li data-card class="card">
					<div class="card-inner">
						<div class="face face-front">
							<div>
								<p class="label">Từ tiếng Anh</p>
								<h2 class="word">Meticulous</h2>
							</div>
							<span class="badge">Đã thuộc</span>
						</div>
						<div class="face face-back">
							<div>
								<p class="back-label">Nghĩa</p>
								<p class="meaning">Tỉ mỉ, kỹ lưỡng</p>
								<p class="example">“She keeps meticulous notes in every class.”</p>
							</div>
						</div>
					</div>
				</li>
				<li data-card class="card">
					<div class="card-inner">
						<div class="face face-front">
							<div>
								<p class="label">Từ tiếng Anh</p>
								<h2 class="word">Procrastinate</h2>
							</div>
							<span class="badge">Đã thuộc</span>
						</div>
						<div class="face face-back">
							<div>
								<p class="back-label">Nghĩa</p>
								<p class="meaning">Trì hoãn, chần chừ</p>
								<p class="example">“Stop procrastinating and start the exercise.”</p>
							</div>
						</div>
					</div>
				</li>
				<li data-card class="card">
					<div class="card-inner">
						<div class="face face-front">
							<div>
								<p class="label">Từ tiếng Anh</p>
								<h2 class="word">Ubiquitous</h2>
							</div>
							<span class="badge">Đã thuộc</span>
						</div>
						<div class="face face-back">
							<div>
								<p class="back-label">Nghĩa</p>
								<p class="meaning">Có mặt ở khắp nơi</p>
								<p class="example">“Smartphones are ubiquitous today.”</p>
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div class="controls">
				<button data-prev type="button" aria-label="Thẻ trước" class="nav-button">← Trước</button>
				<p data-position aria-live="polite" class="position"></p>
				<button data-next type="button" aria-label="Thẻ sau" class="nav-button">Sau →</button>
			</div>
			<div class="actions">
				<button data-flip type="button" aria-pressed="false" class="action-button">Lật thẻ</button>
				<button data-known-toggle type="button" aria-pressed="false" class="action-button">Đã thuộc</button>
			</div>
			<p data-status aria-live="polite" class="status"></p>
			<p class="hint">Phím tắt: Space hoặc Enter để lật thẻ, ← và → để chuyển thẻ.</p>
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
	background: #f0f9ff;
	color: #082f49;
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

.progress {
	margin-top: 4px;
	font-size: 14px;
	line-height: 20px;
	color: #075985;
	font-variant-numeric: tabular-nums;
}

.deck {
	margin-top: 24px;
}

.card {
	display: none;
	perspective: 800px;
}

.card[data-active] {
	display: block;
}

.card-inner {
	position: relative;
	height: 224px;
	transform-style: preserve-3d;
	transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card[data-flipped] .card-inner {
	transform: rotateY(180deg);
}

.face {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	border-radius: 16px;
	text-align: center;
	backface-visibility: hidden;
}

.face-front {
	border: 1px solid #bae6fd;
	background: #fff;
	box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.face-back {
	background: #0369a1;
	color: #fff;
	transform: rotateY(180deg);
}

.label {
	font-size: 14px;
	line-height: 20px;
	color: #0369a1;
}

.word {
	margin-top: 8px;
	font-size: 30px;
	line-height: 36px;
	font-weight: 700;
}

.badge {
	position: absolute;
	top: 12px;
	right: 12px;
	display: none;
	padding: 4px 8px;
	border-radius: 9999px;
	background: #d1fae5;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	color: #065f46;
}

.card[data-known] .badge {
	display: block;
}

.back-label,
.example {
	font-size: 14px;
	line-height: 20px;
	color: #e0f2fe;
}

.meaning {
	margin-top: 8px;
	font-size: 20px;
	line-height: 28px;
	font-weight: 600;
}

.example {
	margin-top: 12px;
}

.controls {
	margin-top: 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.nav-button,
.action-button {
	border: 1px solid #7dd3fc;
	border-radius: 8px;
	background: #fff;
	color: #075985;
	transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
}

.nav-button {
	padding: 6px 12px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
}

.nav-button:hover,
.action-button:hover {
	background: #e0f2fe;
}

.position {
	font-size: 14px;
	line-height: 20px;
	color: #075985;
	font-variant-numeric: tabular-nums;
}

.actions {
	margin-top: 12px;
	display: flex;
	gap: 12px;
}

.action-button {
	width: 100%;
	padding: 8px 16px;
	font-weight: 600;
}

.action-button[aria-pressed="true"] {
	border-color: #0369a1;
	background: #0369a1;
	color: #fff;
}

.action-button[aria-pressed="true"]:hover {
	background: #075985;
}

.nav-button:focus-visible,
.action-button:focus-visible {
	outline: 2px solid #0369a1;
	outline-offset: 2px;
}

.status {
	margin-top: 12px;
	min-height: 20px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	color: #047857;
}

.hint {
	margin-top: 24px;
	font-size: 14px;
	line-height: 20px;
	color: #0369a1;
}

@media (prefers-reduced-motion: reduce) {
	.card-inner,
	.nav-button,
	.action-button {
		transition: none;
	}
}
```

`solution/script.js`

```js
const deck = document.querySelector('[data-deck]');
const cards = Array.from(deck.querySelectorAll('[data-card]'));
const position = document.querySelector('[data-position]');
const progress = document.querySelector('[data-progress]');
const status = document.querySelector('[data-status]');
const flipButton = document.querySelector('[data-flip]');
const knownButton = document.querySelector('[data-known-toggle]');
const prevButton = document.querySelector('[data-prev]');
const nextButton = document.querySelector('[data-next]');

function isActive(card) {
	return card.hasAttribute('data-active');
}

function isKnown(card) {
	return card.hasAttribute('data-known');
}

function getActiveIndex() {
	return cards.findIndex(isActive);
}

function getActiveCard() {
	return cards[getActiveIndex()];
}

function render() {
	const card = getActiveCard();
	const knownCount = cards.filter(isKnown).length;
	position.textContent = `Thẻ ${getActiveIndex() + 1}/${cards.length}`;
	progress.textContent = `Đã thuộc ${knownCount}/${cards.length} từ`;
	flipButton.setAttribute('aria-pressed', String(card.hasAttribute('data-flipped')));
	knownButton.setAttribute('aria-pressed', String(isKnown(card)));
	status.textContent = cards.every(isKnown) ? 'Bạn đã thuộc hết bộ thẻ!' : '';
}

function showCard(index) {
	const next = (index + cards.length) % cards.length;
	cards.forEach(function (card, cardIndex) {
		card.toggleAttribute('data-active', cardIndex === next);
		card.removeAttribute('data-flipped');
	});
	render();
}

function flipCard() {
	getActiveCard().toggleAttribute('data-flipped');
	render();
}

function toggleKnown() {
	getActiveCard().toggleAttribute('data-known');
	render();
}

function showPrevious() {
	showCard(getActiveIndex() - 1);
}

function showNext() {
	showCard(getActiveIndex() + 1);
}

function handleKeydown(event) {
	if (event.key === 'ArrowRight') {
		showNext();
	} else if (event.key === 'ArrowLeft') {
		showPrevious();
	} else if (event.key === ' ' || event.key === 'Enter') {
		if (event.target.closest('button')) {
			return;
		}
		event.preventDefault();
		flipCard();
	}
}

flipButton.addEventListener('click', flipCard);
knownButton.addEventListener('click', toggleKnown);
prevButton.addEventListener('click', showPrevious);
nextButton.addEventListener('click', showNext);
document.addEventListener('keydown', handleKeydown);

render();
```

</details>

### Giải thích từng hàm

- `Array.from(nodeList)`: đổi `NodeList` thành mảng thật để dùng `findIndex`, `filter`, `every`.
- `card.hasAttribute('data-active')`: trả `true` nếu thẻ có thuộc tính đó, `false` nếu không. Thuộc tính không cần giá trị.
- `isActive(card)`, `isKnown(card)`: hàm tự đặt, trả `true`/`false` cho một thẻ. Được truyền tên (không có `()`) vào `findIndex`, `filter`, `every` để các hàm đó tự gọi với từng thẻ.
- `cards.findIndex(isActive)`: chạy `isActive` lần lượt với từng thẻ, trả **vị trí** của thẻ đầu tiên làm hàm trả `true`. Không thẻ nào khớp thì trả `-1`. Khác `find` ở chỗ `find` trả chính phần tử.
- `getActiveIndex()`, `getActiveCard()`: hàm tự đặt. Cái đầu trả vị trí thẻ đang hiện; cái sau dùng vị trí đó lấy chính thẻ: `cards[vị trí]`.
- `cards.filter(isKnown).length`: `filter` trả mảng mới gồm các thẻ đã thuộc; `.length` đếm số phần tử.
- `cards.every(isKnown)`: trả `true` nếu `isKnown` trả `true` với **mọi** thẻ. Gặp thẻ đầu tiên trả `false` thì dừng ngay và trả `false`.
- `` `Thẻ ${getActiveIndex() + 1}/${cards.length}` ``: chuỗi mẫu dùng dấu huyền; `${...}` chèn giá trị biểu thức. Cộng 1 vì vị trí đếm từ 0.
- `element.setAttribute('aria-pressed', String(...))`: ghi giá trị cho thuộc tính. `aria-pressed` cần chuỗi `"true"` hoặc `"false"`, nên dùng `String(true)` ra `"true"`.
- `điều kiện ? a : b`: toán tử ba ngôi; điều kiện đúng thì trả `a`, sai thì trả `b`.
- `render()`: hàm tự đặt, vẽ "Thẻ x/5", "Đã thuộc y/5 từ", `aria-pressed` của hai nút và câu chúc mừng, đọc mọi thứ từ thuộc tính `data-*`.
- `(index + cards.length) % cards.length`: `%` trả phần dư của phép chia. Cộng thêm `cards.length` trước để số âm như `-1` thành `4` chứ không phải `-1`; `%` đưa `5` về `0`. Nhờ vậy chuyển thẻ quay vòng.
- `cards.forEach(function (card, cardIndex) { ... })`: `forEach` gọi hàm với từng phần tử, và truyền **vị trí** làm tham số thứ hai. Các bài trước chỉ dùng tham số thứ nhất.
- `card.toggleAttribute('data-active', cardIndex === next)`: có tham số thứ hai thì `true` luôn thêm, `false` luôn gỡ. Chỉ thẻ ở vị trí `next` còn `data-active`.
- `card.removeAttribute('data-flipped')`: gỡ thuộc tính, để thẻ nào vừa chuyển tới cũng hiện mặt trước.
- `showCard(index)`, `showPrevious()`, `showNext()`: hàm tự đặt. `showCard` hiện thẻ ở vị trí đã quay vòng; hai hàm kia gọi nó với vị trí trừ 1 hoặc cộng 1.
- `card.toggleAttribute('data-flipped')`: chỉ một tham số nên đảo trạng thái: có thì gỡ, chưa có thì thêm.
- `flipCard()`, `toggleKnown()`: hàm tự đặt, đảo `data-flipped` hoặc `data-known` trên thẻ đang hiện rồi vẽ lại.
- `document.addEventListener('keydown', handleKeydown)`: nghe mọi lần nhấn phím trên trang, dù focus đang ở đâu.
- `event.key`: tên phím vừa nhấn: `'ArrowRight'`, `'ArrowLeft'`, `'Enter'`, và `' '` (một dấu cách) cho Space.
- `||`: "hoặc"; đúng khi ít nhất một vế đúng.
- `event.target.closest('button')`: `event.target` là phần tử đang nhận phím (phần tử đang focus, hoặc `<body>` nếu không focus gì). `closest` trả nút gần nhất chứa nó, hoặc `null`. Có nút thì `return` sớm, để trình duyệt tự biến Space/Enter thành `click` trên nút đó, tránh lật hai lần.
- `event.preventDefault()`: chặn hành vi mặc định của phím. Với Space trên trang là cuộn xuống.
- `handleKeydown(event)`: hàm tự đặt, đọc `event.key` rồi chuyển thẻ hoặc lật thẻ.
- `element.addEventListener('click', flipCard)`: truyền tên hàm không có `()` để trình duyệt gọi khi bấm.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

- `group hidden data-active:block perspective-midrange` trên `<li>` ↔ `.card { display: none; perspective: 800px }` và `.card[data-active] { display: block }`.
- `relative h-56 transition-transform duration-500 transform-3d` ↔ `.card-inner { position: relative; height: 224px; transform-style: preserve-3d; transition: transform 500ms ... }`.
- `group-data-flipped:rotate-y-180` ↔ `.card[data-flipped] .card-inner { transform: rotateY(180deg) }`.
- `absolute inset-0 ... backface-hidden` trên hai mặt ↔ `.face { position: absolute; inset: 0; backface-visibility: hidden }`.
- `rotate-y-180` trên mặt sau ↔ `.face-back { transform: rotateY(180deg) }`.
- `group-data-known:block` trên nhãn ↔ `.card[data-known] .badge { display: block }`.
- `aria-pressed:bg-sky-700 aria-pressed:text-white aria-pressed:border-sky-700` ↔ `.action-button[aria-pressed="true"] { ... }`.
- `motion-reduce:transition-none` ↔ `@media (prefers-reduced-motion: reduce) { .card-inner, ... { transition: none } }`.
