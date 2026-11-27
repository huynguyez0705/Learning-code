# Bài 025: Ví chi tiêu kính mờ, kính lồng kính, `localStorage` đồng bộ hai tab

Ngày học 9, bài 3/3, cấp 2, chủ đề CSS: Glassmorphism (ứng dụng ví chi tiêu), độ khó ★★★★★, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này lưu **danh sách khoản chi** bằng `localStorage` (khoá `bai-025-chi-tieu`). Lần đầu mở (chưa có khoá) sẽ nạp 4 khoản mẫu. Nhóm đang lọc, thông báo và khoản vừa xoá (để hoàn tác) **không** được lưu.

## Mục tiêu

- Thêm khoản chi qua form (số tiền, nhóm, ghi chú, ngày) bằng `reportValidity()`: bỏ trống hoặc ghi chú toàn dấu cách thì **không** thêm và con trỏ nhảy tới ô sai; hợp lệ thì khoản mới lên đầu danh sách và ô số tiền được focus.
- Danh sách sắp xếp ngày mới trước, lọc theo nhóm (Tất cả, Ăn uống, Di chuyển, Mua sắm, Giải trí); dòng tổng hiện tiền đồng đầy đủ (`1.205.000 ₫`) kèm dạng rút gọn ở dòng dưới (`khoảng 1,2 Tr ₫`).
- Xoá một khoản thì hiện thông báo nổi có nút "Hoàn tác" trong 5 giây; hoàn tác đưa khoản chi về **đúng vị trí cũ** và trả focus về nút ✕ của nó. Gõ liên tiếp nhiều lần xoá không làm thông báo biến mất sớm (bẫy hẹn giờ cũ).
- Tải lại trang, khoản chi còn nguyên. Mở trang ở **hai tab**, xoá một khoản ở tab này thì tab kia tự cập nhật nhờ sự kiện `storage`.
- Thẻ chính là kính mờ (`backdrop-blur-xl`, viền sáng, vòng sáng bên trong) **và** thông báo nổi cũng là kính mờ, cố định ở đáy **cửa sổ** (không dính vào đáy thẻ).

## Kết quả mong đợi

Nền tím sang đỏ với ba hình tròn màu cyan, hồng, vàng. Giữa trang là một thẻ kính trong mờ, nhìn xuyên thấy các hình tròn bị làm nhoè. Trong thẻ: tiêu đề, tổng tiền lớn, dòng tóm tắt, hàng nút lọc, form bốn ô và nút "Thêm khoản chi", rồi danh sách các dòng kính nhỏ có chấm màu theo nhóm, số tiền và nút ✕. Khi xoá, một thanh kính mờ nổi lên ở đáy màn hình với chữ `Đã xoá "..."` và nút "Hoàn tác".

## Tư duy

**State một nơi, lưu và vẽ tách riêng.** `state = { items, filter, removed }`. Mọi thao tác sửa `state.items`, gọi `saveItems()` (ghi `localStorage`) rồi `render()` (vẽ lại danh sách từ `state`). `filter` và `removed` chỉ sống trong bộ nhớ.

**`checkValidity()` và `reportValidity()`.** Cả hai đều hỏi "form hợp lệ chưa?" và trả `true`/`false`. `reportValidity()` còn **hiện bong bóng báo lỗi** và focus ô sai đầu tiên; `checkValidity()` thì im lặng. Form có `novalidate` để trình duyệt không tự chặn lúc gửi, ta tự gọi `reportValidity()` trong `submit`. Thuộc tính `pattern=".*\S.*"` bắt buộc có ít nhất một ký tự không phải dấu cách, nếu không ghi chú `"   "` vẫn qua được `required`.

**Hoàn tác = nhớ cả vị trí.** Xoá bằng `splice(index, 1)` trả về mảng các phần tử bị cắt; ta giữ `{ item, index }`. Hoàn tác là `splice(index, 0, item)`: chèn lại tại vị trí `index` mà không xoá gì. Giống rút một cuốn sách khỏi kệ: nhớ ô trống ở đâu để trả lại.

**Sự kiện `storage` chỉ nổ ở các tab khác.** Khi tab A gọi `localStorage.setItem`, trình duyệt gửi sự kiện `storage` đến **mọi tab khác** cùng nguồn, **không** gửi cho chính tab A. Tab B nghe sự kiện, đọc lại `localStorage` rồi `render()` là hai tab luôn khớp nhau.

**Ngày dạng chuỗi và múi giờ.** `new Date('2026-11-20')` hiểu là 00:00 **UTC**. Nếu định dạng bằng múi giờ địa phương ở nơi chậm hơn UTC, ngày có thể lùi một ngày. Ta ép `timeZone: 'UTC'` khi định dạng để chuỗi ngày hiện đúng như đã lưu.

