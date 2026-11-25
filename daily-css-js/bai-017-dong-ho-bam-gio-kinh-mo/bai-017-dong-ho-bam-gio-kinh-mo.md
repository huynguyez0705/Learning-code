# Bài 017: Đồng hồ bấm giờ kính mờ và bẫy đếm giờ lệch

Ngày học 7, bài 1/3, cấp 1, chủ đề CSS: Glassmorphism (ứng dụng đồng hồ bấm giờ), độ khó ★★★, thời gian ước tính 40 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Tải lại trang thì đồng hồ về `00:00.00` và danh sách vòng trống. Đây là hành vi đúng của bài.

## Mục tiêu

- Tấm kính mờ ở giữa trang **làm nhoè và sáng hơn** các đốm màu phía sau (`backdrop-brightness-*`, `backdrop-contrast-*` cộng với phần `backdrop-blur-xl` đã có).
- Đồng hồ chạy bằng `setInterval`, hiện dạng `mm:ss.cc` (phút, giây, phần trăm giây), **không lệch giờ** dù tab bị thu nhỏ hay trình duyệt bận.
- Ba nút `Bắt đầu / Tạm dừng / Tiếp tục`, `Vòng`, `Đặt lại` đổi chữ và khoá đúng lúc; chấm tròn ở góc sáng xanh khi đồng hồ đang chạy.
- Mỗi lần bấm `Vòng`, một dòng mới hiện **ở đầu danh sách** (vòng mới nhất nằm trên); vòng nhanh nhất chữ xanh, vòng chậm nhất chữ hồng khi có từ 2 vòng.
- Các chữ số không "nhảy ngang" mỗi khi đổi số.

## Kết quả mong đợi

Một tấm kính mờ nổi trên nền tối có ba quả cầu màu (tím, xanh da trời, vàng). Quả cầu vàng nằm sát mép dưới tấm kính nên chỗ giao nhau bị nhoè thành vệt sáng. Trong tấm kính có chữ `00:00.00` cỡ lớn, ba nút và danh sách vòng. Bấm `Bắt đầu` thì số chạy, chấm góc chuyển xanh lục, nút đầu thành `Tạm dừng` màu cam.

## Tư duy

**Kính mờ gồm ba lớp.** (1) Một nền **có thứ để nhìn xuyên qua**: không có đốm màu phía sau thì kính mờ trông như một ô xám phẳng. (2) Màu nền bán trong suốt (`bg-white/15`). (3) Bộ lọc `backdrop-filter` xử lý **những gì nằm sau** tấm kính, không đụng tới chữ trên kính: `blur` làm nhoè, `saturate` làm màu đậm hơn, `brightness` làm sáng, `contrast` giảm tương phản để ra cảm giác "mờ sương". Bài 009, 012 và 013 đã dùng `backdrop-blur-md`; hôm nay thêm hai bộ lọc còn lại.

**Đếm giờ: đừng đếm nhịp, hãy đọc đồng hồ.** Cách ngây thơ là mỗi lần `setInterval` chạy thì cộng thêm 20 ms vào biến `elapsed`. Nhưng `setInterval` chỉ hứa "gọi **không sớm hơn** 20 ms"; khi tab bị ẩn, trình duyệt kéo giãn nhịp tới 1 giây một lần, và máy bận thì nhịp trễ. Cộng 20 ms mỗi lần sẽ làm đồng hồ chạy chậm. Cách đúng: lúc bấm `Bắt đầu` ghi lại **giờ thật** (`Date.now()`), mỗi nhịp lấy `giờ thật hiện tại - giờ bắt đầu` rồi cộng phần đã chạy trước đó. `setInterval` chỉ còn việc "gọi vẽ lại", sai nhịp thì chỉ vẽ trễ chứ không sai giờ. Ví dụ đời thường: hỏi giờ trên đồng hồ treo tường, không tự đếm "tích tắc" trong đầu.

