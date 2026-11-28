# Bài 027: Vòng quay thực đơn 3D, phép chia dư âm và bộ lọc làm phẳng 3D

Ngày học 10, bài 2/3, cấp 2, chủ đề CSS: 3D nâng cao (ứng dụng thực đơn theo tuần), độ khó ★★★, thời gian ước tính 40 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này **không** lưu gì. Thực đơn nằm sẵn trong HTML; ngày đang xem luôn bắt đầu từ **hôm nay** mỗi lần tải lại trang.

## Mục tiêu

- Bảy thẻ (Thứ Hai đến Chủ nhật) xếp thành **vòng quay 3D** quanh một trục dọc; chỉ thấy mặt trước của các thẻ, thẻ ở giữa sáng, thẻ hai bên tối hơn.
- Mở trang thì vòng dừng ở **hôm nay** (tính bằng `Date.getDay()`), thẻ hôm nay có nhãn "Hôm nay", dòng trên cùng ghi ngày đầy đủ bằng `Intl.DateTimeFormat`.
- Nút ←/→ và phím mũi tên xoay vòng từng ngày; xoay từ Chủ nhật sang Thứ Hai **tiếp tục cùng chiều** chứ không quay ngược gần một vòng (bẫy JS về số lần xoay và phép chia dư).
- Bấm nhãn T2…CN để nhảy tới ngày đó bằng **đường xoay ngắn nhất** (từ T7 tới CN chỉ xoay 1 bước, không xoay 6 bước).
- Hiểu vì sao đặt bộ lọc (`brightness`) lên chính phần tử `preserve-3d` làm cả vòng bị ép phẳng, và biết chuyển nó xuống từng mặt thẻ.

## Kết quả mong đợi

Nền nâu đen sang cam đất. Ở giữa là vòng thẻ trắng ngà: thẻ giữa rõ nét có chữ ngày, biểu tượng món và tên món; hai thẻ bên cạnh nghiêng đi và tối hơn. Dưới vòng là một câu mô tả món và số kcal, hàng nút ← T2 T3 T4 T5 T6 T7 CN →. Nhãn của ngày đang xem có nền cam.

## Tư duy

**Xếp thẻ thành vòng bằng hai lớp.** Mỗi thẻ là một `<li>` (lớp ngoài) chứa một mặt `<div>` (lớp trong). Lớp ngoài **xoay** `rotateY(index × 360/7 độ)`, lớp trong **đẩy ra** `translateZ(bán kính)`. Thứ tự "xoay rồi đẩy" quan trọng: giống người đứng giữa phòng, quay mặt về hướng nào rồi bước thẳng ra phía trước. Nếu xoay và đẩy cùng một phần tử, thứ tự áp dụng bị đảo (thuộc tính `translate` của Tailwind áp sau cùng, như bài 019). Bán kính tính từ độ rộng thẻ: `r = (w / 2) / tan(π / n)`; với thẻ rộng 144px và 7 thẻ ra khoảng 150px, ta dùng `translate-z-38` (38 × 4 = 152px).

**Đẩy cả vòng lùi ra sau.** Thẻ ở giữa sau khi đẩy sẽ nhô ra trước 152px, tiến sát mắt và phóng to. Ta kéo lùi cả vòng `-translate-z-38` để thẻ trước nằm đúng mặt phẳng 0.

**Số lần xoay (`turns`) khác chỉ số ngày (`index`).** `turns` là một số nguyên **tuỳ ý**, tăng khi bấm →, giảm khi bấm ←, không bao giờ bị cắt về 0–6. Góc của vòng là `-turns × 51,43°`. Chỉ số ngày đang xem mới là `turns` đã "cuộn tròn" về 0–6. Nếu dùng chỉ số làm góc thì từ Chủ nhật (6) sang Thứ Hai (0), góc đổi từ −308° về 0° và vòng quay ngược gần cả vòng. Giống kim đồng hồ: kim giờ không nhảy ngược từ 12 về 1 mà cứ đi tiếp.

