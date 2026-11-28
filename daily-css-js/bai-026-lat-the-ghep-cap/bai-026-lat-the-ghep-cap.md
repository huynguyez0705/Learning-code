# Bài 026: Lật thẻ ghép cặp, xáo bài Fisher–Yates và cập nhật thay vì vẽ lại

Ngày học 10, bài 1/3, cấp 2, chủ đề CSS: 3D cơ bản (ứng dụng trò chơi trí nhớ), độ khó ★★, thời gian ước tính 35 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này chỉ lưu **kỷ lục số lượt** bằng `localStorage` (khoá `bai-026-ky-luc`). Bộ bài đang chơi, số lượt hiện tại và thẻ đang lật **không** được lưu: tải lại trang là xáo bài mới.

## Mục tiêu

- Dựng 12 thẻ (6 cặp biểu tượng) từ một `<template>`, xáo ngẫu nhiên bằng thuật toán Fisher–Yates; mỗi lần "Chơi lại" ra một thứ tự khác.
- Bấm thẻ thì thẻ **lật 3D** (quay quanh trục dọc) từ mặt úp sang mặt biểu tượng, có hiệu ứng nảy nhẹ.
- Lật thẻ thứ hai: nếu giống thì cả hai giữ nguyên và đổi màu xanh; nếu khác thì sau 0,9 giây tự úp lại, trong lúc đó mọi lượt bấm khác bị bỏ qua.
- Đếm số lượt (mỗi lần lật xong một cặp tính 1 lượt); ghép hết 6 cặp thì ghi kỷ lục vào `localStorage` nếu tốt hơn, focus nhảy tới nút "Chơi lại".
- Lật được bằng bàn phím (Tab rồi Enter/Space) và đọc được bằng trình đọc màn hình (`aria-label`, `aria-live`).

## Kết quả mong đợi

Nền xanh biển đậm sang xanh ngọc. Một tiêu đề, dòng trạng thái, dòng "Lượt / Kỷ lục", lưới 4 cột × 3 hàng thẻ vuông. Thẻ úp có nền xanh dương sang chàm với dấu `?`. Bấm vào thì thẻ quay nửa vòng và hiện biểu tượng trái cây trên nền trắng. Cặp khớp có nền xanh lục nhạt và vòng sáng. Dưới lưới là nút "Chơi lại".

## Tư duy

**Một thẻ lật = hai mặt xếp lưng vào nhau.** Thẻ gồm một khối `inner` có hai mặt con: mặt trước (`?`) và mặt sau (biểu tượng). Mặt sau được xoay sẵn `rotateY(180deg)`, tức là đang quay lưng ra. Mỗi mặt có `backface-visibility: hidden` (Tailwind: `backface-hidden`), nghĩa là chỉ hiện khi mặt của nó hướng về người xem. Khi `inner` quay 180°, mặt trước quay đi (ẩn), mặt sau quay ra (hiện). Giống tờ giấy hai mặt cầm trên tay rồi lật.

**3D cần ba thứ phối hợp.** `perspective` ở **thẻ cha** để có chiều sâu; `transform-style: preserve-3d` (Tailwind: `transform-3d`) ở khối `inner` để hai mặt con giữ vị trí 3D thay vì bị ép phẳng; `backface-hidden` ở **từng mặt**. Thiếu `transform-3d` thì cả hai mặt cùng hiện và đè lên nhau.

**Đường cong chuyển động.** `ease-[cubic-bezier(0.34,1.56,0.64,1)]` có giá trị thứ hai lớn hơn 1 nên thẻ "quá đà" một chút rồi quay về đúng 180°. Đây là cách tạo cảm giác nảy mà không cần thư viện.

**Xáo bài đúng cách.** Cách phổ biến `mang.sort(function () { return Math.random() - 0.5; })` **không xáo đều** (một số thứ tự xuất hiện nhiều hơn). Fisher–Yates đi từ cuối về đầu, mỗi vị trí `i` đổi chỗ với một vị trí ngẫu nhiên `j` trong khoảng `0..i`; mọi thứ tự đều có xác suất bằng nhau.