**Cái bẫy CSS: kính lồng kính.** `backdrop-filter` trên một phần tử làm hai việc ngầm. (1) Nó trở thành **khung tham chiếu** của mọi con `position: fixed`: thông báo `fixed bottom-4` bên trong thẻ sẽ bám vào **đáy thẻ** chứ không phải đáy cửa sổ. (2) Nó là **gốc của backdrop**: một con cũng có `backdrop-blur` chỉ "nhìn thấy" nền bên trong thẻ cha, không còn nhìn thấy trang phía sau nên mất hiệu ứng kính. Cách chữa: **đừng đặt `backdrop-blur` lên thẻ cha**. Tách thẻ cha thành hai lớp: một lớp kính `absolute inset-0 -z-10` (nằm sau nội dung, có `backdrop-blur-xl`) và nội dung đứng cạnh nó chứ không nằm trong nó. Thông báo giờ không còn là con của phần tử có `backdrop-filter`. Giống kính cửa sổ ô tô dán màng: nếu dán màng lên cả khung cửa thì mọi thứ gắn vào khung (gương, đồ treo) cũng bị cái màng chi phối; dán đúng tấm kính thì chỉ tấm kính bị ảnh hưởng.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Lớp kính `absolute inset-0 -z-10 backdrop-blur-xl bg-white/15`, viền sáng `inset-ring-1 inset-ring-white/30 border-t-white/50` | Không làm gì: kính là việc của CSS |
| Thông báo `fixed inset-x-4 bottom-4 backdrop-blur-md` | Ghi `hidden` cho thông báo và nút "Hoàn tác" |
| `group-data-[category=an-uong]:bg-amber-300` ... chấm màu theo nhóm | Ghi `dataset.category` cho từng dòng |
| `aria-pressed:border-white aria-pressed:bg-white/25` nút lọc | Ghi `aria-pressed`; lọc, sắp xếp, tính tổng |
| Nút và chip `hover:-translate-y-0.5` | Kiểm tra form, thêm, xoá, hoàn tác, `localStorage`, `storage` |

JS không thêm hoặc gỡ class, không đặt `style.display` hay `style.position`, không tìm phần tử bằng class.

## Ôn lại

- Bài 009 (`bai-009-quiz-kinh-mo`): `backdrop-blur-md`, `-z-10` và `isolate`; bài 017 (`bai-017-dong-ho-bam-gio-kinh-mo`): `backdrop-blur-xl`.
- Bài 003 (`bai-003-hop-thoai-xac-nhan`): `fixed` bị tổ tiên có `transform` giữ lại (bài này là phiên bản `backdrop-filter`).
- Bài 020 (`bai-020-ghi-chu-kinh-mo`) và bài 022 (`bai-022-so-cong-thuc`): `localStorage` với `JSON.stringify`/`JSON.parse`, `template`, `replaceChildren`.
- Bài 021 (`bai-021-dang-ky-thanh-vien`): kiểm tra form, `validity`, `Intl.DateTimeFormat` với `timeZone: 'UTC'`; bài 008 và bài 022: `setTimeout`/`clearTimeout`.
- Bài 012 (`bai-012-vi-the-anh-sang`): `Object.fromEntries(new FormData(form))`; bài 016: `findIndex`, trả focus sau khi vẽ lại.

## Gợi ý từng bước

> Starter đã điền sẵn: nền gradient và ba hình tròn (`overflow-clip` để hình tròn không làm trang cuộn ngang), thẻ `relative isolate rounded-3xl`, lớp `data-glass` với `absolute inset-0 -z-10 rounded-3xl border border-white/25 bg-white/15 shadow-xl` (chưa có blur và viền sáng), tiêu đề, tổng tiền, bốn nút lọc `aria-pressed:`, form bốn ô, danh sách, thông báo `fixed` (chưa có blur), `<template>` với dòng có chấm màu `group-data-[category=...]:`. Bạn tự thêm một nhóm class mới: **kính, viền sáng và bẫy kính lồng kính**.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc `data-app`, `data-glass`, `data-total`, `data-summary`, `data-filter` (năm nút), `data-form` (các ô `name`: `amount`, `category`, `note`, `date`), `data-empty`, `data-list`, `data-toast` với `data-toast-text` và `data-undo`, và `<template data-item-template>` với `data-item`, `data-note`, `data-meta`, `data-amount`, `data-remove`. Kiểm tra: mở trang thấy nền màu, thẻ chưa nhoè, danh sách trống.

2. **JS: dữ liệu, `localStorage`, bộ định dạng.** **Bạn làm:** toàn bộ JS. Mảng `sample` 4 khoản `{ id, amount, category, note, date }` (ngày dạng `YYYY-MM-DD`), object `categoryNames`; `loadItems()` (`getItem`, trả `sample.slice()` khi `null`, còn lại `JSON.parse`) và `saveItems()` (`setItem` + `JSON.stringify`); ba bộ định dạng: `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`, `Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 })`, `Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short', timeZone: 'UTC' })`; object `state`. Kiểm tra: ở Console, `moneyFormatter.format(45000)` ra `45.000 ₫`, `compactFormatter.format(1250000)` ra `1,3 Tr`.

3. **JS: vẽ danh sách, lọc, sắp xếp, tổng, nút lọc.** **Bạn làm:** toàn bộ JS. `getVisible()` dùng `filter` rồi `sort` với `localeCompare` (ngày `YYYY-MM-DD` so sánh chuỗi là đúng thứ tự thời gian), `createItem(item)` nhân bản template (`cloneNode(true)`, `dataset.id`, `dataset.category`, `textContent`, `setAttribute('aria-label', ...)`), `render()` dùng `reduce` tính tổng, `replaceChildren(...visible.map(createItem))`, thuộc tính `hidden` cho dòng trống, `aria-pressed` cho nút lọc. Thêm một listener `click` ở `data-app` dùng `closest('[data-filter]')` để ghi `state.filter` rồi `render()` (uỷ quyền sự kiện: một listener cho cả năm nút). Kiểm tra: 4 dòng, chấm màu đúng nhóm (đã điền sẵn), tổng `1.205.000 ₫`; bấm "Ăn uống" còn 1 dòng, tổng đổi, nút đó viền sáng.