**Phép chia dư (`%`) với số âm.** Trong JavaScript `-1 % 7` ra `-1`, không phải `6`. Muốn "cuộn tròn" an toàn: `((giá_trị % 7) + 7) % 7`. Thử ở Console: `-1 % 7`, rồi `((-1 % 7) + 7) % 7`.

**Đường ngắn nhất.** Từ ngày đang xem `a` tới ngày muốn tới `b`, bước xoay là `delta = wrap(b - a)` trong khoảng 0 đến 6. Nếu `delta` lớn hơn nửa vòng (3,5) thì đi ngược lại: `delta - 7` (âm, tức xoay chiều kia). Ví dụ `delta = 6` thành `-1`.

**Cái bẫy CSS: bộ lọc làm phẳng 3D.** Một phần tử có `transform-style: preserve-3d` chỉ giữ được 3D cho các con nếu **không** có thuộc tính nào buộc nó "gộp phẳng". Các thuộc tính đó gồm `filter` (kể cả `brightness`, `blur`), `opacity` nhỏ hơn 1, `overflow` khác `visible`, `clip-path`, `mask`, `mix-blend-mode`. Khi có một trong chúng, trình duyệt vẽ cả cây con ra một ảnh phẳng rồi mới lọc, nên chiều sâu mất. Chữa: đặt bộ lọc lên **phần tử con** (mặt thẻ) chứ không đặt lên phần tử `preserve-3d`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| `perspective-midrange` trên khung, `transform-3d` trên vòng và từng thẻ | Ghi `--a` (góc đặt) cho từng thẻ bằng `style.setProperty` |
| `rotate-y-(--rot)` quay vòng, `rotate-y-(--a)` đặt thẻ | Ghi `--rot` (góc quay hiện tại) |
| `group-data-active:brightness-100` thẻ giữa sáng | Ghi `data-active` bằng `toggleAttribute(tên, force)` |
| `group-data-today:block` nhãn "Hôm nay" | Ghi `data-today` cho thẻ hôm nay |
| `aria-pressed:bg-orange-300` nhãn ngày đang xem | Ghi `aria-pressed`, `aria-hidden`; tính `turns`, chỉ số, đường ngắn nhất |

JS không thêm hoặc gỡ class, không đặt `style.transform`, không tìm phần tử bằng class.

## Ôn lại

- Bài 019 (`bai-019-xuc-xac-3d`): khối 3D từ nhiều mặt (lớp ngoài xoay, lớp trong `translate-z-*`), `transform-3d`, `rotate-y-(--ry)`, bẫy xoay và đẩy cùng một phần tử, `style.setProperty` cho góc cộng dồn (không cuộn về 0).
- Bài 018 (`bai-018-ket-sat-ma-pin`): `backface-hidden`, `perspective-midrange`.
- Bài 014 (`bai-014-hop-thu-huy-hieu`): `group-data-*:`, `hidden` + `group-data-unread:block`; bài 025: `aria-pressed:`.
- Bài 023 (`bai-023-lich-tap-luyen`): `Date.getDay()`, `Intl.DateTimeFormat('vi-VN', ...)`.
- Bài 003 và 004: `closest` để uỷ quyền click.

## Gợi ý từng bước

> Starter đã điền sẵn: nền gradient, khung `perspective-midrange`, vòng `<ul data-ring>` với `-translate-z-38 transform-3d rotate-y-(--rot) transition-transform duration-700 ease-out`, bảy thẻ `<li>` có `group absolute inset-0 transform-3d rotate-y-(--a)`, mặt thẻ `translate-z-38 backface-hidden` cùng toàn bộ chữ và nhãn "Hôm nay" (`hidden group-data-today:block`), các nút và nhãn ngày. Với **5 mặt thẻ đầu** (Thứ Hai đến Thứ Sáu) đã điền sẵn cả nhóm class mới là bộ lọc `brightness-50 transition-[filter] duration-500 group-data-active:brightness-100 motion-reduce:transition-none`. Bạn tự thêm một nhóm class mới cho **2 mặt cuối** và gặp một cái bẫy: **bộ lọc ánh sáng và `preserve-3d`**.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc `data-app`, `data-today-note`, `data-ring`, bảy `data-day` (mỗi thẻ có `data-name`, `data-dish`, `data-kcal`), `data-detail`, hai nút `data-step` (`-1`, `1`), bảy nút `data-jump` (`0` đến `6`). Kiểm tra: mở trang thấy bảy thẻ chồng lên nhau ở giữa (chưa có `--a` nên chưa xoay), vòng chưa quay.