**Ba biến trạng thái.** `startedAt` (giờ thật lúc bắt đầu lần chạy hiện tại), `elapsedBefore` (tổng thời gian của các lần chạy trước, để `Tạm dừng` rồi `Tiếp tục` không mất giờ), và `timerId` (mã trả về của `setInterval`; `null` nghĩa là đang dừng). Chỉ cần `timerId` là biết đồng hồ chạy hay dừng, không cần thêm biến `running`.

**Thứ tự trong `pause()`.** Phải tính `elapsedBefore = getElapsed()` **trước** khi đặt `timerId = null`, vì `getElapsed()` đọc `timerId` để biết có cộng phần đang chạy hay không. Đảo hai dòng thì mất đúng khoảng thời gian của lần chạy cuối.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Tấm kính: `backdrop-blur-xl backdrop-saturate-150 backdrop-brightness-110 backdrop-contrast-90` | Tính giờ, ghi `00:00.00` vào `data-display` |
| Chấm tròn xanh: `group-data-running:bg-emerald-400`; nút đổi màu: `group-data-running:bg-amber-500/70` | Bật/tắt `data-running` trên `<main>` bằng `toggleAttribute` |
| Vòng nhanh/chậm: `data-best:text-emerald-300`, `data-worst:text-rose-300` | Tìm vòng nhanh nhất và chậm nhất, ghi `data-best`/`data-worst` |
| Chữ số đều nhau: `font-mono tabular-nums` | Ghi chữ cho nút, khoá/mở nút bằng `disabled` |

JS không thêm hoặc gỡ class, không đặt `style`, không tìm phần tử bằng class; chỉ tìm bằng `data-*`.

## Ôn lại

- Bài 009 (`bai-009-quiz-kinh-mo`), 012 và 013: `backdrop-blur-*`, `supports-[backdrop-filter]:`, đốm nền `-z-10` + `isolate`.
- Bài 014 (`bai-014-hop-thu-huy-hieu`): `toggleAttribute(tên, force)`.
- Bài 006 (`bai-006-gio-hang`): `Array.from`, `Number`, `Intl`; bài 013: `padStart`.
- Bài 005 và 013: `template.content.firstElementChild.cloneNode(true)`.
- Bài 008 và 013: `setTimeout`/`clearTimeout` (hôm nay là cặp `setInterval`/`clearInterval`).

## Gợi ý từng bước