**Cập nhật, không vẽ lại.** Nếu mỗi lần lật mà `replaceChildren` dựng lại cả 12 nút, nút mới sinh ra đã ở trạng thái cuối nên **không có chuyển động** (transition chỉ chạy khi một phần tử **đang tồn tại** đổi thuộc tính). Vì thế ta dựng thẻ **một lần** lúc bắt đầu ván, sau đó chỉ bật tắt `data-flipped`/`data-matched` trên các nút có sẵn.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Lưới `grid-cols-4`, thẻ vuông `aspect-square` | Dựng 12 thẻ từ `<template>`, ghi `data-id` |
| `perspective-midrange`, `transform-3d`, `backface-hidden`, `group-data-flipped:rotate-y-180` | Bật tắt `data-flipped` bằng `toggleAttribute(tên, force)` |
| `ease-[cubic-bezier(0.34,1.56,0.64,1)]` nhịp nảy | Không làm gì: nhịp là việc của CSS |
| `group-data-matched:bg-emerald-200 group-data-matched:ring-2` | Bật tắt `data-matched` |
| `motion-reduce:transition-none` | Xáo bài, so khớp, đếm lượt, khoá bấm, `localStorage` |

JS không thêm hoặc gỡ class, không đặt `style.transform`, không tìm thẻ bằng class.

## Ôn lại

- Bài 018 (`bai-018-ket-sat-ma-pin`): `perspective-midrange`, `backface-hidden`, xoay quanh trục Y.
- Bài 019 (`bai-019-xuc-xac-3d`): `transform-3d` ở lớp giữa; bài 010 (`bai-010-the-tu-vung-lat`): lật thẻ bằng `data-*`.
- Bài 016 (`bai-016-bang-viec-the-dan`): `template`, `cloneNode(true)`, `setTimeout`.
- Bài 020 và bài 025 (`bai-020-ghi-chu-kinh-mo`, `bai-025-vi-chi-tieu-kinh-mo`): object `state`, `localStorage` với `getItem` trả `null` lần đầu.
- Bài 015 (`bai-015-theo-doi-uong-nuoc`): `toggleAttribute(tên, force)`.

## Gợi ý từng bước

> Starter đã điền sẵn: nền gradient, tiêu đề, dòng trạng thái, dòng điểm, lưới `grid-cols-4`, nút "Chơi lại", và trong `<template data-card-template>`: nút thẻ `group perspective-midrange`, khối `data-inner` với `transform-3d transition-transform duration-500 group-data-flipped:rotate-y-180`, hai mặt có `backface-hidden`, mặt sau có `group-data-matched:...`. Bạn tự thêm hai nhóm class mới: **tỉ lệ khung hình** và **nhịp chuyển động**.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc `data-app`, `data-status`, `data-moves`, `data-best`, `data-board` (chỗ đặt thẻ), `data-restart`, và `<template data-card-template>` với `data-card`, `data-inner`, `data-face`. Kiểm tra: mở trang thấy tiêu đề, điểm, nút "Chơi lại", chưa có thẻ nào.

2. **JS: dữ liệu và kỷ lục.** **Bạn làm:** toàn bộ JS. Mảng `symbols` 6 biểu tượng; lấy các phần tử bằng `querySelector('[data-...]')`; object `state` gồm `cards` (mảng), `first` (thẻ lật đầu, hoặc `null`), `locked`, `moves`, `matched`, `best`. Viết `loadBest()`: `localStorage.getItem` trả `null` lần đầu thì trả `null`, còn lại `Number(raw)`. Kiểm tra: `state` ở Console có `best: null`.

3. **JS: xáo bài Fisher–Yates.** **Bạn làm:** toàn bộ JS. Hàm `shuffle(list)` sao chép mảng bằng `list.slice()`, rồi vòng `for` đi từ `length - 1` xuống `1`, chọn `j = Math.floor(Math.random() * (i + 1))` và đổi chỗ bằng gán phân rã `[a[i], a[j]] = [a[j], a[i]]` (vế trái là hai ô, vế phải là mảng hai giá trị đã đảo). Kiểm tra: `shuffle([1, 2, 3, 4, 5])` gọi nhiều lần ra thứ tự khác nhau, mảng gốc không đổi.

4. **JS: dựng thẻ một lần, cập nhật bằng thuộc tính.** **Bạn làm:** toàn bộ JS. `newGame()`: `shuffle(symbols.concat(symbols))` rồi `map` thành các object `{ id, symbol, flipped, matched }`; reset `first`, `locked`, `moves`, `matched`; `board.replaceChildren(...)` với mỗi thẻ nhân bản từ template (`cloneNode(true)`, `dataset.id`, `textContent` cho `[data-face]`). Viết riêng `update()`: duyệt `state.cards`, tìm nút bằng `[data-id="..."]`, `toggleAttribute('data-flipped', faceUp)`, `toggleAttribute('data-matched', matched)`, `setAttribute('aria-label', ...)`, rồi ghi số lượt và kỷ lục (`--` khi `best` là `null`). Kiểm tra: gọi `state.cards[0].flipped = true; update()` ở Console thì thẻ 0 hiện mặt sau (sau khi làm bước CSS thì có chuyển động).