2. **JS: dữ liệu, `turns` và phép cuộn tròn.** **Bạn làm:** toàn bộ JS. Hằng `DAY_COUNT = 7`, `STEP_ANGLE = 360 / DAY_COUNT`; lấy phần tử bằng `querySelector('[data-...]')`, chuyển danh sách thẻ thành mảng bằng `Array.from(ring.querySelectorAll('[data-day]'))`; object `state = { turns: ... }`. Viết `wrap(value)` trả `((value % DAY_COUNT) + DAY_COUNT) % DAY_COUNT` và `getActive()` trả `wrap(state.turns)`. **Bẫy nhỏ:** thử trước `-1 % 7` ở Console để thấy `-1`, rồi mới đổi sang công thức cuộn tròn. Kiểm tra: `wrap(-1)` ra `6`, `wrap(8)` ra `1`, `wrap(-8)` ra `6`.

3. **JS: đặt thẻ vào vòng và vẽ trạng thái.** **Bạn làm:** toàn bộ JS. Với mỗi thẻ (`forEach` có tham số thứ hai là chỉ số) gọi `style.setProperty('--a', index * STEP_ANGLE + 'deg')`. Viết `render()`: tính `active`, `ring.style.setProperty('--rot', -state.turns * STEP_ANGLE + 'deg')`; mỗi thẻ `toggleAttribute('data-active', index === active)` và `setAttribute('aria-hidden', String(index !== active))`; mỗi nút `data-jump` ghi `aria-pressed`; `detail.textContent` ghép từ `dataset.name`, `dataset.dish`, `dataset.kcal` của thẻ đang xem. Kiểm tra: gọi `state.turns = 3; render()` ở Console, vòng quay tới Thứ Năm, câu mô tả đổi theo, nhãn T5 nổi lên.

4. **JS: điều khiển, kể cả đường ngắn nhất.** **Bạn làm:** toàn bộ JS. Listener `click` ở `data-app`: `closest('[data-step]')` thì cộng `Number(dataset.step)` vào `state.turns`; `closest('[data-jump]')` thì gọi `turnTo(index)`. `turnTo(index)`: `delta = wrap(index - getActive())`, nếu `delta > DAY_COUNT / 2` thì `delta -= DAY_COUNT`, rồi cộng vào `state.turns` và `render()`. Thêm `keydown` ở `document` với `event.key` là `ArrowLeft`/`ArrowRight`. **Bẫy JS:** nếu bạn tính góc từ chỉ số (`-active * STEP_ANGLE`) thay vì `state.turns`, bấm → từ Chủ nhật sẽ làm vòng quay ngược gần cả vòng. Kiểm tra: đang ở Thứ Bảy, bấm → hai lần rồi nhìn `--rot` (nó phải tiếp tục tăng độ lớn, không nhảy về 0); nhảy từ T7 sang CN chỉ xoay một bước.

5. **JS: hôm nay.** **Bạn làm:** toàn bộ JS. `new Date().getDay()` trả 0 là Chủ nhật, 1 là Thứ Hai, … nên chỉ số của thực đơn (Thứ Hai là 0) là `(getDay() + 6) % 7`. Dùng nó làm `turns` ban đầu, `toggleAttribute('data-today', index === todayIndex)` cho đúng thẻ, và ghi dòng `Hôm nay: ...` bằng `new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())`. Kiểm tra: mở trang, vòng dừng ở đúng thứ hôm nay, có nhãn cam "Hôm nay" trên thẻ đó. Đổi ngày hệ thống hoặc gọi thử `(new Date(2026, 10, 29).getDay() + 6) % 7` ra `6` (Chủ nhật).