4. **JS: form, `reportValidity`, thêm khoản chi.** **Bạn làm:** toàn bộ JS. Listener `submit` ở form: `preventDefault()`, nếu `!form.reportValidity()` thì `return`. Gom dữ liệu bằng `Object.fromEntries(new FormData(form))`, `unshift` một object mới (`id: Date.now()`, `Number(data.amount)`, `data.note.trim()`), đặt `state.filter = 'all'`, `saveItems()`, `form.reset()`, đặt lại ngày hôm nay (`new Intl.DateTimeFormat('en-CA').format(new Date())` cho ra `YYYY-MM-DD`; ô ngày còn cần `max` là hôm nay), `render()`, `form.elements.amount.focus()`. **Bẫy nhỏ:** sau `form.reset()` ô ngày về trống (vì giá trị mặc định ở HTML là rỗng): phải gán lại. Kiểm tra: bấm "Thêm" khi trống thì có bong bóng lỗi, focus nhảy vào ô số tiền; nhập ghi chú `   ` (3 dấu cách) cũng bị chặn; hợp lệ thì khoản mới ở đầu.

5. **JS: xoá, hoàn tác, thông báo.** **Bạn làm:** toàn bộ JS. `showToast(text, canUndo)`: `clearTimeout` hẹn giờ cũ rồi `setTimeout(hideToast, 5000)` mới (nếu quên `clearTimeout`, xoá hai khoản liên tiếp thì thông báo thứ hai bị hẹn giờ của thông báo đầu tắt sớm); `removeItem(id)` dùng `findIndex` rồi `splice(index, 1)[0]`, nhớ `{ item, index }` trong `state.removed`, lưu, vẽ lại, hiện thông báo và `focus()` vào nút "Hoàn tác"; `undoRemove()` chèn lại bằng `splice(index, 0, item)`, đặt `filter` về `all`, vẽ lại và trả focus về nút ✕ của khoản vừa khôi phục (`querySelector('[data-id="..."] [data-remove]')`). Thêm hai nhánh vào `handleClick`: `closest('[data-remove]')` và `closest('[data-undo]')`. Kiểm tra: xoá giữa danh sách, hoàn tác, khoản về đúng chỗ; sau 5 giây thông báo tự tắt và không thể hoàn tác nữa.

6. **JS: đồng bộ hai tab.** **Bạn làm:** toàn bộ JS. `window.addEventListener('storage', handleStorage)`; trong hàm chỉ xử lý khi `event.key === STORAGE_KEY`, đọc lại `loadItems()` rồi `render()`. Kiểm tra: mở trang ở hai tab, xoá một khoản ở tab 1, nhìn sang tab 2 danh sách đã đổi mà không cần tải lại (tab 1 thì không nhận sự kiện của chính nó).

7. **CSS: kính, viền sáng và cái bẫy kính lồng kính.** **Bạn làm:** thêm `backdrop-blur-xl` lên `<main data-app>` **trước** (cách "hiển nhiên" nhất) và `backdrop-blur-md` lên `<div data-toast>`; xoá một khoản để thấy thông báo. Thấy gì: thông báo **không** nằm đáy cửa sổ mà dính trong đáy thẻ, và chữ phía sau nó không bị nhoè. Rồi sửa: **gỡ** `backdrop-blur-xl` khỏi `<main>` và thêm vào `<div data-glass>` cùng `inset-ring-1 inset-ring-white/30 border-t-white/50`. Thông báo ra đáy cửa sổ và bắt đầu nhoè nền thật. `inset-ring-1 inset-ring-white/30` vẽ vòng sáng 1px bên **trong** viền (một lớp `box-shadow` inset) cộng chung với `shadow-xl`; `border-t-white/50` làm riêng cạnh trên sáng hơn như mép kính hắt sáng. Kiểm tra: DevTools, bật tắt `backdrop-blur-xl` ở `<main>` và `data-glass`, quan sát `getBoundingClientRect()` của thông báo (`$0.getBoundingClientRect().bottom` bằng chiều cao cửa sổ trừ 16 khi đúng).

8. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra, đặc biệt thử bàn phím và hai tab.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `backdrop-blur-xl` | `backdrop-filter: blur(24px)` |
| `backdrop-blur-md` | `backdrop-filter: blur(12px)` |
| `inset-ring-1 inset-ring-white/30` | `box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.3)` |
| `border-t-white/50` | `border-top-color: rgb(255 255 255 / 0.5)` |
| `absolute inset-0 -z-10` (trong thẻ `relative isolate`) | `position: absolute; inset: 0; z-index: -10` (thẻ cha có `isolation: isolate`) |
| `fixed inset-x-4 bottom-4 mx-auto max-w-sm` | `position: fixed; left: 16px; right: 16px; bottom: 16px; margin: 0 auto; max-width: 384px` |
| `group-data-[category=an-uong]:bg-amber-300` | `.item[data-category="an-uong"] .dot { background: #fcd34d }` |
| `overflow-clip` | `overflow: clip` (cắt phần thừa và không cho cuộn kể cả bằng `focus()`) |

## Tự kiểm tra