> Starter đã điền sẵn: nền tối, ba đốm màu, tấm kính (`border-white/30 bg-white/25 ring-1 ring-white/20 shadow-lg backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/15`), chấm trạng thái `group-data-running:bg-emerald-400`, ô số (`rounded-2xl bg-black/20 text-5xl tabular-nums`), ba nút (`disabled:`, `hover:ring-2`, viền focus), danh sách vòng (`divide-y`), và dòng vòng trong `<template>` kèm `data-best:`/`data-worst:`. **Chưa có**: bộ lọc `backdrop-brightness-*`/`backdrop-contrast-*` ở tấm kính và `font-mono select-none` ở ô số.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-watch` (thẻ `<main>`, nơi sẽ ghi `data-running`), `data-panel` (tấm kính), `data-display` (có `role="timer"`), `data-toggle`, `data-lap`, `data-reset` (hai nút sau đang `disabled`), `data-laps` (danh sách `<ol>`), và `<template data-lap-template>` với `data-lap-item`, `data-lap-number`, `data-lap-time`, `data-lap-total`. Kiểm tra: thấy tấm kính nhoè quả cầu vàng ở mép dưới; chữ `00:00.00` đã nằm trong ô tối.

2. **CSS: thêm hai bộ lọc cho tấm kính.** **Bạn làm:** trên `<section data-panel>` thêm `backdrop-brightness-110 backdrop-contrast-90`. `backdrop-brightness-110` làm phần nền phía sau sáng hơn 10%; `backdrop-contrast-90` giảm tương phản còn 90%, làm các mép của đốm màu mềm đi. Chúng **cộng dồn** với `backdrop-blur-xl backdrop-saturate-150` vì Tailwind gộp tất cả vào một thuộc tính `backdrop-filter`. Kiểm tra: tấm kính sáng và "sương" hơn trước; trong DevTools bỏ `backdrop-blur-xl` thì quả cầu vàng hiện sắc nét xuyên qua tấm kính.

3. **CSS: chữ số đều nhau.** **Bạn làm:** trên `<p data-display>` thêm `font-mono select-none`. `font-mono` đổi sang phông đơn cách (mọi ký tự rộng bằng nhau); `select-none` không cho bôi đen chữ khi bấm nhanh. Bài đã có sẵn `tabular-nums`, nó ép các **chữ số** rộng bằng nhau trong phông thường. Kiểm tra: tạm đặt chữ `11:11.11` rồi `00:00.00` bằng DevTools, độ rộng không đổi; bỏ cả `font-mono` lẫn `tabular-nums` thì độ rộng thay đổi theo chữ số.

4. **JS: lấy phần tử và hai hàm định dạng.** **Bạn làm:** toàn bộ JS. Lấy `watch`, `display`, `toggleButton`, `lapButton`, `resetButton`, `lapList`, `template` bằng `querySelector` theo `data-*`. Khai báo `let timerId = null`, `let startedAt = 0`, `let elapsedBefore = 0`, `let lastLapTotal = 0`. Viết `pad(number)`: `String(number).padStart(2, '0')` (`padStart(độ dài, ký tự)` chèn ký tự vào **đầu** chuỗi cho đủ độ dài; `5` thành `'05'`). Viết `formatTime(ms)`: `minutes = Math.floor(ms / 60000)`, `seconds = Math.floor(ms / 1000) % 60`, `centis = Math.floor(ms / 10) % 100`; trả chuỗi mẫu dạng `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`. Toán tử `%` là **phần dư**: `75 % 60` ra `15`, giúp giây quay về 0 sau mỗi 60. Kiểm tra: gõ `formatTime(83456)` trong Console ra `01:23.45`.

5. **JS: chạy đúng giờ bằng `setInterval` và `Date.now()`.** **Bạn làm:** toàn bộ JS. Viết `getElapsed()`: nếu `timerId === null` thì `return elapsedBefore`; không thì `return elapsedBefore + Date.now() - startedAt` (`Date.now()` trả số mili giây tính từ 1/1/1970, nên hiệu hai lần gọi là thời gian thật đã trôi). Viết `tick()` ghi `formatTime(getElapsed())` vào `display.textContent`. Viết `start()`: `startedAt = Date.now()`, rồi `timerId = setInterval(___, 20)`: **`setInterval(hàm, ms)`** gọi `hàm` lặp lại mỗi `ms` mili giây và trả một **số mã**; điền tên hàm `tick` (không có `()`). Viết `pause()`: `elapsedBefore = getElapsed()` **trước**, rồi `clearInterval(timerId)` (dừng nhịp lặp theo mã) và `timerId = null`. **Thử bẫy:** tạm viết lại `tick` thành `elapsed += 20` (biến đếm riêng), bấm `Bắt đầu`, chuyển sang tab khác 10 giây rồi quay lại: đồng hồ chỉ chạy được khoảng 1–2 giây vì nhịp bị kéo giãn. Rồi đổi lại cách `Date.now()` ở trên: quay lại tab thì đồng hồ nhảy thẳng tới đúng 10 giây. Tạm thời gọi `start()` cuối file để thử. Kiểm tra: số chạy đều; `pause()` thì đứng im; gọi `start()` lần nữa thì chạy tiếp, không về 0.

6. **JS: `render()` ghi trạng thái.** **Bạn làm:** toàn bộ JS. Viết `render()`: `running = timerId !== null`, `hasTime = getElapsed() > 0`. Rồi `watch.toggleAttribute('data-running', running)` (có thêm tham số `force`: `true` thì thêm thuộc tính, `false` thì gỡ, không cần kiểm tra trước); ghi chữ nút bằng toán tử ba ngôi lồng nhau: `running ? 'Tạm dừng' : hasTime ? 'Tiếp tục' : 'Bắt đầu'`; `lapButton.disabled = !running`; `resetButton.disabled = !hasTime`; gọi `tick()`. Gọi `render()` ở cuối `start()` và `pause()`, rồi gắn `click` cho `toggleButton`: nếu `timerId === null` thì `start()` ngược lại `pause()`. Gọi `render()` một lần cuối file. Kiểm tra: lúc mới mở nút `Vòng` và `Đặt lại` xám; bấm `Bắt đầu` thì chấm góc xanh lục, nút thành `Tạm dừng` màu cam; `Tạm dừng` thì nút thành `Tiếp tục`.

7. **JS: ghi vòng bằng `template` và `prepend`.** **Bạn làm:** toàn bộ JS. Viết `addLap()`: `total = getElapsed()`, `duration = total - lastLapTotal`, rồi `lastLapTotal = total`. Nhân bản dòng: `template.content.firstElementChild.cloneNode(true)`. Ghi `item.dataset.duration = duration` (cất độ dài vòng vào `data-duration`, kiểu chuỗi) rồi ba `textContent`: `Vòng ${lapList.children.length + 1}`, `formatTime(duration)`, `formatTime(total)`. Cuối cùng `lapList.prepend(item)`: **`prepend`** gắn phần tử vào **đầu** danh sách (ngược với `append` gắn vào cuối), nên vòng mới nhất nằm trên. Gắn `lapButton.addEventListener('click', addLap)`. Kiểm tra: bấm `Vòng` ba lần thì thấy `Vòng 3` ở trên cùng; cột giữa là thời gian riêng của vòng, cột phải là tổng.

8. **JS: vòng nhanh nhất, chậm nhất, và `Đặt lại`.** **Bạn làm:** toàn bộ JS. Viết `markExtremes()`: `laps = Array.from(lapList.children)`, `durations = laps.map(...)` trả `Number(lap.dataset.duration)`; `best = Math.min(...durations)` và `worst = Math.max(...durations)`. Dấu `...` (**toán tử trải**) rải từng phần tử của mảng thành các tham số riêng, vì `Math.min` nhận danh sách số chứ không nhận mảng. Rồi `laps.forEach(function (lap, index) { ... })` và với mỗi vòng `lap.toggleAttribute('data-best', laps.length > 1 && durations[index] === best)`, tương tự cho `data-worst`. Gọi `markExtremes()` cuối `addLap()`. Viết `reset()`: `clearInterval(timerId)`, `timerId = null`, đặt ba biến giờ về `0`, `lapList.replaceChildren()` (không tham số: xoá sạch mọi con), rồi `render()`; gắn vào `resetButton`. Kiểm tra: một vòng thì chưa có màu; từ hai vòng, vòng ngắn nhất xanh, dài nhất hồng; `Đặt lại` đưa mọi thứ về ban đầu, hai nút phụ xám lại.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương (gần đúng) |
|---|---|
| `backdrop-blur-xl` | `backdrop-filter: blur(24px)` |
| `backdrop-saturate-150` | `backdrop-filter: saturate(150%)` |
| `backdrop-brightness-110` | `backdrop-filter: brightness(110%)` |
| `backdrop-contrast-90` | `backdrop-filter: contrast(90%)` |
| `bg-white/15` | `background: rgb(255 255 255 / 0.15)` |
| `supports-[backdrop-filter]:bg-white/15` | `@supports (backdrop-filter: blur(1px)) { ... }` |
| `font-mono` | `font-family: ui-monospace, ..., monospace` |
| `tabular-nums` | `font-variant-numeric: tabular-nums` |
| `select-none` | `user-select: none` |
| `group-data-running:bg-emerald-400` | `[data-watch][data-running] .status-dot { background: #34d399 }` |

## Tự kiểm tra

- [ ] Tấm kính nhoè rõ quả cầu vàng và có viền sáng mảnh; chữ trong kính vẫn sắc nét (bộ lọc chỉ tác động lên nền phía sau).
- [ ] Đồng hồ chạy đúng: bấm giờ cạnh đồng hồ thật, sau 30 giây lệch dưới 0,1 giây. `Tạm dừng` rồi `Tiếp tục` giữ nguyên số đã có.
- [ ] Nút `Vòng` và `Đặt lại` xám đúng lúc; chữ nút đầu đổi đúng ba trạng thái.
- [ ] Từ hai vòng có một dòng xanh và một dòng hồng; vòng mới nằm trên cùng.
- [ ] DevTools: gỡ `data-running` khỏi `<main>` thì chấm xám lại; gỡ `backdrop-saturate-150` thì màu sau kính nhạt đi.
- [ ] Bàn phím: Tab qua ba nút, Enter/Space bấm được, viền focus trắng rõ.
- [ ] Bật `prefers-reduced-motion: reduce`: chấm tròn đổi màu tức thì, không chuyển dần.
- [ ] Tự hỏi: vì sao tính giờ bằng `Date.now()` chính xác hơn cộng 20 ms mỗi nhịp? Vì sao `pause()` phải tính `elapsedBefore` trước khi gán `timerId = null`? `Math.min(durations)` (không có `...`) ra gì?

## Thử thách thêm

1. **Kính chồng kính.** Thêm `backdrop-blur-md` cho từng dòng vòng (`<li>` trong `<template>`) rồi quan sát: dòng vòng nằm **trong** tấm kính đã có `backdrop-filter`, nên chúng chỉ "thấy" nền của tấm kính chứ không thấy đốm màu phía sau; bộ lọc gần như không có tác dụng. Hãy ghi lại điều bạn thấy và thử đặt dòng vòng ra ngoài tấm kính.
2. **Hiện phần trăm giây mờ.** Tách phần `.cc` thành `<span>` riêng với `text-3xl text-white/60`, JS ghi hai phần vào hai phần tử khác nhau; chú ý `formatTime` phải trả về hai giá trị (gợi ý: trả một mảng hoặc đối tượng).

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
		<title>Bài 017 - Đồng hồ bấm giờ kính mờ</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main data-watch class="stage">
			<div aria-hidden="true" class="blob blob-pink"></div>
			<div aria-hidden="true" class="blob blob-sky"></div>
			<div aria-hidden="true" class="blob blob-amber"></div>
			<section data-panel aria-labelledby="watch-title" class="panel">
				<div class="panel-head">
					<h1 id="watch-title" class="panel-title">Bấm giờ</h1>
					<span aria-hidden="true" class="status-dot"></span>
				</div>
				<p data-display role="timer" class="display">00:00.00</p>
				<div class="controls">
					<button type="button" data-toggle class="button button-main">Bắt đầu</button>
					<button type="button" data-lap disabled class="button">Vòng</button>
					<button type="button" data-reset disabled class="button">Đặt lại</button>
				</div>
				<ol data-laps aria-label="Danh sách vòng" class="laps"></ol>
			</section>
		</main>
		<template data-lap-template>
			<li data-lap-item class="lap">
				<span data-lap-number class="lap-number"></span>
				<span data-lap-time class="lap-time"></span>
				<span data-lap-total class="lap-total"></span>
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

button {
	font: inherit;
	color: inherit;
	background: none;
	border: 0;
	cursor: pointer;
}

ol {
	list-style: none;
}

h1 {
	font-size: inherit;
	font-weight: inherit;
}

.site {
	min-height: 100vh;
	background: #0f172a;
	color: #ffffff;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.stage {
	position: relative;
	isolation: isolate;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: 40px 16px;
	overflow: hidden;
}

.blob {
	position: absolute;
	z-index: -10;
	border-radius: 9999px;
}

.blob-pink {
	top: -64px;
	left: -64px;
	width: 288px;
	height: 288px;
	background: #d946ef;
}

.blob-sky {
	right: -40px;
	top: 33.333333%;
	width: 256px;
	height: 256px;
	background: #0ea5e9;
}

.blob-amber {
	bottom: -80px;
	left: 25%;
	width: 320px;
	height: 320px;
	background: #fbbf24;
}

.panel {
	width: 100%;
	max-width: 448px;
	padding: 24px;
	border-radius: 24px;
	border: 1px solid rgb(255 255 255 / 0.3);
	background: rgb(255 255 255 / 0.25);
	box-shadow: 0 0 0 1px rgb(255 255 255 / 0.2), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	-webkit-backdrop-filter: blur(24px) brightness(1.1) contrast(0.9) saturate(1.5);
	backdrop-filter: blur(24px) brightness(1.1) contrast(0.9) saturate(1.5);
}

@supports (backdrop-filter: blur(1px)) {
	.panel {
		background: rgb(255 255 255 / 0.15);
	}
}

.panel-head {
	display: flex;
	align-items: center;
	gap: 8px;
}

.panel-title {
	font-size: 1.25rem;
	line-height: 1.75rem;
	font-weight: 700;
}

.status-dot {
	margin-left: auto;
	width: 12px;
	height: 12px;
	border-radius: 9999px;
	background: rgb(255 255 255 / 0.4);
	transition: background-color 300ms;
}

[data-watch][data-running] .status-dot {
	background: #34d399;
}

.display {
	margin-top: 24px;
	padding: 24px 0;
	border-radius: 16px;
	background: rgb(0 0 0 / 0.2);
	text-align: center;
	font-size: 3rem;
	line-height: 1;
	font-variant-numeric: tabular-nums;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	-webkit-user-select: none;
	user-select: none;
}

.controls {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 8px;
	margin-top: 16px;
}

.button {
	padding: 12px;
	border-radius: 12px;
	background: rgb(255 255 255 / 0.25);
	font-weight: 600;
}

.button:hover {
	box-shadow: 0 0 0 2px rgb(255 255 255 / 0.5);
}

.button:focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}