6. **CSS: bộ lọc cho hai mặt cuối.** **Bạn làm:** thêm `brightness-50 transition-[filter] duration-500 group-data-active:brightness-100 motion-reduce:transition-none` vào hai thẻ `<div>` mặt trong `<li>` Thứ Bảy và Chủ nhật (chép theo 5 mặt đầu). `brightness-50` đặt `filter: brightness(0.5)` làm thẻ tối đi một nửa; `group-data-active:brightness-100` trả về sáng bình thường khi thẻ cha (`group`) có `data-active`; `transition-[filter]` cho phép đổi mượt (một nhóm riêng vì `transition-transform` không bao gồm `filter`). Kiểm tra: xoay tới Thứ Bảy, thẻ này sáng dần còn Thứ Sáu tối dần.

7. **Cái bẫy: bộ lọc trên phần tử `preserve-3d`.** **Bạn làm:** thêm `brightness-75` vào `<ul data-ring>` (cách "tiện" để làm dịu cả vòng). Thấy gì: vòng quay **mất chiều sâu**, các thẻ trông như xếp phẳng một dải, không còn xa gần. Rồi sửa: **gỡ** `brightness-75` khỏi `<ul data-ring>` (nếu muốn dịu màu thì chỉnh số trong `brightness-*` ở mặt thẻ). Kiểm tra: DevTools, tab Computed của `<ul data-ring>` vẫn ghi `transform-style: preserve-3d` (giá trị đã khai), nhưng giá trị **dùng thực tế** là `flat`, nên bật tắt `brightness-75` rồi nhìn vòng quay mới là cách kiểm tra đúng. Thử tiếp `opacity-90` và `overflow-hidden` trên `<ul data-ring>` để thấy cùng kết quả.

8. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra, đặc biệt thử vòng quay liên tục một chiều và bàn phím.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `perspective-midrange` | `perspective: 800px` |
| `transform-3d` | `transform-style: preserve-3d` |
| `rotate-y-(--a)` | `transform: rotateY(var(--a))` |
| `-translate-z-38` | `translate: 0 0 -152px` (Tailwind) hoặc `translateZ(-152px)` |
| `translate-z-38` | `translateZ(152px)` |
| `brightness-50` | `filter: brightness(0.5)` |
| `group-data-active:brightness-100` | `.day[data-active] .face { filter: brightness(1) }` |
| `transition-[filter] duration-500` | `transition: filter 500ms` |
| `backface-hidden` | `backface-visibility: hidden` |
| `group-data-today:block` | `.day[data-today] .today-badge { display: block }` |

## Tự kiểm tra

- [ ] Mở trang: vòng dừng ở đúng thứ hôm nay, thẻ giữa sáng rõ, hai thẻ bên tối và nghiêng; không thấy thẻ ở phía sau vòng.
- [ ] Bấm → liên tục 8 lần: vòng luôn xoay cùng chiều, không có lần nào quay ngược. Console: `getComputedStyle(document.querySelector('[data-ring]')).getPropertyValue('--rot')` luôn đổi theo cùng hướng.
- [ ] Bấm ← từ Thứ Hai: sang Chủ nhật, câu mô tả đúng, vòng xoay một bước (không xoay 6 bước ngược lại).
- [ ] Bấm nhãn T2 khi đang ở T7: xoay ngắn nhất (3 bước, chiều nào ngắn hơn). Bấm đúng nhãn đang xem: không đổi.
- [ ] DevTools: gỡ `group-data-active:brightness-100` của một mặt thì mặt đó luôn tối; thêm `brightness-75` vào vòng thì phẳng (Computed vẫn ghi `preserve-3d` nhưng giá trị dùng thực tế là `flat`).
- [ ] Bàn phím: Tab qua ←, bảy nhãn, →, viền focus rõ; mũi tên trái phải xoay vòng; Enter ở nhãn nhảy ngày.
- [ ] Trình đọc màn hình (hoặc DevTools, Accessibility): chỉ thẻ đang xem không bị `aria-hidden`; câu mô tả cập nhật (`aria-live="polite"`).
- [ ] Bật `prefers-reduced-motion: reduce`: vòng nhảy ngay tới ngày mới, độ sáng đổi tức thì (`motion-reduce:transition-none`).
- [ ] Tự hỏi: vì sao góc của vòng dùng `turns` chứ không dùng chỉ số ngày? Vì sao `-1 % 7` không ra `6`? Vì sao bộ lọc ở phần tử `preserve-3d` phá 3D còn ở phần tử con thì không?