- [ ] Thêm khoản "Trà sữa" 55.000 nhóm Ăn uống ngày hôm nay: lên đầu danh sách, tổng tăng 55.000, ô ngày về hôm nay, focus ở ô số tiền. Số tiền 500 (dưới `min` 1000) hoặc 1500 (lệch `step`) bị chặn với bong bóng báo lỗi.
- [ ] Ghi chú 1 ký tự bị chặn (`minlength`), ghi chú toàn dấu cách bị chặn (`pattern`). Ngày trong tương lai bị chặn (`max`).
- [ ] Lọc từng nhóm: danh sách và tổng đổi đúng; thêm khoản mới khi đang lọc thì bộ lọc về "Tất cả" để thấy khoản vừa thêm.
- [ ] Xoá, hoàn tác: khoản về đúng vị trí cũ (kể cả khoản cuối, khoản đầu). Xoá hai khoản cách nhau 3 giây: thông báo của khoản thứ hai sống đủ 5 giây kể từ lúc xoá thứ hai.
- [ ] Tải lại trang: dữ liệu còn nguyên. Application, Local Storage thấy `bai-025-chi-tieu`; sửa tay giá trị thành `[]` rồi tải lại thấy danh sách trống và dòng "Chưa có khoản chi nào.".
- [ ] Hai tab: xoá hoặc thêm ở tab này thì tab kia đổi theo trong chốc lát; trong DevTools tab đang thao tác không thấy sự kiện `storage` của chính nó.
- [ ] DevTools: để `backdrop-blur-xl` ở `<main>` thì thông báo kẹt trong thẻ; chuyển sang `data-glass` thì thông báo ra cửa sổ. Tắt `-z-10` của `data-glass` thì lớp kính che mất chữ.
- [ ] Bàn phím: Tab qua nút lọc, bốn ô, nút thêm, nút ✕ từng dòng; Enter ở một ô form gửi form; sau khi xoá focus đã ở nút "Hoàn tác" (bấm Enter được); sau hoàn tác focus ở nút ✕ của khoản vừa khôi phục.
- [ ] Bật `prefers-reduced-motion: reduce`: `hover:-translate-y-0.5` của chip, nút và ✕ không còn chuyển động mượt (`motion-reduce:transition-none`).
- [ ] Tự hỏi: vì sao `backdrop-filter` ở thẻ cha làm `fixed` ở con "mắc kẹt", và vì sao chữa bằng lớp kính anh em? `reportValidity()` khác `checkValidity()` ở đâu? Vì sao `splice(index, 0, item)` hoàn tác được mà `push` thì không? Tại sao tab A không nhận sự kiện `storage` của chính nó?

## Thử thách thêm