5. **JS: luật chơi.** **Bạn làm:** toàn bộ JS. Uỷ quyền `click` ở `data-app`: `closest('[data-restart]')` thì `newGame()`; `closest('[data-card]')` rồi bỏ qua nếu `state.locked` hoặc thẻ đã lật hoặc đã khớp. `flipCard(card)`: thẻ đầu thì lưu vào `state.first`; thẻ thứ hai thì tăng `moves`, so `symbol`: giống thì đánh dấu `matched`, khác thì `locked = true` và `setTimeout` 900 ms úp cả hai lại rồi mở khoá. Kiểm tra: lật hai thẻ khác nhau, trong 0,9 giây bấm thẻ thứ ba không có tác dụng.

6. **JS: kết thúc ván và kỷ lục.** **Bạn làm:** toàn bộ JS. Khi `matched` bằng 6: `Math.min(state.best, state.moves)` (hoặc `moves` nếu `best` là `null`) ghi vào `state.best`, `localStorage.setItem(khoá, String(...))`, đổi dòng trạng thái và `restartButton.focus()`. Kiểm tra: thắng ván, tải lại trang thì "Kỷ lục" vẫn còn; chơi lại ván tệ hơn thì kỷ lục không đổi.

7. **CSS: thẻ vuông và nhịp nảy.** **Bạn làm:** trong `<template>`, thêm `aspect-square` vào `<button data-card>`; thêm `ease-[cubic-bezier(0.34,1.56,0.64,1)]` vào `<span data-inner>`. `aspect-square` đặt `aspect-ratio: 1 / 1` nên chiều cao tự bằng chiều rộng ô lưới (nếu thiếu, nút chỉ cao bằng chữ nên thẻ gần như phẳng vì `size-full` của khối trong không có chiều cao để bám). Giá trị trong ngoặc vuông là hàm `cubic-bezier(x1, y1, x2, y2)`; `y1 = 1,56` lớn hơn 1 gây hiệu ứng quá đà. Kiểm tra: thẻ vuông, lật có độ nảy; đổi thử thành `ease-linear` để thấy khác biệt.

8. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra, đặc biệt thử khoá bấm và bàn phím.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `aspect-square` | `aspect-ratio: 1 / 1` |
| `ease-[cubic-bezier(0.34,1.56,0.64,1)]` | `transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `perspective-midrange` | `perspective: 800px` |
| `transform-3d` | `transform-style: preserve-3d` |
| `backface-hidden` | `backface-visibility: hidden` |
| `group-data-flipped:rotate-y-180` | `.card[data-flipped] .inner { transform: rotateY(180deg) }` |
| `rotate-y-180` (ở mặt sau) | `transform: rotateY(180deg)` |
| `size-full` | `width: 100%; height: 100%` |
| `group-data-matched:ring-2 group-data-matched:ring-emerald-300` | `.card[data-matched] .back { box-shadow: 0 0 0 2px #6ee7b7 }` |

## Tự kiểm tra

- [ ] Mở trang: 12 thẻ úp, bốn cột, thẻ vuông; mỗi lần bấm "Chơi lại" thứ tự biểu tượng khác (kiểm tra bằng cách lật hết ở Console: `state.cards.map(function (c) { return c.symbol; })`).
- [ ] Lật hai thẻ giống nhau: cả hai giữ mặt biểu tượng, nền xanh lục, dòng trạng thái "Khớp rồi!". Lật hai thẻ khác nhau: sau 0,9 giây cả hai úp lại.
- [ ] Trong 0,9 giây chờ úp, bấm thẻ thứ ba hoặc bấm lại thẻ đang mở: không có gì xảy ra, số lượt không tăng.
- [ ] Ghép đủ 6 cặp: dòng trạng thái báo số lượt, "Kỷ lục" cập nhật, focus ở "Chơi lại". Tải lại trang: kỷ lục vẫn còn (Application, Local Storage thấy `bai-026-ky-luc`).
- [ ] DevTools: xoá `transform-3d` của `data-inner` thì thấy cả hai mặt đè nhau; xoá `backface-hidden` của mặt trước thì lật xong vẫn thấy chữ `?` bị lật ngược.
- [ ] Bàn phím: Tab tới từng thẻ (viền focus rõ), Enter hoặc Space lật thẻ; nút "Chơi lại" cũng vậy.
- [ ] Bật `prefers-reduced-motion: reduce`: thẻ đổi mặt ngay, không có chuyển động (`motion-reduce:transition-none`).
- [ ] Tự hỏi: vì sao `perspective` đặt ở nút thẻ chứ không ở khối `inner`? Vì sao dựng thẻ một lần rồi chỉ đổi thuộc tính? Vì sao `sort(function () { return Math.random() - 0.5; })` không xáo đều?

## Thử thách thêm

1. Thêm độ khó: nút chọn 4×3 hoặc 4×4 (8 cặp); `symbols` lấy bằng `slice(0, soCap)`. Chỉ cần đổi `grid-cols-*` bằng một `data-size` ở `data-board` và `group-data-[size=...]:`.
2. Đếm thời gian chơi bằng `Date.now()` lúc lật thẻ đầu tiên đến lúc ghép xong, định dạng `phút:giây` bằng `padStart`, lưu kỷ lục thời gian cạnh kỷ lục lượt (lưu object bằng `JSON.stringify`).

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
		<title>Bài 026 - Lật thẻ ghép cặp</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main data-app class="app">
			<h1 class="title">Lật thẻ ghép cặp</h1>
			<p data-status aria-live="polite" class="status">Lật hai thẻ giống nhau để ghép cặp.</p>
			<p class="score">
				<span>Lượt: <strong data-moves>0</strong></span>
				<span>Kỷ lục: <strong data-best>--</strong></span>
			</p>
			<div data-board role="group" aria-label="Bàn chơi" class="board"></div>
			<button type="button" data-restart class="restart">Chơi lại</button>
			<template data-card-template>
				<button type="button" data-card class="card">
					<span data-inner class="inner">
						<span aria-hidden="true" class="face front">?</span>
						<span data-face class="face back"></span>
					</span>
				</button>
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
	font-size: 20px;
	line-height: 28px;
	font-weight: 700;
}