## Thử thách thêm

1. Kéo bằng chuột: dùng Pointer Events (`pointerdown`, `pointermove`, `setPointerCapture`) để kéo ngang xoay vòng; khi thả chuột làm tròn `state.turns` bằng `Math.round`. Nhớ tắt `transition` trong lúc kéo bằng một `data-dragging` (`data-dragging:transition-none`).
2. Thêm "bóng sàn": một đĩa `absolute` nằm dưới vòng với `rotate-x-90`, nền `radial-gradient` mờ, `pointer-events-none`. Thử xem đặt nó trong vòng và ngoài vòng khác nhau thế nào khi vòng quay.

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
		<title>Bài 027 - Vòng quay thực đơn</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main data-app class="app">
			<h1 class="title">Thực đơn cả tuần</h1>
			<p data-today-note class="today-note"></p>
			<div class="stage">
				<ul data-ring aria-label="Thực đơn theo ngày" class="ring">
					<li data-day data-name="Thứ Hai" data-dish="Bún chả" data-kcal="620" class="day">
						<div class="face">
							<p class="face-day">Thứ Hai</p>
							<p class="face-emoji">🍜</p>
							<p class="face-dish">Bún chả</p>
							<span class="today-badge">Hôm nay</span>
						</div>
					</li>
					<li data-day data-name="Thứ Ba" data-dish="Canh chua cá" data-kcal="480" class="day">
						<div class="face">
							<p class="face-day">Thứ Ba</p>
							<p class="face-emoji">🍲</p>
							<p class="face-dish">Canh chua cá</p>
							<span class="today-badge">Hôm nay</span>
						</div>
					</li>
					<li data-day data-name="Thứ Tư" data-dish="Cơm gà xối mỡ" data-kcal="710" class="day">
						<div class="face">
							<p class="face-day">Thứ Tư</p>
							<p class="face-emoji">🍛</p>
							<p class="face-dish">Cơm gà xối mỡ</p>
							<span class="today-badge">Hôm nay</span>
						</div>
					</li>
					<li data-day data-name="Thứ Năm" data-dish="Gỏi cuốn" data-kcal="390" class="day">
						<div class="face">
							<p class="face-day">Thứ Năm</p>
							<p class="face-emoji">🥗</p>
							<p class="face-dish">Gỏi cuốn</p>
							<span class="today-badge">Hôm nay</span>
						</div>
					</li>
					<li data-day data-name="Thứ Sáu" data-dish="Tôm rim" data-kcal="520" class="day">
						<div class="face">
							<p class="face-day">Thứ Sáu</p>
							<p class="face-emoji">🍤</p>
							<p class="face-dish">Tôm rim</p>
							<span class="today-badge">Hôm nay</span>
						</div>
					</li>
					<li data-day data-name="Thứ Bảy" data-dish="Lẩu nấm" data-kcal="450" class="day">
						<div class="face">
							<p class="face-day">Thứ Bảy</p>
							<p class="face-emoji">🥘</p>
							<p class="face-dish">Lẩu nấm</p>
							<span class="today-badge">Hôm nay</span>
						</div>
					</li>
					<li data-day data-name="Chủ nhật" data-dish="Bò nướng lá lốt" data-kcal="560" class="day">
						<div class="face">
							<p class="face-day">Chủ nhật</p>
							<p class="face-emoji">🥩</p>
							<p class="face-dish">Bò nướng lá lốt</p>
							<span class="today-badge">Hôm nay</span>
						</div>
					</li>
				</ul>
			</div>
			<p data-detail aria-live="polite" class="detail"></p>
			<div class="controls">
				<button type="button" data-step="-1" aria-label="Ngày trước" class="arrow">←</button>
				<div role="group" aria-label="Chọn ngày" class="chips">
					<button type="button" data-jump="0" aria-pressed="false" aria-label="Thứ Hai" class="chip">T2</button>
					<button type="button" data-jump="1" aria-pressed="false" aria-label="Thứ Ba" class="chip">T3</button>
					<button type="button" data-jump="2" aria-pressed="false" aria-label="Thứ Tư" class="chip">T4</button>
					<button type="button" data-jump="3" aria-pressed="false" aria-label="Thứ Năm" class="chip">T5</button>
					<button type="button" data-jump="4" aria-pressed="false" aria-label="Thứ Sáu" class="chip">T6</button>
					<button type="button" data-jump="5" aria-pressed="false" aria-label="Thứ Bảy" class="chip">T7</button>
					<button type="button" data-jump="6" aria-pressed="false" aria-label="Chủ nhật" class="chip">CN</button>
				</div>
				<button type="button" data-step="1" aria-label="Ngày sau" class="arrow">→</button>
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
	font: inherit;
	color: inherit;
	background: none;
	border: 0;
	cursor: pointer;
}