1. Thêm một thanh "Ngân sách tháng": một `<input type="number">` ngân sách lưu cùng `localStorage`, tổng đã chi chia ngân sách thành `--pct` (`style.setProperty`) cho thanh `w-(--pct)` như bài 021; quá ngân sách thì đổi sang gradient hồng đỏ bằng `data-over:`.
2. Cho phép sửa ghi chú tại chỗ: bấm đúp vào ghi chú (`dblclick`) đổi thành `<input>`, `Enter` lưu, `Escape` huỷ, rồi `saveItems()`. Nhớ lúc vẽ lại không để mất focus.

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
		<title>Bài 025 - Ví chi tiêu kính mờ</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<div class="backdrop">
			<div aria-hidden="true" class="blob blob-cyan"></div>
			<div aria-hidden="true" class="blob blob-fuchsia"></div>
			<div aria-hidden="true" class="blob blob-amber"></div>
			<main data-app class="app">
				<div data-glass aria-hidden="true" class="glass"></div>
				<h1 class="title">Ví chi tiêu</h1>
				<p data-total aria-live="polite" class="total"></p>
				<p data-summary class="summary"></p>
				<div role="group" aria-label="Lọc theo nhóm" class="chips">
					<button type="button" data-filter="all" aria-pressed="true" class="chip">Tất cả</button>
					<button type="button" data-filter="an-uong" aria-pressed="false" class="chip">Ăn uống</button>
					<button type="button" data-filter="di-chuyen" aria-pressed="false" class="chip">Di chuyển</button>
					<button type="button" data-filter="mua-sam" aria-pressed="false" class="chip">Mua sắm</button>
					<button type="button" data-filter="giai-tri" aria-pressed="false" class="chip">Giải trí</button>
				</div>
				<form data-form novalidate class="form">
					<div class="form-row">
						<label class="field">
							Số tiền (₫)
							<input name="amount" type="number" inputmode="numeric" min="1000" step="1000" required placeholder="45000" class="input" />
						</label>
						<label class="field">
							Nhóm
							<select name="category" required class="input">
								<option value="an-uong" class="option">Ăn uống</option>
								<option value="di-chuyen" class="option">Di chuyển</option>
								<option value="mua-sam" class="option">Mua sắm</option>
								<option value="giai-tri" class="option">Giải trí</option>
							</select>
						</label>
					</div>
					<label class="field">
						Ghi chú
						<input name="note" type="text" required minlength="2" maxlength="40" pattern=".*\S.*" placeholder="Cà phê sáng" title="Nhập ít nhất 2 ký tự, không toàn dấu cách" class="input" />
					</label>
					<div class="form-row">
						<label class="field">
							Ngày
							<input name="date" type="date" required class="input" />
						</label>
						<button type="submit" class="submit">Thêm khoản chi</button>
					</div>
				</form>
				<p data-empty hidden class="empty">Chưa có khoản chi nào.</p>
				<ul data-list class="list"></ul>
				<div data-toast role="status" hidden class="toast">
					<span data-toast-text></span>
					<button type="button" data-undo hidden class="undo">Hoàn tác</button>
				</div>
				<template data-item-template>
					<li data-item class="item">
						<span aria-hidden="true" class="dot"></span>
						<div class="item-text">
							<p data-note class="note"></p>
							<p data-meta class="meta"></p>
						</div>
						<p data-amount class="amount"></p>
						<button type="button" data-remove class="remove">✕</button>
					</li>
				</template>
			</main>
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
input,
select {
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

h1 {
	font-size: 20px;
	line-height: 28px;
	font-weight: 700;
}

.site {
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
	color: #ffffff;
}

.backdrop {
	position: relative;
	min-height: 100vh;
	overflow: clip;
	background: linear-gradient(to bottom right, #1e1b4b, #581c87, #9f1239);
	padding: 16px;
}

.blob {
	position: absolute;
	border-radius: 9999px;
}

.blob-cyan {
	top: -64px;
	left: -64px;
	width: 256px;
	height: 256px;
	background: rgb(34 211 238 / 0.5);
}

.blob-fuchsia {
	top: 288px;
	right: -80px;
	width: 288px;
	height: 288px;
	background: rgb(217 70 239 / 0.6);
}

.blob-amber {
	bottom: 40px;
	left: 160px;
	width: 192px;
	height: 192px;
	background: rgb(252 211 77 / 0.4);
}

.app {
	position: relative;
	isolation: isolate;
	margin: 0 auto;
	max-width: 448px;
	border-radius: 24px;
	padding: 20px;
}

.glass {
	position: absolute;
	inset: 0;
	z-index: -10;
	border: 1px solid rgb(255 255 255 / 0.25);
	border-top-color: rgb(255 255 255 / 0.5);
	border-radius: 24px;
	background: rgb(255 255 255 / 0.15);
	backdrop-filter: blur(24px);
	box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.3), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.total {
	margin-top: 4px;
	font-size: 30px;
	line-height: 36px;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
}

.summary {
	font-size: 14px;
	line-height: 20px;
	color: rgb(255 255 255 / 0.7);
}

.chips {
	margin-top: 16px;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.chip {
	border: 1px solid rgb(255 255 255 / 0.25);
	border-radius: 9999px;
	padding: 4px 12px;
	font-size: 14px;
	line-height: 20px;
	transition: transform 150ms;
}

.chip:hover,
.submit:hover,
.remove:hover {
	transform: translateY(-2px);
}

.chip[aria-pressed="true"] {
	border-color: #ffffff;
	background: rgb(255 255 255 / 0.25);
}

.chip:focus-visible,
.input:focus-visible,
.submit:focus-visible,
.undo:focus-visible,
.remove:focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}

.form {
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.form-row {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
}

.form-row:last-child {
	align-items: end;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 4px;
	font-size: 12px;
	line-height: 16px;
	color: rgb(255 255 255 / 0.7);
}

.input {
	border: 1px solid rgb(255 255 255 / 0.25);
	border-radius: 12px;
	background: rgb(255 255 255 / 0.1);
	padding: 8px 12px;
	font-size: 14px;
	line-height: 20px;
	color: #ffffff;
}

.input::placeholder {
	color: rgb(255 255 255 / 0.5);
}

.option {
	color: #0f172a;
}

.submit {
	border-radius: 12px;
	background: rgb(255 255 255 / 0.9);
	padding: 8px 16px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	color: #1e1b4b;
	transition: transform 150ms;
}

.empty {
	margin-top: 20px;
	text-align: center;
	font-size: 14px;
	line-height: 20px;
	color: rgb(255 255 255 / 0.6);
}

.list {
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.item {
	display: flex;
	align-items: center;
	gap: 12px;
	border: 1px solid rgb(255 255 255 / 0.15);
	border-radius: 16px;
	background: rgb(255 255 255 / 0.1);
	padding: 8px 12px;
}

.dot {
	flex-shrink: 0;
	width: 12px;
	height: 12px;
	border-radius: 9999px;
	background: rgb(255 255 255 / 0.6);
}

.item[data-category="an-uong"] .dot {
	background: #fcd34d;
}

.item[data-category="di-chuyen"] .dot {
	background: #67e8f9;
}

.item[data-category="mua-sam"] .dot {
	background: #f0abfc;
}

.item[data-category="giai-tri"] .dot {
	background: #bef264;
}

.item-text {
	min-width: 0;
	flex: 1;
}

.note {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: 500;
}

.meta {
	font-size: 12px;
	line-height: 16px;
	color: rgb(255 255 255 / 0.6);
}

.amount {
	font-weight: 600;
	font-variant-numeric: tabular-nums;
}

.remove {
	border-radius: 9999px;
	padding: 4px 8px;
	color: rgb(255 255 255 / 0.7);
	transition: transform 150ms;
}

.toast {
	position: fixed;
	left: 16px;
	right: 16px;
	bottom: 16px;
	margin: 0 auto;
	display: flex;
	max-width: 384px;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	border: 1px solid rgb(255 255 255 / 0.25);
	border-radius: 16px;
	background: rgb(255 255 255 / 0.2);
	padding: 12px 16px;
	font-size: 14px;
	line-height: 20px;
	backdrop-filter: blur(12px);
	box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.undo {
	border: 1px solid rgb(255 255 255 / 0.4);
	border-radius: 9999px;
	padding: 4px 12px;
	font-size: 12px;
	line-height: 16px;
	font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
	.chip,
	.submit,
	.remove {
		transition: none;
	}
}
```

`solution/script.js`

```js
const STORAGE_KEY = 'bai-025-chi-tieu';
const sample = [
	{ id: 1, amount: 45000, category: 'an-uong', note: 'Cà phê sáng', date: '2026-11-24' },
	{ id: 2, amount: 120000, category: 'di-chuyen', note: 'Đổ xăng', date: '2026-11-23' },
	{ id: 3, amount: 890000, category: 'mua-sam', note: 'Giày chạy bộ', date: '2026-11-21' },
	{ id: 4, amount: 150000, category: 'giai-tri', note: 'Vé xem phim', date: '2026-11-20' },
];
const categoryNames = { 'an-uong': 'Ăn uống', 'di-chuyen': 'Di chuyển', 'mua-sam': 'Mua sắm', 'giai-tri': 'Giải trí' };

const moneyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const compactFormatter = new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 });
const dateFormatter = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short', timeZone: 'UTC' });

const app = document.querySelector('[data-app]');
const form = app.querySelector('[data-form]');
const list = app.querySelector('[data-list]');
const total = app.querySelector('[data-total]');
const summary = app.querySelector('[data-summary]');
const empty = app.querySelector('[data-empty]');
const toast = app.querySelector('[data-toast]');
const toastText = app.querySelector('[data-toast-text]');
const undoButton = app.querySelector('[data-undo]');
const itemTemplate = app.querySelector('[data-item-template]');
const filterButtons = app.querySelectorAll('[data-filter]');

const todayText = new Intl.DateTimeFormat('en-CA').format(new Date());
const state = { items: loadItems(), filter: 'all', removed: null };
let toastTimer = 0;

function loadItems() {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (raw === null) {
		return sample.slice();
	}
	return JSON.parse(raw);
}

function saveItems() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function getVisible() {
	return state.items
		.filter(function (item) { return state.filter === 'all' || item.category === state.filter; })
		.sort(function (a, b) { return b.date.localeCompare(a.date); });
}

function createItem(item) {
	const li = itemTemplate.content.firstElementChild.cloneNode(true);
	li.dataset.id = item.id;
	li.dataset.category = item.category;
	li.querySelector('[data-note]').textContent = item.note;
	li.querySelector('[data-meta]').textContent = categoryNames[item.category] + ' · ' + dateFormatter.format(new Date(item.date));
	li.querySelector('[data-amount]').textContent = moneyFormatter.format(item.amount);
	li.querySelector('[data-remove]').setAttribute('aria-label', 'Xoá ' + item.note);
	return li;
}

function render() {
	const visible = getVisible();
	const sum = visible.reduce(function (result, item) { return result + item.amount; }, 0);
	list.replaceChildren(...visible.map(createItem));
	empty.hidden = visible.length > 0;
	total.textContent = moneyFormatter.format(sum);
	summary.textContent = visible.length + ' khoản · khoảng ' + compactFormatter.format(sum) + ' ₫';
	filterButtons.forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.filter === state.filter));
	});
}