.button:disabled {
	cursor: not-allowed;
	opacity: 0.4;
}

.button-main {
	background: rgb(16 185 129 / 0.7);
}

[data-watch][data-running] .button-main {
	background: rgb(245 158 11 / 0.7);
}

.laps {
	max-height: 256px;
	margin-top: 16px;
	overflow-y: auto;
}

.laps > :not(:last-child) {
	border-bottom: 1px solid rgb(255 255 255 / 0.2);
}

.lap {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 8px;
	padding: 8px 0;
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-variant-numeric: tabular-nums;
}

.lap[data-best] {
	color: #6ee7b7;
}

.lap[data-worst] {
	color: #fda4af;
}

.lap-time {
	text-align: center;
}

.lap-total {
	text-align: right;
	opacity: 0.7;
}

@media (prefers-reduced-motion: reduce) {
	.status-dot {
		transition: none;
	}
}
```

`solution/script.js`

```js
const watch = document.querySelector('[data-watch]');
const display = document.querySelector('[data-display]');
const toggleButton = document.querySelector('[data-toggle]');
const lapButton = document.querySelector('[data-lap]');
const resetButton = document.querySelector('[data-reset]');
const lapList = document.querySelector('[data-laps]');
const template = document.querySelector('[data-lap-template]');
let timerId = null;
let startedAt = 0;
let elapsedBefore = 0;
let lastLapTotal = 0;