ul {
	list-style: none;
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
	color: #fff7ed;
	background: linear-gradient(to bottom, #0c0a09, #431407);
}

.app {
	margin: 0 auto;
	max-width: 448px;
}

.today-note {
	margin-top: 4px;
	font-size: 14px;
	line-height: 20px;
	color: #fed7aa;
}

.stage {
	margin: 16px auto 0;
	height: 240px;
	width: 100%;
	max-width: 384px;
	padding-top: 24px;
	perspective: 800px;
}

.ring {
	position: relative;
	margin: 0 auto;
	height: 192px;
	width: 144px;
	transform: translateZ(-152px) rotateY(var(--rot));
	transform-style: preserve-3d;
	transition: transform 700ms ease-out;
}

.day {
	position: absolute;
	inset: 0;
	transform: rotateY(var(--a));
	transform-style: preserve-3d;
}

.face {
	position: relative;
	display: flex;
	height: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
	border: 1px solid #fed7aa;
	border-radius: 16px;
	background: #fff7ed;
	padding: 12px;
	text-align: center;
	color: #1c1917;
	transform: translateZ(152px);
	backface-visibility: hidden;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	filter: brightness(0.5);
	transition: filter 500ms;
}

.day[data-active] .face {
	filter: brightness(1);
}

.face-day {
	font-size: 12px;
	line-height: 16px;
	font-weight: 600;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}

.face-emoji {
	font-size: 36px;
	line-height: 40px;
}

.face-dish {
	font-weight: 600;
}

.today-badge {
	position: absolute;
	top: -8px;
	display: none;
	border-radius: 9999px;
	background: #f97316;
	padding: 2px 8px;
	font-size: 12px;
	line-height: 16px;
	font-weight: 600;
	color: #ffffff;
}

.day[data-today] .today-badge {
	display: block;
}

.detail {
	margin-top: 16px;
	min-height: 48px;
	text-align: center;
	font-size: 14px;
	line-height: 20px;
	color: #ffedd5;
}

.controls {
	margin-top: 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
}

.arrow {
	flex-shrink: 0;
	width: 40px;
	height: 40px;
	border-radius: 9999px;
	background: rgb(255 237 213 / 0.1);
	font-size: 18px;
	line-height: 28px;
	transition: transform 150ms;
}

.arrow:hover {
	transform: translateY(-2px);
}

.chips {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 6px;
}

.chip {
	border: 1px solid rgb(254 215 170 / 0.3);
	border-radius: 9999px;
	padding: 4px 12px;
	font-size: 14px;
	line-height: 20px;
	transition: background-color 150ms, border-color 150ms, color 150ms;
}

.chip[aria-pressed="true"] {
	border-color: #fdba74;
	background: #fdba74;
	color: #0c0a09;
}

.arrow:focus-visible,
.chip:focus-visible {
	outline: 2px solid #fdba74;
	outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
	.ring,
	.face,
	.arrow,
	.chip {
		transition: none;
	}
}
```

`solution/script.js`

```js
const DAY_COUNT = 7;
const STEP_ANGLE = 360 / DAY_COUNT;

const app = document.querySelector('[data-app]');
const ring = app.querySelector('[data-ring]');
const days = Array.from(ring.querySelectorAll('[data-day]'));
const jumpButtons = app.querySelectorAll('[data-jump]');
const detail = app.querySelector('[data-detail]');
const todayNote = app.querySelector('[data-today-note]');

const todayFormatter = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
const todayIndex = (new Date().getDay() + 6) % DAY_COUNT;
const state = { turns: todayIndex };

function wrap(value) {
	return ((value % DAY_COUNT) + DAY_COUNT) % DAY_COUNT;
}

function getActive() {
	return wrap(state.turns);
}

function render() {
	const active = getActive();
	const activeDay = days[active];
	ring.style.setProperty('--rot', -state.turns * STEP_ANGLE + 'deg');
	days.forEach(function (day, index) {
		day.toggleAttribute('data-active', index === active);
		day.setAttribute('aria-hidden', String(index !== active));
	});
	jumpButtons.forEach(function (button) {
		button.setAttribute('aria-pressed', String(Number(button.dataset.jump) === active));
	});
	detail.textContent = activeDay.dataset.name + ': ' + activeDay.dataset.dish + ', khoảng ' + activeDay.dataset.kcal + ' kcal.';
}

function turnTo(index) {
	let delta = wrap(index - getActive());
	if (delta > DAY_COUNT / 2) {
		delta -= DAY_COUNT;
	}
	state.turns += delta;
	render();
}

function handleClick(event) {
	const stepButton = event.target.closest('[data-step]');
	if (stepButton) {
		state.turns += Number(stepButton.dataset.step);
		render();
		return;
	}
	const jumpButton = event.target.closest('[data-jump]');
	if (jumpButton) {
		turnTo(Number(jumpButton.dataset.jump));
	}
}

function handleKeydown(event) {
	if (event.key === 'ArrowLeft') {
		state.turns -= 1;
		render();
	} else if (event.key === 'ArrowRight') {
		state.turns += 1;
		render();
	}
}

days.forEach(function (day, index) {
	day.style.setProperty('--a', index * STEP_ANGLE + 'deg');
	day.toggleAttribute('data-today', index === todayIndex);
});
todayNote.textContent = 'Hôm nay: ' + todayFormatter.format(new Date());
app.addEventListener('click', handleClick);
document.addEventListener('keydown', handleKeydown);
render();
```

</details>

### Giải thích từng hàm

- `wrap(value)`: trả số nguyên trong khoảng 0 đến 6. `value % DAY_COUNT` là phép chia dư (có thể âm với số âm); cộng thêm `DAY_COUNT` đưa về dương, rồi `% DAY_COUNT` lần nữa cuộn tròn về 0–6. Ví dụ `wrap(-1)`: `-1 % 7` ra `-1`, cộng 7 ra `6`, `6 % 7` ra `6`.
- `getActive()`: trả chỉ số ngày đang xem bằng `wrap(state.turns)`.
- `render()`: vẽ lại từ `state`. `ring.style.setProperty('--rot', ...)` ghi biến CSS `--rot` (nhận tên biến và giá trị chuỗi, ví dụ `'-257deg'`); `-state.turns * STEP_ANGLE + 'deg'` nhân trước rồi `+` ghép chuỗi `'deg'`; `days.forEach(function (day, index) {...})` hàm nhận phần tử và chỉ số; `day.toggleAttribute('data-active', index === active)`: có tham số thứ hai `force`, `true` thì luôn bật thuộc tính, `false` thì luôn tắt (khác `toggleAttribute(tên)` một tham số là đảo trạng thái); `String(index !== active)` đổi `true`/`false` thành chuỗi `"true"`/`"false"` (vì `setAttribute` chỉ nhận chuỗi; `!==` là "không bằng chặt"); `Number(button.dataset.jump) === active` đổi chuỗi trong `dataset` thành số trước khi so; `activeDay.dataset.name` đọc thuộc tính `data-name`.
- `turnTo(index)`: `let delta` vì sẽ gán lại; `wrap(index - getActive())` cho số bước xoay theo chiều dương trong 0–6; `delta > DAY_COUNT / 2` (7 / 2 = 3,5) thì `delta -= DAY_COUNT` (toán tử `-=` là "trừ rồi gán"); `state.turns += delta` cộng dồn (không cuộn tròn) để vòng quay liên tục.
- `handleClick(event)`: uỷ quyền ở `data-app`. `event.target.closest(selector)` đi ngược lên cây DOM tìm phần tử khớp, trả `null` nếu không có; `Number(stepButton.dataset.step)` đổi `"-1"` hoặc `"1"` thành số; mỗi nhánh `return` sớm để không chạy tiếp.
- `handleKeydown(event)`: `event.key` là tên phím (`'ArrowLeft'`, `'ArrowRight'`); `state.turns -= 1` là trừ rồi gán; cấu trúc `if ... else if ...` chỉ chạy một nhánh.
- `Array.from(ring.querySelectorAll('[data-day]'))`: `querySelectorAll` trả `NodeList` (danh sách giống mảng, có `forEach` nhưng thiếu nhiều phương thức); `Array.from(...)` chuyển nó thành mảng thật. Selector `[data-day]` khớp mọi phần tử có thuộc tính đó.
- `new Date().getDay()`: trả số thứ trong tuần theo giờ máy, 0 là Chủ nhật; `(getDay() + 6) % DAY_COUNT` đổi sang thang Thứ Hai là 0. `new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })` tạo bộ định dạng ngày tiếng Việt; `.format(new Date())` trả chuỗi như `Thứ Bảy, 28 tháng 11`.
- `app.addEventListener('click', handleClick)`, `document.addEventListener('keydown', handleKeydown)`: đăng ký hàm bằng cách truyền tên hàm, không có `()`. `const state = { turns: todayIndex }` giữ nguyên tham chiếu nhưng vẫn sửa được `state.turns`.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Tailwind trong starter | CSS trong `solution/style.css` |
|---|---|
| `mx-auto mt-4 h-60 w-full max-w-sm perspective-midrange pt-6` | `.stage { margin: 16px auto 0; height: 240px; width: 100%; max-width: 384px; padding-top: 24px; perspective: 800px }` |
| `relative mx-auto h-48 w-36 -translate-z-38 transform-3d rotate-y-(--rot) transition-transform duration-700 ease-out` | `.ring { position: relative; margin: 0 auto; height: 192px; width: 144px; transform: translateZ(-152px) rotateY(var(--rot)); transform-style: preserve-3d; transition: transform 700ms ease-out }` |
| `group absolute inset-0 transform-3d rotate-y-(--a)` | `.day { position: absolute; inset: 0; transform: rotateY(var(--a)); transform-style: preserve-3d }` |
| `translate-z-38 backface-hidden ... brightness-50 transition-[filter] duration-500 group-data-active:brightness-100` | `.face { transform: translateZ(152px); backface-visibility: hidden; filter: brightness(0.5); transition: filter 500ms }` và `.day[data-active] .face { filter: brightness(1) }` |
| `hidden ... group-data-today:block` | `.today-badge { display: none }` và `.day[data-today] .today-badge { display: block }` |
| `aria-pressed:border-orange-300 aria-pressed:bg-orange-300 aria-pressed:text-stone-950` | `.chip[aria-pressed="true"] { border-color: #fdba74; background: #fdba74; color: #0c0a09 }` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { .ring, .face, .arrow, .chip { transition: none } }` |

Khác biệt nhỏ: Tailwind v4 áp `translate-z-*` bằng thuộc tính `translate` riêng và `rotate-y-*` bằng `transform`; trình duyệt áp `translate` trước `transform`, nên kết quả giống `transform: translateZ(...) rotateY(...)` viết trong bản thuần.