.site {
	min-height: 100vh;
	padding: 16px;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
	color: #ffffff;
	background: linear-gradient(to bottom right, #082f49, #115e59);
}

.app {
	margin: 0 auto;
	max-width: 384px;
}

.status {
	margin-top: 4px;
	font-size: 14px;
	line-height: 20px;
	color: #ccfbf1;
}

.score {
	margin-top: 12px;
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	line-height: 20px;
	font-variant-numeric: tabular-nums;
	color: #ccfbf1;
}

.score strong {
	color: #ffffff;
}

.board {
	margin-top: 16px;
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 12px;
}

.card {
	aspect-ratio: 1 / 1;
	perspective: 800px;
	border-radius: 12px;
}

.inner {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;
	transform-style: preserve-3d;
	transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card[data-flipped] .inner {
	transform: rotateY(180deg);
}

.face {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	border-radius: 12px;
	backface-visibility: hidden;
}

.front {
	border: 1px solid rgb(255 255 255 / 0.3);
	background: linear-gradient(to bottom right, #0ea5e9, #4f46e5);
	font-size: 24px;
	line-height: 32px;
	font-weight: 700;
}

.back {
	background: #ffffff;
	font-size: 30px;
	line-height: 36px;
	transform: rotateY(180deg);
}

.card[data-matched] .back {
	background: #a7f3d0;
	box-shadow: 0 0 0 2px #6ee7b7;
}

.restart {
	margin-top: 20px;
	width: 100%;
	border-radius: 12px;
	background: rgb(255 255 255 / 0.9);
	padding: 8px 16px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	color: #042f2e;
	transition: transform 150ms;
}

.restart:hover {
	transform: translateY(-2px);
}

.card:focus-visible,
.restart:focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
	.inner,
	.restart {
		transition: none;
	}
}
```

`solution/script.js`

```js
const STORAGE_KEY = 'bai-026-ky-luc';
const symbols = ['🍎', '🍋', '🍇', '🍓', '🥝', '🍉'];

const app = document.querySelector('[data-app]');
const board = app.querySelector('[data-board]');
const statusText = app.querySelector('[data-status]');
const movesText = app.querySelector('[data-moves]');
const bestText = app.querySelector('[data-best]');
const restartButton = app.querySelector('[data-restart]');
const cardTemplate = app.querySelector('[data-card-template]');

const state = { cards: [], first: null, locked: false, moves: 0, matched: 0, best: loadBest() };

function loadBest() {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw === null ? null : Number(raw);
}

function shuffle(list) {
	const result = list.slice();
	for (let i = result.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

function createCard(card) {
	const button = cardTemplate.content.firstElementChild.cloneNode(true);
	button.dataset.id = card.id;
	button.querySelector('[data-face]').textContent = card.symbol;
	return button;
}

function newGame() {
	const deck = shuffle(symbols.concat(symbols));
	state.cards = deck.map(function (symbol, index) {
		return { id: index, symbol: symbol, flipped: false, matched: false };
	});
	state.first = null;
	state.locked = false;
	state.moves = 0;
	state.matched = 0;
	board.replaceChildren(...state.cards.map(createCard));
	statusText.textContent = 'Lật hai thẻ giống nhau để ghép cặp.';
	update();
}

function update() {
	state.cards.forEach(function (card) {
		const button = board.querySelector('[data-id="' + card.id + '"]');
		const faceUp = card.flipped || card.matched;
		button.toggleAttribute('data-flipped', faceUp);
		button.toggleAttribute('data-matched', card.matched);
		button.setAttribute('aria-label', faceUp ? 'Thẻ ' + card.symbol : 'Thẻ úp');
	});
	movesText.textContent = state.moves;
	bestText.textContent = state.best === null ? '--' : state.best + ' lượt';
}

function finishGame() {
	state.best = state.best === null ? state.moves : Math.min(state.best, state.moves);
	localStorage.setItem(STORAGE_KEY, String(state.best));
	statusText.textContent = 'Hoàn thành sau ' + state.moves + ' lượt!';
	update();
	restartButton.focus();
}

function hideMismatch(first, second) {
	first.flipped = false;
	second.flipped = false;
	state.locked = false;
	update();
}

function flipCard(card) {
	card.flipped = true;
	if (state.first === null) {
		state.first = card;
		update();
		return;
	}
	const first = state.first;
	state.first = null;
	state.moves += 1;
	if (first.symbol === card.symbol) {
		first.matched = true;
		card.matched = true;
		state.matched += 1;
		statusText.textContent = 'Khớp rồi!';
		if (state.matched === symbols.length) {
			finishGame();
			return;
		}
		update();
		return;
	}
	state.locked = true;
	statusText.textContent = 'Chưa khớp, thử lại.';
	update();
	setTimeout(function () {
		hideMismatch(first, card);
	}, 900);
}

function handleClick(event) {
	if (event.target.closest('[data-restart]')) {
		newGame();
		return;
	}
	const button = event.target.closest('[data-card]');
	if (button === null || state.locked) {
		return;
	}
	const card = state.cards[Number(button.dataset.id)];
	if (card.flipped || card.matched) {
		return;
	}
	flipCard(card);
}

app.addEventListener('click', handleClick);
newGame();
```

</details>

### Giải thích từng hàm

- `loadBest()`: không tham số. `localStorage.getItem(khoá)` trả chuỗi đã lưu hoặc `null` nếu chưa có; `raw === null ? null : Number(raw)` là **toán tử ba ngôi**: điều kiện đúng thì lấy giá trị đầu, sai thì lấy giá trị sau; `Number(raw)` đổi chuỗi thành số.
- `shuffle(list)`: trả mảng mới đã xáo. `list.slice()` không tham số sao chép cả mảng (để không sửa mảng gốc); vòng `for (let i = result.length - 1; i > 0; i -= 1)` đi lùi (`i -= 1` là trừ 1); `Math.random()` trả số thực từ 0 đến dưới 1; nhân `(i + 1)` rồi `Math.floor` (làm tròn xuống) cho ra số nguyên `0..i`; `[result[i], result[j]] = [result[j], result[i]]` là **gán phân rã**: vế phải tạo mảng hai giá trị rồi gán lần lượt vào hai ô vế trái, nên đổi chỗ được mà không cần biến tạm.
- `createCard(card)`: nhận object thẻ, trả nút `<button>`. `cardTemplate.content.firstElementChild.cloneNode(true)` nhân bản sâu nút đầu tiên trong template (`true` nghĩa là chép cả con); `button.dataset.id = card.id` ghi `data-id` (dataset luôn lưu chuỗi); `querySelector('[data-face]')` tìm mặt sau; `textContent` ghi biểu tượng.
- `newGame()`: `symbols.concat(symbols)` nối mảng với chính nó, trả mảng mới 12 phần tử (khác `push` vì không sửa mảng cũ); `deck.map(function (symbol, index) {...})` biến mỗi biểu tượng thành object, hàm nhận cả phần tử lẫn chỉ số; `board.replaceChildren(...state.cards.map(createCard))` thay toàn bộ con của lưới (dấu `...` trải mảng thành từng tham số; `map(createCard)` truyền **tên hàm**, không có `()`). Ở cuối gọi `update()`.
- `update()`: `state.cards.forEach(hàm)` duyệt từng thẻ không trả giá trị; `board.querySelector('[data-id="' + card.id + '"]')` ghép chuỗi để tìm nút khớp `data-id`; `card.flipped || card.matched` là toán tử "hoặc" (đúng khi một trong hai đúng); `button.toggleAttribute('data-flipped', faceUp)`: có tham số thứ hai `force`, `true` thì **luôn bật**, `false` thì **luôn tắt** (khác `toggleAttribute(tên)` một tham số là đảo trạng thái); `setAttribute('aria-label', ...)` đặt tên đọc được cho trình đọc màn hình; `state.best === null ? '--' : state.best + ' lượt'` là toán tử ba ngôi, `+` ghép chuỗi.
- `finishGame()`: `Math.min(a, b)` trả số nhỏ hơn trong hai số; `localStorage.setItem(khoá, chuỗi)` chỉ nhận chuỗi nên dùng `String(số)`; `restartButton.focus()` đưa con trỏ bàn phím vào nút.
- `hideMismatch(first, second)`: đặt `flipped = false` cho hai thẻ, mở khoá `state.locked = false`, gọi `update()`; được `setTimeout` gọi sau 900 ms.
- `flipCard(card)`: `return` sớm sau nhánh thẻ đầu (thoát hàm, không chạy phần so khớp); `state.first === null` kiểm tra có thẻ đang chờ không (`===` là so sánh chặt); `state.moves += 1` cộng một lượt; `first.symbol === card.symbol` so hai biểu tượng; `setTimeout(function () { hideMismatch(first, card); }, 900)` hẹn chạy một hàm bọc sau 900 ms (phải bọc trong hàm vì cần truyền tham số; nếu viết `setTimeout(hideMismatch(first, card), 900)` thì hàm chạy ngay).
- `handleClick(event)`: uỷ quyền ở `data-app`. `event.target.closest(selector)` đi ngược lên cây DOM tìm phần tử khớp, trả `null` nếu không có; `button === null || state.locked` thoát sớm khi không bấm vào thẻ hoặc đang khoá; `state.cards[Number(button.dataset.id)]` lấy thẻ theo chỉ số (id chính là chỉ số trong mảng).
- `app.addEventListener('click', handleClick)`: đăng ký hàm bằng cách truyền tên hàm, không có `()`. `const state = {...}` giữ nguyên tham chiếu nhưng vẫn sửa được thuộc tính bên trong.
- Biến `statusText` (không đặt tên `status` vì trùng thuộc tính có sẵn `window.status`).

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Tailwind trong starter | CSS trong `solution/style.css` |
|---|---|
| `group perspective-midrange aspect-square cursor-pointer rounded-xl` trên nút thẻ | `.card { aspect-ratio: 1 / 1; perspective: 800px; border-radius: 12px }` (`cursor: pointer` nằm ở reset `button`) |
| `relative block size-full transform-3d transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-flipped:rotate-y-180` | `.inner { position: relative; display: block; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1) }` và `.card[data-flipped] .inner { transform: rotateY(180deg) }` |
| `absolute inset-0 grid place-items-center rounded-xl backface-hidden` | `.face { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 12px; backface-visibility: hidden }` |
| `rotate-y-180 bg-white text-3xl` (mặt sau) | `.back { background: #ffffff; font-size: 30px; line-height: 36px; transform: rotateY(180deg) }` |
| `group-data-matched:bg-emerald-200 group-data-matched:ring-2 group-data-matched:ring-emerald-300` | `.card[data-matched] .back { background: #a7f3d0; box-shadow: 0 0 0 2px #6ee7b7 }` |
| `grid grid-cols-4 gap-3` | `.board { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px }` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { .inner, .restart { transition: none } }` |

Khác biệt nhỏ: Tailwind v4 ghép `rotate-y-*` vào thuộc tính `transform` bằng các biến CSS; bản thuần viết thẳng `transform: rotateY(180deg)`.