function showToast(text, canUndo) {
	clearTimeout(toastTimer);
	toastText.textContent = text;
	undoButton.hidden = !canUndo;
	toast.hidden = false;
	toastTimer = setTimeout(hideToast, 5000);
}

function hideToast() {
	toast.hidden = true;
	state.removed = null;
}

function handleSubmit(event) {
	event.preventDefault();
	if (!form.reportValidity()) {
		return;
	}
	const data = Object.fromEntries(new FormData(form));
	state.items.unshift({ id: Date.now(), amount: Number(data.amount), category: data.category, note: data.note.trim(), date: data.date });
	state.filter = 'all';
	saveItems();
	form.reset();
	form.elements.date.value = todayText;
	render();
	showToast('Đã thêm khoản chi', false);
	form.elements.amount.focus();
}

function removeItem(id) {
	const index = state.items.findIndex(function (item) { return String(item.id) === id; });
	const removedItem = state.items.splice(index, 1)[0];
	state.removed = { item: removedItem, index: index };
	saveItems();
	render();
	showToast('Đã xoá "' + removedItem.note + '"', true);
	undoButton.focus();
}

function undoRemove() {
	if (state.removed === null) {
		return;
	}
	state.items.splice(state.removed.index, 0, state.removed.item);
	const id = state.removed.item.id;
	hideToast();
	state.filter = 'all';
	saveItems();
	render();
	list.querySelector('[data-id="' + id + '"] [data-remove]').focus();
}

function handleClick(event) {
	const filterButton = event.target.closest('[data-filter]');
	if (filterButton) {
		state.filter = filterButton.dataset.filter;
		render();
		return;
	}
	const removeButton = event.target.closest('[data-remove]');
	if (removeButton) {
		removeItem(removeButton.closest('[data-item]').dataset.id);
		return;
	}
	if (event.target.closest('[data-undo]')) {
		undoRemove();
	}
}

function handleStorage(event) {
	if (event.key !== STORAGE_KEY) {
		return;
	}
	state.items = loadItems();
	render();
}