function pad(number) {
	return String(number).padStart(2, '0');
}

function formatTime(ms) {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor(ms / 1000) % 60;
	const centis = Math.floor(ms / 10) % 100;
	return `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
}

function getElapsed() {
	if (timerId === null) {
		return elapsedBefore;
	}
	return elapsedBefore + Date.now() - startedAt;
}

function tick() {
	display.textContent = formatTime(getElapsed());
}

function render() {
	const running = timerId !== null;
	const hasTime = getElapsed() > 0;
	watch.toggleAttribute('data-running', running);
	toggleButton.textContent = running ? 'Tạm dừng' : hasTime ? 'Tiếp tục' : 'Bắt đầu';
	lapButton.disabled = !running;
	resetButton.disabled = !hasTime;
	tick();
}

function start() {
	startedAt = Date.now();
	timerId = setInterval(tick, 20);
	render();
}

function pause() {
	elapsedBefore = getElapsed();
	clearInterval(timerId);
	timerId = null;
	render();
}

function markExtremes() {
	const laps = Array.from(lapList.children);
	const durations = laps.map(function (lap) {
		return Number(lap.dataset.duration);
	});
	const best = Math.min(...durations);
	const worst = Math.max(...durations);
	laps.forEach(function (lap, index) {
		lap.toggleAttribute('data-best', laps.length > 1 && durations[index] === best);
		lap.toggleAttribute('data-worst', laps.length > 1 && durations[index] === worst);
	});
}

function addLap() {
	const total = getElapsed();
	const duration = total - lastLapTotal;
	const item = template.content.firstElementChild.cloneNode(true);
	lastLapTotal = total;
	item.dataset.duration = duration;
	item.querySelector('[data-lap-number]').textContent = `Vòng ${lapList.children.length + 1}`;
	item.querySelector('[data-lap-time]').textContent = formatTime(duration);
	item.querySelector('[data-lap-total]').textContent = formatTime(total);
	lapList.prepend(item);
	markExtremes();
}

function reset() {
	clearInterval(timerId);
	timerId = null;
	startedAt = 0;
	elapsedBefore = 0;
	lastLapTotal = 0;
	lapList.replaceChildren();
	render();
}

toggleButton.addEventListener('click', function () {
	if (timerId === null) {
		start();
	} else {
		pause();
	}
});

lapButton.addEventListener('click', addLap);
resetButton.addEventListener('click', reset);

render();
```

</details>

### Giải thích từng hàm

- `pad(number)`: hàm tự đặt, đổi số thành chuỗi và thêm số `0` đứng trước cho đủ 2 ký tự.
- `formatTime(ms)`: hàm tự đặt, đổi mili giây thành chuỗi `mm:ss.cc`.
- `getElapsed()`: hàm tự đặt, trả tổng mili giây đã chạy: nếu đang dừng thì là `elapsedBefore`, nếu đang chạy thì cộng thêm khoảng từ `startedAt` tới giờ thật.
- `tick()`: hàm tự đặt, ghi thời gian hiện tại vào ô số.
- `render()`: hàm tự đặt, ghi trạng thái ra giao diện: `data-running`, chữ nút, khoá/mở nút phụ, rồi vẽ ô số.
- `start()`, `pause()`, `reset()`: hàm tự đặt, lần lượt bắt đầu/tiếp tục chạy, dừng và giữ giờ, và đưa mọi thứ về ban đầu.
- `markExtremes()`: hàm tự đặt, tìm vòng ngắn nhất và dài nhất rồi ghi `data-best`/`data-worst`.
- `addLap()`: hàm tự đặt, tạo một dòng vòng từ template và đặt lên đầu danh sách.
- `document.querySelector('[data-x]')`: trả phần tử đầu tiên khớp selector thuộc tính, hoặc `null`.
- `String(number).padStart(2, '0')`: `String(x)` đổi sang chuỗi; `padStart(độ dài, ký tự)` chèn ký tự vào đầu cho tới khi đủ độ dài, trả chuỗi mới.
- `Math.floor(x)`: làm tròn xuống số nguyên gần nhất. `a % b`: phần dư của phép chia `a` cho `b`.
- Chuỗi mẫu `` `${pad(minutes)}:${pad(seconds)}` ``: dấu huyền; `${...}` chèn kết quả biểu thức vào chuỗi.
- `Date.now()`: trả thời điểm hiện tại là số mili giây kể từ 1/1/1970. Hiệu hai lần gọi là thời gian thật đã trôi.
- `setInterval(hàm, ms)`: gọi `hàm` lặp lại mỗi `ms` mili giây, trả một số mã. Truyền tên hàm **không có `()`** (`tick`, không phải `tick()`). `clearInterval(mã)`: dừng nhịp lặp của mã đó; `null` thì không làm gì.
- `timerId === null`, `timerId !== null`: so sánh bằng chặt với `null`; `null` là giá trị "chưa có gì" ta tự gán khi dừng.
- `running ? 'Tạm dừng' : hasTime ? 'Tiếp tục' : 'Bắt đầu'`: toán tử ba ngôi lồng nhau; đọc từ trái sang: nếu đang chạy thì `'Tạm dừng'`, ngược lại nếu đã có thời gian thì `'Tiếp tục'`, ngược lại `'Bắt đầu'`.
- `element.toggleAttribute(tên, force)`: có `force` đúng thì thêm thuộc tính, sai thì gỡ, bỏ qua `force` thì đảo trạng thái.
- `button.disabled = !running`: `disabled` là thuộc tính khoá nút; `!` đảo đúng thành sai.
- `template.content.firstElementChild.cloneNode(true)`: lấy `<li>` đầu tiên trong ruột `template` và nhân bản cả cây con (`true`).
- `item.dataset.duration = duration`: ghi `data-duration`; `dataset` luôn lưu chuỗi, nên khi đọc lại phải bọc `Number(...)`.
- `lapList.prepend(item)`: gắn `item` làm con **đầu tiên** của `lapList`. `lapList.children.length`: số phần tử con trực tiếp.
- `Array.from(lapList.children)`: đổi danh sách phần tử con thành mảng thật để dùng `map`, `forEach`.
- `laps.map(hàm)`: tạo mảng mới gồm kết quả `hàm` trả về cho từng phần tử. `laps.forEach(function (lap, index) { ... })`: chạy hàm cho từng phần tử, tham số thứ hai là vị trí.
- `Math.min(...durations)`, `Math.max(...durations)`: `...` rải mảng thành từng tham số riêng; trả số nhỏ nhất, lớn nhất.
- `laps.length > 1 && durations[index] === best`: `&&` đúng khi cả hai vế đúng; chỉ đánh dấu khi có ít nhất 2 vòng.
- `lapList.replaceChildren()`: không tham số thì xoá sạch mọi phần tử con.
- `addEventListener('click', addLap)`: gắn hàm xử lý click; truyền tên hàm **không có `()`** để trình duyệt tự gọi khi có click.
- `if (timerId === null) { return elapsedBefore; }`: return sớm: thoả điều kiện thì thoát hàm ngay, các dòng dưới không chạy.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `backdrop-blur-xl backdrop-saturate-150 backdrop-brightness-110 backdrop-contrast-90` trên tấm kính | `.panel { backdrop-filter: blur(24px) brightness(1.1) contrast(0.9) saturate(1.5) }` (Tailwind gộp bốn lớp lọc vào một thuộc tính) |
| `bg-white/25 supports-[backdrop-filter]:bg-white/15` | `.panel { background: rgb(255 255 255 / 0.25) }` và `@supports (backdrop-filter: blur(1px)) { .panel { background: rgb(255 255 255 / 0.15) } }` |
| `border border-white/30 ring-1 ring-white/20 shadow-lg` | `border: 1px solid rgb(255 255 255 / 0.3)` và `box-shadow` gồm vòng 1px cộng bóng lớn |
| `font-mono tabular-nums select-none` | `.display { font-family: ui-monospace, ...; font-variant-numeric: tabular-nums; user-select: none }` |
| `group-data-running:bg-emerald-400` | `[data-watch][data-running] .status-dot { background: #34d399 }` |
| `data-best:text-emerald-300 data-worst:text-rose-300` | `.lap[data-best] { color: #6ee7b7 }`, `.lap[data-worst] { color: #fda4af }` |
| `divide-y divide-white/20` | `.laps > :not(:last-child) { border-bottom: 1px solid rgb(255 255 255 / 0.2) }` |
| `transition-colors duration-300 motion-reduce:transition-none` | `.status-dot { transition: background-color 300ms }` và `@media (prefers-reduced-motion: reduce) { .status-dot { transition: none } }` |

Khác biệt nhỏ: Tailwind ghép nhiều bộ lọc qua biến CSS rồi gộp vào `backdrop-filter`, kết quả giống hệt một dòng viết tay. Màu Tailwind dùng không gian màu `oklch`, lời giải dùng mã hex gần đúng nên màu lệch rất nhẹ.