form.elements.date.max = todayText;
form.elements.date.value = todayText;
form.addEventListener('submit', handleSubmit);
app.addEventListener('click', handleClick);
window.addEventListener('storage', handleStorage);
render();
```

</details>

### Giải thích từng hàm

- `loadItems()`: không tham số, trả mảng khoản chi. `localStorage.getItem(khoá)` trả chuỗi đã lưu hoặc `null` nếu chưa có; `=== null` so sánh chặt; nếu chưa lưu thì `sample.slice()` (sao chép nông cả mảng, không tham số nghĩa là copy từ đầu đến cuối) để không sửa nhầm mảng mẫu; ngược lại `JSON.parse(raw)` biến chuỗi JSON thành mảng object.
- `saveItems()`: `JSON.stringify(state.items)` đổi mảng thành chuỗi JSON; `localStorage.setItem(khoá, chuỗi)` ghi lại (chỉ nhận chuỗi). Lệnh này làm **các tab khác** nhận sự kiện `storage`.
- `new Intl.NumberFormat('vi-VN', tuỳ chọn)`: tạo bộ định dạng số. `{ style: 'currency', currency: 'VND' }` cho `45.000 ₫`; `{ notation: 'compact', maximumFractionDigits: 1 }` rút gọn kiểu `1,3 Tr` (khác `style: 'currency'` ở chỗ không có đơn vị tiền, và `maximumFractionDigits: 1` giữ tối đa 1 chữ số thập phân). `.format(số)` trả chuỗi.
- `new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short', timeZone: 'UTC' })`: định dạng ngày như `20 thg 11`; tuỳ chọn `timeZone: 'UTC'` bắt buộc dùng múi giờ UTC thay vì múi giờ máy, vì `new Date('2026-11-20')` là nửa đêm UTC. `new Intl.DateTimeFormat('en-CA').format(new Date())` thì trả đúng dạng `YYYY-MM-DD` mà `<input type="date">` cần (locale `en-CA` dùng định dạng ISO).
- `getVisible()`: trả mảng khoản chi sau khi lọc và sắp xếp. `filter(hàm)` giữ phần tử mà hàm trả `true` và trả **mảng mới**; `||` là "hoặc" (đúng khi một trong hai đúng); `sort(hàm so sánh)` sắp xếp **tại chỗ** (vì vậy ta sắp xếp mảng mới do `filter` trả về, không đụng `state.items`), hàm trả số âm thì `a` đứng trước, dương thì `b` đứng trước; `b.date.localeCompare(a.date)` so sánh hai chuỗi, ngày mới (chuỗi lớn hơn) đứng trước.
- `createItem(item)`: nhận một khoản chi, trả phần tử `<li>` mới. `itemTemplate.content.firstElementChild.cloneNode(true)` nhân bản sâu dòng trong template; `dataset.id = item.id` ghi `data-id`; `li.querySelector('[data-note]')` tìm phần tử con theo thuộc tính `data-note`; `textContent` ghi chữ; `moneyFormatter.format(...)` ra tiền; `new Date(item.date)` biến chuỗi `YYYY-MM-DD` thành `Date`; `setAttribute('aria-label', 'Xoá ' + item.note)` đặt tên đọc được cho nút ✕ (ghép chuỗi bằng `+`).
- `render()`: vẽ lại từ `state`. `visible.reduce(hàm, 0)` gộp mảng thành một giá trị: hàm nhận `(kết quả tích luỹ, phần tử)` và trả kết quả mới, `0` là giá trị khởi đầu; `visible.map(createItem)` (truyền **tên hàm**, không có `()`) tạo mảng `<li>`; `list.replaceChildren(...mảng)` (dấu `...` trải mảng thành từng tham số) thay toàn bộ con của danh sách; `empty.hidden = visible.length > 0` bật tắt thuộc tính `hidden`; `compactFormatter.format(sum)` rút gọn tổng; `filterButtons.forEach(...)` đặt `aria-pressed` với `String(button.dataset.filter === state.filter)` (`String(true)` ra `"true"`).
- `showToast(text, canUndo)`: `clearTimeout(toastTimer)` huỷ hẹn giờ cũ; `setTimeout(hideToast, 5000)` hẹn chạy `hideToast` sau 5000 ms và **trả số định danh** lưu lại vào `toastTimer`; `undoButton.hidden = !canUndo` (`!` đảo giá trị đúng sai) chỉ hiện nút "Hoàn tác" khi cho phép.
- `hideToast()`: ẩn thông báo (`toast.hidden = true`) và xoá `state.removed` bằng `null`, nghĩa là hết hạn hoàn tác.
- `handleSubmit(event)`: `event.preventDefault()` chặn trình duyệt gửi form và tải lại trang; `form.reportValidity()` kiểm tra mọi ô, hiện bong bóng lỗi và focus ô sai đầu tiên, trả `true`/`false`; `return` sớm thoát hàm khi sai. `new FormData(form)` gom các ô có `name` thành cặp khoá/giá trị; `Object.fromEntries(...)` đổi các cặp đó thành object `{ amount, category, note, date }` (mọi giá trị là chuỗi nên cần `Number(data.amount)`). `Date.now()` trả số mili giây hiện tại, dùng làm `id`; `.trim()` cắt dấu cách hai đầu; `state.items.unshift(x)` thêm vào **đầu** mảng (khác `push` thêm vào cuối); `form.reset()` trả mọi ô về giá trị mặc định trong HTML; `form.elements.amount.focus()` đưa con trỏ vào ô số tiền (`form.elements.tên` lấy ô theo `name`).
- `removeItem(id)`: `findIndex(hàm)` trả chỉ số phần tử đầu tiên mà hàm trả `true`, hoặc -1; `String(item.id) === id` so sánh chuỗi với chuỗi vì `dataset` luôn trả chuỗi. `state.items.splice(index, 1)` cắt 1 phần tử tại `index`, **sửa trực tiếp mảng** và trả mảng các phần tử bị cắt; `[0]` lấy phần tử đầu của mảng đó. Lưu `{ item, index }` rồi `saveItems()`, `render()`, `showToast(...)` và `undoButton.focus()`.
- `undoRemove()`: `if (state.removed === null) return` chặn khi không có gì để hoàn tác. `state.items.splice(state.removed.index, 0, state.removed.item)` với tham số thứ hai là `0` nghĩa là **xoá 0 phần tử** và chèn phần tử thứ ba tại vị trí `index` (khác `splice(index, 1)` là cắt bỏ). Sau đó `hideToast()`, đặt `state.filter = 'all'` để chắc khoản khôi phục hiện ra, lưu, vẽ lại và `focus()` nút ✕ của nó, tìm bằng selector hậu duệ `[data-id="..."] [data-remove]` (hai thuộc tính, cách nhau dấu cách: phần tử `data-remove` nằm **trong** phần tử `data-id`).
- `handleClick(event)`: uỷ quyền ở `data-app`. `event.target.closest(selector)` đi ngược lên cây DOM tìm phần tử khớp (trả `null` nếu không có); `removeButton.closest('[data-item]').dataset.id` lấy `id` từ dòng chứa nút; mỗi nhánh `return` sớm để không chạy tiếp các nhánh sau.
- `handleStorage(event)`: nhận `StorageEvent`; `event.key` là khoá vừa đổi (khác `STORAGE_KEY` thì bỏ qua, `!==` là "không bằng chặt"); đọc lại `loadItems()` và `render()`. Sự kiện chỉ nổ ở **tab khác** của cùng nguồn gốc.
- `window.addEventListener('storage', handleStorage)`, `form.addEventListener('submit', handleSubmit)`, `app.addEventListener('click', handleClick)`: đăng ký hàm bằng cách truyền tên hàm. `form.elements.date.max = todayText` đặt thuộc tính `max` cho ô ngày để chặn ngày tương lai; `form.elements.date.value = todayText` đặt ngày mặc định.
- `let toastTimer = 0`: `let` vì sẽ gán lại; `const state = {...}`: `const` giữ nguyên tham chiếu object nhưng vẫn sửa được nội dung (`state.items = ...`, `state.filter = ...`).

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Tailwind trong starter | CSS trong `solution/style.css` |
|---|---|
| `absolute inset-0 -z-10 rounded-3xl border border-white/25 bg-white/15 shadow-xl backdrop-blur-xl inset-ring-1 inset-ring-white/30 border-t-white/50` trên `data-glass` | `.glass { position: absolute; inset: 0; z-index: -10; border: 1px solid rgb(255 255 255 / 0.25); border-top-color: rgb(255 255 255 / 0.5); border-radius: 24px; background: rgb(255 255 255 / 0.15); backdrop-filter: blur(24px); box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.3), 0 20px 25px -5px ..., 0 8px 10px -6px ... }` |
| `relative isolate mx-auto max-w-md rounded-3xl p-5` trên `<main>` | `.app { position: relative; isolation: isolate; margin: 0 auto; max-width: 448px; border-radius: 24px; padding: 20px }` (không có `backdrop-filter`) |
| `fixed inset-x-4 bottom-4 mx-auto flex max-w-sm ... backdrop-blur-md` trên thông báo | `.toast { position: fixed; left: 16px; right: 16px; bottom: 16px; margin: 0 auto; display: flex; max-width: 384px; ...; backdrop-filter: blur(12px) }` |
| `relative min-h-screen overflow-clip bg-linear-to-br from-indigo-950 via-purple-900 to-rose-800 p-4` | `.backdrop { position: relative; min-height: 100vh; overflow: clip; background: linear-gradient(to bottom right, #1e1b4b, #581c87, #9f1239); padding: 16px }` |
| `group-data-[category=an-uong]:bg-amber-300 ...` | `.item[data-category="an-uong"] .dot { background: #fcd34d }` và ba selector tương tự |
| `aria-pressed:border-white aria-pressed:bg-white/25` | `.chip[aria-pressed="true"] { border-color: #ffffff; background: rgb(255 255 255 / 0.25) }` |
| `hover:-translate-y-0.5 transition-transform motion-reduce:transition-none` | `.chip:hover { transform: translateY(-2px) }`, `transition: transform 150ms`, và trong `@media (prefers-reduced-motion: reduce)` đặt `transition: none` |
| `grid grid-cols-2 items-end gap-3` | `.form-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px }` và `.form-row:last-child { align-items: end }` |
| `min-w-0 flex-1` + `truncate` | `.item-text { min-width: 0; flex: 1 }` và `.note { overflow: hidden; text-overflow: ellipsis; white-space: nowrap }` |

Khác biệt nhỏ: Tailwind ghép `inset-ring` và `shadow-xl` qua biến `--tw-inset-ring-shadow` và `--tw-shadow`; bản CSS thuần phải viết cả ba lớp `box-shadow` trong một khai báo, cách nhau bằng dấu phẩy.
