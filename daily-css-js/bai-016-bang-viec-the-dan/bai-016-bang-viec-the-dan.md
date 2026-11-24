# Bài 016: Bảng việc thẻ dán với `drop-shadow` và bẫy bóng bị cắt

Ngày học 6, bài 3/3, cấp 1, chủ đề CSS: Đổ bóng (ứng dụng bảng việc kiểu Kanban), độ khó ★★★★★, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Tải lại trang thì bảng về lại bốn việc mẫu. Đây là hành vi đúng của bài.

## Mục tiêu

- Thẻ việc là tờ giấy dán vàng **cắt chéo một góc** (`clip-path`) mà **vẫn có bóng đổ đúng hình**: bóng đặt bằng `drop-shadow` ở thẻ bọc ngoài, không đặt ở phần tử bị cắt.
- Tiêu đề cột chữ trắng có bóng chữ `text-shadow`; thẻ vừa chuyển hoặc vừa thêm **nổi lên** (bóng to hơn, nhích lên) rồi trở lại sau 0,8 giây.
- Chuyển việc giữa ba cột bằng nút `←`/`→` (nút bị khoá ở hai đầu); cột "Đang làm" chỉ nhận tối đa 3 việc, quá thì báo lỗi.
- Bàn phím dùng trọn vẹn: chuyển thẻ xong **focus vẫn nằm đúng trên nút**, không rơi mất.
- Số việc từng cột luôn đúng khi chuyển, thêm, xoá.

## Kết quả mong đợi

Ba cột cạnh nhau: "Cần làm" (xám xanh), "Đang làm" (cam), "Xong" (lục), mỗi cột có số việc cạnh tên. Các thẻ vàng có góc dưới phải bị cắt vát, bóng mềm ôm sát cả đường vát. Bấm `→` ở một thẻ: thẻ sang cột kế, bóng to hơn và thẻ nhích lên chốc lát rồi lắng xuống. Ô "Việc mới" thêm thẻ vào cột "Cần làm".

## Tư duy

**Hai loại bóng.** `box-shadow` (class `shadow-*`) vẽ bóng theo **hình hộp chữ nhật** của phần tử. `filter: drop-shadow()` (class `drop-shadow-*`) vẽ bóng theo **hình thật nhìn thấy được**, kể cả vùng trong suốt hay đường vát. Thẻ dán cắt góc cần cái thứ hai mới có bóng ôm sát đường vát.

**Bẫy: cắt luôn cả bóng của chính mình.** `clip-path` cắt phần tử **và mọi thứ vẽ ngoài hình cắt, kể cả bóng của chính nó**. Đặt `shadow-md` hoặc `drop-shadow-md` lên phần tử có `clip-path`: bóng nằm ngoài vùng cắt nên biến mất hoàn toàn, và bạn không thấy lỗi nào. Cách chữa: **tách hai lớp**. Phần tử trong (`data-note`) giữ `clip-path`; phần tử bọc ngoài (`<li>`) không bị cắt, nhận `drop-shadow`. Bóng vẽ trên lớp ngoài **sau khi** lớp trong đã được cắt, nên đổ theo hình đã cắt. Nó giống bài 008 (bóng bị `overflow` cắt), chỉ khác thủ phạm.

**DOM là nguồn dữ liệu.** Cột chứa thẻ nào, thẻ nằm ở cột nào: tất cả là cây DOM. Không có mảng việc riêng. Cột của một thẻ là `card.closest('[data-column]').dataset.column`. Chuyển cột nghĩa là `append` thẻ vào `<ul>` của cột đích. `render()` đọc DOM để ghi số việc và khoá nút.

**Bẫy JS: `append` làm mất focus.** `append` một phần tử đang có sẵn thực chất gỡ nó khỏi chỗ cũ rồi gắn vào chỗ mới, mà phần tử bị gỡ thì **mất focus**. Người dùng bàn phím bấm `→`, thẻ nhảy sang cột kế và focus biến mất, phải Tab lại từ đầu trang. Cách chữa: sau khi chuyển, `focus()` lại đúng nút vừa bấm. Nhưng nếu thẻ vừa vào cột "Xong", nút `→` bị khoá: nút khoá không nhận focus, nên ta chọn nút còn mở bằng selector `:not(:disabled)`.

**Mỗi thẻ một đồng hồ.** Hiệu ứng nổi lên tắt sau 0,8 giây. Chuyển cùng một thẻ liên tiếp mà không huỷ hẹn giờ cũ thì hẹn giờ cũ sẽ tắt hiệu ứng sớm (bài 008). Mỗi thẻ cần hẹn giờ **riêng**: ta cất mã hẹn giờ vào `card.dataset.timer`. `dataset` luôn lưu chuỗi, nên khi huỷ phải bọc `Number(...)`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Thẻ cắt góc (`[clip-path:...]`), bóng ôm hình (`drop-shadow-md`) | Gắn thẻ vào đúng `<ul>` cột |
| Thẻ nổi lên (`data-lifted:drop-shadow-xl data-lifted:-translate-y-1`) | Bật `data-lifted` rồi gỡ sau 0,8 giây |
| Chữ tiêu đề có bóng (`text-shadow-sm text-shadow-black/50`) | Ghi số việc vào `data-count` |
| Nút xám khi `disabled:` | Ghi `disabled` cho nút `←`/`→` theo cột |

JS không thêm hoặc gỡ class, không đặt `style`, không tìm phần tử bằng class. JS chỉ tìm bằng thuộc tính `data-*`.

## Ôn lại

- Bài 008 (`bai-008-ke-dia-nhac`): bẫy bóng bị `overflow` cắt, `setTimeout`/`clearTimeout`, `append` di chuyển phần tử.
- Bài 013 (`bai-013-dat-ban-nha-hang`): `template.content.firstElementChild.cloneNode(true)`, `FormData.get` + `trim`, trả focus bằng `tabindex="-1"`, `showMessage` với hẹn giờ.
- Bài 006 và 011: `Math.max`/`Math.min` chặn hai đầu, `disabled:`.
- Bài 003 (`bai-003-hop-thoai-xac-nhan`) và 005: uỷ quyền click bằng `closest`.
- Bài 011: `data-*:` kết hợp `transition-[...]`, `-translate-y-*`.

## Gợi ý từng bước

> Starter đã điền sẵn: nền, thanh nhập việc, ba cột (màu tiêu đề, `grid md:grid-cols-3`), mỗi `<li data-card>` có `transition-[filter,translate] duration-300 motion-reduce:transition-none data-lifted:-translate-y-1`, nút của thẻ với `hover:`/`disabled:`/viền focus. **Hai thẻ `<li>` đầu** (Viết báo cáo tuần, Đặt phòng họp) đã có đủ nhóm class bóng và cắt góc; **hai thẻ cuối** (Thiết kế trang chủ, Gửi hoá đơn) **và thẻ trong `<template>`** chưa có. **Hai tiêu đề cột đầu** (Cần làm, Đang làm) đã có `text-shadow`; tiêu đề cột "Xong" chưa có.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-board`; ba `<section data-column="todo|doing|done">` (cột "doing" có `data-limit="3"`), mỗi cột có `data-column-title` (kèm `tabindex="-1"`), `data-count`, `data-list="..."`; mỗi thẻ có `data-card`, `data-note` (tờ giấy), `data-card-title`, hai nút `data-move="-1"`/`data-move="1"`, `data-remove`; `data-form`, `data-title-input`, `data-message` (có `role="status"`), `<template data-card-template>`. Kiểm tra: hai thẻ đầu có bóng và vát góc, hai thẻ sau là hình chữ nhật phẳng không bóng; tiêu đề "Xong" chữ phẳng.

2. **CSS: bóng chữ ở tiêu đề.** **Bạn làm:** trên `<h2 data-column-title>` của cột **"Xong"** (tiêu đề cuối) thêm `text-shadow-sm text-shadow-black/50`. `text-shadow-sm` đặt bóng nhỏ phía dưới chữ; `text-shadow-black/50` đặt màu bóng là đen 50% (tương tự `shadow-indigo-500/40` ở bài 008). Chép đúng theo hai tiêu đề đầu. Kiểm tra: chữ "Xong" có viền bóng nhẹ như hai tiêu đề kia; trong DevTools bỏ `text-shadow-black/50` thì bóng nhạt gần như mất trên nền lục.

3. **CSS: thẻ cắt góc, bóng ôm hình và cái bẫy.** **Bạn làm:** trên **2 thẻ `<li data-card>` cuối và `<li>` trong `<template>`**: `<li>` thêm `drop-shadow-md`; `<div data-note>` thêm `[clip-path:polygon(0_0,100%_0,100%_calc(100%_-_16px),calc(100%_-_16px)_100%,0_100%)]`. Chép theo hai thẻ đầu. Dấu `_` trong ngoặc vuông là dấu cách; `polygon(...)` liệt kê năm đỉnh của một hình có góc dưới phải bị vát 16px. Làm **theo đúng thứ tự** để gặp bẫy ở thẻ "Thiết kế trang chủ": trước tiên thêm `drop-shadow-md` vào **chính `<div data-note>`** cùng với `clip-path`: thẻ vát góc nhưng **không có bóng**. Chuyển `drop-shadow-md` sang `<li>` bọc ngoài: bóng xuất hiện và ôm theo đường vát. Rồi làm thẻ "Gửi hoá đơn" và thẻ trong `<template>`. Kiểm tra: bốn thẻ đều giống nhau; trong DevTools tắt `clip-path` ở một thẻ thì góc vuông lại, bóng vẫn còn.

4. **JS: lấy phần tử, `getList`, `getColumnName` và `render()`.** **Bạn làm:** toàn bộ JS. Lấy `board`, `form`, `titleInput`, `message`, `template` bằng `querySelector` theo `data-*`. Khai báo `const columns = ['todo', 'doing', 'done']`. `getList(name)` dùng chuỗi mẫu trong selector: ``board.querySelector(`[data-list="${name}"]`)``. `getColumnName(card)` trả `card.closest('[data-column]').dataset.column`. `render()`: với mỗi tên cột, ghi `list.children.length` (`children` là danh sách **phần tử con** trực tiếp, đếm bằng `.length`) vào `[data-count]` của cột; rồi với mỗi `[data-card]` tính `columns.indexOf(getColumnName(card))` (`indexOf(giá trị)` trả vị trí đầu tiên của giá trị trong mảng, hoặc `-1` nếu không có) để ghi `disabled` cho nút `[data-move="-1"]` (khi `index === 0`) và `[data-move="1"]` (khi là cột cuối). Gọi `render()` cuối file. Kiểm tra: ba số cột là 2, 1, 1; ở thẻ cột "Cần làm" nút `←` xám, ở cột "Xong" nút `→` xám.

5. **JS: chuyển thẻ và giới hạn.** **Bạn làm:** toàn bộ JS. Viết `moveCard(card, step)` trả `true` nếu đã chuyển, `false` nếu không: tính `from` bằng `indexOf`, `to` bằng `Math.max(0, Math.min(columns.length - 1, from + step))` (chặn hai đầu, bài 006), nếu `to === from` thì `return false`. `target = getList(columns[to])`. Giới hạn: `const limit = Number(target.closest('[data-column]').dataset.limit)`; cột không có `data-limit` thì `Number(undefined)` là `NaN` (coi như sai); nếu `limit && target.children.length >= limit` thì `showMessage(...)` (hẹn giờ 3 giây, `clearTimeout` trước, như bài 013) và `return false`. Cuối cùng `target.append(card)`, `render()`, `return true`. Gắn **một** `click` ở `board`: `closest('[data-card]')` (`null` thì `return`), rồi `closest('[data-move]')`; nếu có thì `moveCard(card, Number(button.dataset.move))`. Kiểm tra: bấm `→` chuyển thẻ, số cột đổi; dồn đủ 3 thẻ vào "Đang làm" rồi chuyển thẻ thứ tư thì báo "Cột này chỉ nhận tối đa 3 việc." và thẻ ở yên.

6. **JS: bẫy mất focus, rồi sửa.** **Bạn làm:** toàn bộ JS. Trước hết thử **cách có bẫy**: chỉ gọi `moveCard`. Dùng bàn phím: Tab tới nút `→` của thẻ đầu, nhấn Enter: thẻ sang cột kế nhưng focus mất (nhấn Tab sẽ nhảy về đầu trang; trong DevTools gõ `document.activeElement` ra `body`). Sửa: nếu `moveCard` trả `true` thì `focusTarget = moveButton.disabled ? card.querySelector('[data-move]:not(:disabled)') : moveButton` rồi `focusTarget.focus()`. `:not(:disabled)` là selector chọn phần tử **không** bị khoá. Rồi thêm hiệu ứng nổi: viết `liftCard(card)`: `clearTimeout(Number(card.dataset.timer))` (hẹn giờ cũ của **riêng thẻ này**; `Number(undefined)` ra `NaN`, `clearTimeout(NaN)` không làm gì), `card.dataset.lifted = ''` (ghi thuộc tính `data-lifted` rỗng, đủ để `data-lifted:` khớp), `card.dataset.timer = setTimeout(hàm, 800)` với hàm gỡ `data-lifted` bằng `removeAttribute`; `setTimeout` trả một số, gán vào `dataset` thì thành chuỗi. Gọi `liftCard(card)` sau `append` trong `moveCard`. **CSS:** trên `<li data-card>` của **2 thẻ cuối và thẻ trong `<template>`** thêm `data-lifted:drop-shadow-xl`, chép theo hai thẻ đầu. Kiểm tra: dùng bàn phím chuyển thẻ liên tiếp, focus luôn ở nút; chuyển tới cột "Xong" thì focus nhảy sang nút `←`; thẻ nổi lên (bóng to, nhích 4px) rồi lắng xuống; bấm `→`, `←` liên tiếp nhanh thì hiệu ứng kéo dài đúng 0,8 giây sau lần cuối.

7. **JS: thêm việc, xoá việc, trả focus.** **Bạn làm:** toàn bộ JS. Gắn `submit` ở `form`, `preventDefault()`. `const title = new FormData(form).get('title').trim()`; rỗng thì `showMessage('Hãy nhập tên việc.')`, `titleInput.focus()`, `return`. Không thì `template.content.firstElementChild.cloneNode(true)`, ghi `title` vào `[data-card-title]` bằng `textContent`, `getList('todo').append(card)`, `liftCard(card)`, `form.reset()`, `titleInput.focus()`, `render()`. Trong `click` của `board`, nếu bấm `[data-remove]`: lấy `section = card.closest('[data-column]')` **trước** khi gỡ, `card.remove()`, `render()`, rồi `section.querySelector('[data-column-title]').focus()` (nút vừa bị gỡ nên focus rơi mất; ta trả về tiêu đề cột đã có `tabindex="-1"`). Kiểm tra: thêm việc thì thẻ mới nổi lên trong cột "Cần làm"; thêm việc rỗng báo lỗi; xoá thẻ thì số cột giảm và focus nằm ở tiêu đề cột; thẻ thêm mới cũng có bóng, vát góc, chuyển cột được.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương (gần đúng) |
|---|---|
| `drop-shadow-md` | `filter: drop-shadow(0 3px 3px rgb(0 0 0 / 0.12))` |
| `data-lifted:drop-shadow-xl` | `.card[data-lifted] { filter: drop-shadow(0 9px 7px rgb(0 0 0 / 0.1)) }` |
| `data-lifted:-translate-y-1` | `.card[data-lifted] { translate: 0 -4px }` |
| `[clip-path:polygon(...)]` | `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)` |
| `text-shadow-sm text-shadow-black/50` | `text-shadow: 0 1px 2px rgb(0 0 0 / 0.5)` |
| `transition-[filter,translate] duration-300` | `transition: filter 300ms, translate 300ms` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |
| `min-h-24` | `min-height: 96px` |

## Tự kiểm tra

- [ ] Bốn thẻ mẫu và thẻ thêm mới giống hệt nhau: vát góc, bóng ôm đúng hình vát, nằm đủ trong cột.
- [ ] Ba tiêu đề cột đều có bóng chữ; số việc từng cột đúng sau mỗi lần chuyển, thêm, xoá.
- [ ] Nút `←` khoá ở cột đầu, `→` khoá ở cột cuối; cột "Đang làm" từ chối thẻ thứ tư và báo lỗi tự tắt sau 3 giây; hai lỗi liên tiếp không làm lỗi sau tắt sớm.
- [ ] Bàn phím: Tab tới `→`, Enter: thẻ chuyển cột và focus **vẫn nằm trên nút**; vào cột "Xong" thì focus sang `←`; Enter ở ô "Việc mới" thêm việc; xoá thẻ thì focus về tiêu đề cột.
- [ ] DevTools: chuyển `drop-shadow-md` từ `<li>` xuống `<div data-note>` thì bóng biến mất. Thêm `data-lifted` bằng tay vào một `<li>` thì thẻ nổi lên. Thử `clearTimeout` bị bỏ: chuyển nhanh hai lần, hiệu ứng tắt sớm.
- [ ] Bật `prefers-reduced-motion: reduce`: thẻ đổi bóng và vị trí tức thì, không trượt.
- [ ] Tự hỏi: vì sao `clip-path` cắt mất bóng của chính phần tử đó? Vì sao `drop-shadow` ở thẻ bọc lại ôm đúng hình vát? Vì sao sau `append` cần `focus()` lại, và vì sao không thể focus nút `→` ở cột "Xong"?

## Thử thách thêm

1. Cho mỗi thẻ hơi nghiêng như giấy dán thật: `rotate-1` và `even:-rotate-1` trên `<li>`; chú ý `data-lifted:-translate-y-1` và `rotate` ghép nhau thế nào (cả hai là thuộc tính riêng `rotate`/`translate`). Gợi ý: kiểm tra bóng có còn ôm hình khi thẻ nghiêng.
2. Nguồn sáng: khi chuột di trên bảng, ghi `--lx` (âm hoặc dương, theo `clientX`) bằng `style.setProperty` lên `data-board`, và bóng thẻ lệch theo hướng ngược nguồn sáng bằng `drop-shadow-[calc(var(--lx)*1px)_6px_4px_rgb(0_0_0/0.15)]`. Nhớ giới hạn bằng `requestAnimationFrame` để không ghi quá nhiều lần.

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
		<title>Bài 016 - Bảng việc thẻ dán</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<h1 class="title">Bảng việc nhóm</h1>
			<form data-form novalidate class="add-form">
				<label for="title" class="add-label">Việc mới</label>
				<div class="add-row">
					<input id="title" type="text" name="title" data-title-input autocomplete="off" class="add-input" />
					<button type="submit" class="add-submit">Thêm vào "Cần làm"</button>
				</div>
			</form>
			<p data-message role="status" class="message"></p>
			<div data-board class="board">
				<section data-column="todo" class="column">
					<h2 data-column-title tabindex="-1" class="column-title col-todo">Cần làm <span data-count class="count">0</span></h2>
					<ul data-list="todo" class="column-list">
						<li data-card class="card">
							<div data-note class="note">
								<p data-card-title class="note-title">Viết báo cáo tuần</p>
								<div class="note-actions">
									<button type="button" data-move="-1" aria-label="Chuyển sang cột trước" class="note-button">←</button>
									<button type="button" data-move="1" aria-label="Chuyển sang cột sau" class="note-button">→</button>
									<button type="button" data-remove aria-label="Xoá việc" class="note-button">✕</button>
								</div>
							</div>
						</li>
						<li data-card class="card">
							<div data-note class="note">
								<p data-card-title class="note-title">Đặt phòng họp</p>
								<div class="note-actions">
									<button type="button" data-move="-1" aria-label="Chuyển sang cột trước" class="note-button">←</button>
									<button type="button" data-move="1" aria-label="Chuyển sang cột sau" class="note-button">→</button>
									<button type="button" data-remove aria-label="Xoá việc" class="note-button">✕</button>
								</div>
							</div>
						</li>
					</ul>
				</section>
				<section data-column="doing" data-limit="3" class="column">
					<h2 data-column-title tabindex="-1" class="column-title col-doing">Đang làm <span data-count class="count">0</span></h2>
					<ul data-list="doing" class="column-list">
						<li data-card class="card">
							<div data-note class="note">
								<p data-card-title class="note-title">Thiết kế trang chủ</p>
								<div class="note-actions">
									<button type="button" data-move="-1" aria-label="Chuyển sang cột trước" class="note-button">←</button>
									<button type="button" data-move="1" aria-label="Chuyển sang cột sau" class="note-button">→</button>
									<button type="button" data-remove aria-label="Xoá việc" class="note-button">✕</button>
								</div>
							</div>
						</li>
					</ul>
				</section>
				<section data-column="done" class="column">
					<h2 data-column-title tabindex="-1" class="column-title col-done">Xong <span data-count class="count">0</span></h2>
					<ul data-list="done" class="column-list">
						<li data-card class="card">
							<div data-note class="note">
								<p data-card-title class="note-title">Gửi hoá đơn</p>
								<div class="note-actions">
									<button type="button" data-move="-1" aria-label="Chuyển sang cột trước" class="note-button">←</button>
									<button type="button" data-move="1" aria-label="Chuyển sang cột sau" class="note-button">→</button>
									<button type="button" data-remove aria-label="Xoá việc" class="note-button">✕</button>
								</div>
							</div>
						</li>
					</ul>
				</section>
			</div>
		</main>
		<template data-card-template>
			<li data-card class="card">
				<div data-note class="note">
					<p data-card-title class="note-title"></p>
					<div class="note-actions">
						<button type="button" data-move="-1" aria-label="Chuyển sang cột trước" class="note-button">←</button>
						<button type="button" data-move="1" aria-label="Chuyển sang cột sau" class="note-button">→</button>
						<button type="button" data-remove aria-label="Xoá việc" class="note-button">✕</button>
					</div>
				</div>
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

.site {
	min-height: 100vh;
	background: #f4f4f5;
	color: #18181b;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	max-width: 896px;
	margin: 0 auto;
	padding: 32px 24px;
}

.title {
	font-size: 24px;
	font-weight: 700;
}

.add-form {
	margin-top: 16px;
}

.add-label {
	display: block;
	font-size: 14px;
	font-weight: 600;
}

.add-row {
	display: flex;
	gap: 8px;
	margin-top: 4px;
}

.add-input {
	flex: 1;
	min-width: 0;
	padding: 8px 12px;
	border: 1px solid #d4d4d8;
	border-radius: 8px;
	background: #ffffff;
}

.add-submit {
	padding: 8px 16px;
	border-radius: 8px;
	background: #3f3f46;
	font-weight: 600;
	color: #ffffff;
}

.add-input:focus-visible,
.add-submit:focus-visible,
.note-button:focus-visible {
	outline: 2px solid #18181b;
	outline-offset: 2px;
}

.message {
	min-height: 24px;
	margin-top: 8px;
	font-size: 14px;
	color: #e11d48;
}

.board {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 16px;
	margin-top: 8px;
}

.column {
	min-width: 0;
	border-radius: 12px;
	background: #e4e4e7;
	box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
}

.column-title {
	padding: 8px 12px;
	border-radius: 12px 12px 0 0;
	font-weight: 600;
	color: #ffffff;
	text-shadow: 0 1px 2px rgb(0 0 0 / 0.5);
}

.col-todo {
	background: #334155;
}

.col-doing {
	background: #d97706;
}

.col-done {
	background: #047857;
}

.count {
	margin-left: 4px;
	font-size: 14px;
	font-weight: 400;
}

.column-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
	min-height: 96px;
	padding: 12px;
}

.card {
	filter: drop-shadow(0 3px 3px rgb(0 0 0 / 0.12));
	transition: filter 300ms, translate 300ms;
}

.card[data-lifted] {
	translate: 0 -4px;
	filter: drop-shadow(0 9px 7px rgb(0 0 0 / 0.1));
}

.note {
	padding: 12px;
	background: #fde68a;
	clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
}

.note-title {
	font-weight: 500;
}

.note-actions {
	display: flex;
	gap: 4px;
	margin-top: 8px;
}

.note-button {
	padding: 2px 8px;
	border-radius: 4px;
	font-size: 14px;
}

.note-button:hover {
	background: rgb(0 0 0 / 0.1);
}

.note-button:disabled {
	color: #a1a1aa;
	cursor: not-allowed;
}

@media (max-width: 767px) {
	.board {
		grid-template-columns: minmax(0, 1fr);
	}
}

@media (prefers-reduced-motion: reduce) {
	.card {
		transition: none;
	}
}
```

`solution/script.js`

```js
const board = document.querySelector('[data-board]');
const form = document.querySelector('[data-form]');
const titleInput = document.querySelector('[data-title-input]');
const message = document.querySelector('[data-message]');
const template = document.querySelector('[data-card-template]');
const columns = ['todo', 'doing', 'done'];
const liftTime = 800;
let messageTimer = null;

function getList(name) {
	return board.querySelector(`[data-list="${name}"]`);
}

function getColumnName(card) {
	return card.closest('[data-column]').dataset.column;
}

function showMessage(text) {
	clearTimeout(messageTimer);
	message.textContent = text;
	messageTimer = setTimeout(function () {
		message.textContent = '';
	}, 3000);
}

function render() {
	columns.forEach(function (name) {
		const list = getList(name);
		list.closest('[data-column]').querySelector('[data-count]').textContent = list.children.length;
	});
	board.querySelectorAll('[data-card]').forEach(function (card) {
		const index = columns.indexOf(getColumnName(card));
		card.querySelector('[data-move="-1"]').disabled = index === 0;
		card.querySelector('[data-move="1"]').disabled = index === columns.length - 1;
	});
}

function liftCard(card) {
	clearTimeout(Number(card.dataset.timer));
	card.dataset.lifted = '';
	card.dataset.timer = setTimeout(function () {
		card.removeAttribute('data-lifted');
	}, liftTime);
}

function moveCard(card, step) {
	const from = columns.indexOf(getColumnName(card));
	const to = Math.max(0, Math.min(columns.length - 1, from + step));
	if (to === from) {
		return false;
	}
	const target = getList(columns[to]);
	const limit = Number(target.closest('[data-column]').dataset.limit);
	if (limit && target.children.length >= limit) {
		showMessage(`Cột này chỉ nhận tối đa ${limit} việc.`);
		return false;
	}
	target.append(card);
	liftCard(card);
	render();
	return true;
}

board.addEventListener('click', function (event) {
	const card = event.target.closest('[data-card]');
	if (!card) {
		return;
	}
	const moveButton = event.target.closest('[data-move]');
	if (moveButton) {
		if (moveCard(card, Number(moveButton.dataset.move))) {
			const focusTarget = moveButton.disabled ? card.querySelector('[data-move]:not(:disabled)') : moveButton;
			focusTarget.focus();
		}
		return;
	}
	if (event.target.closest('[data-remove]')) {
		const section = card.closest('[data-column]');
		card.remove();
		render();
		section.querySelector('[data-column-title]').focus();
	}
});

form.addEventListener('submit', function (event) {
	event.preventDefault();
	const title = new FormData(form).get('title').trim();
	if (title === '') {
		showMessage('Hãy nhập tên việc.');
		titleInput.focus();
		return;
	}
	const card = template.content.firstElementChild.cloneNode(true);
	card.querySelector('[data-card-title]').textContent = title;
	getList('todo').append(card);
	liftCard(card);
	form.reset();
	titleInput.focus();
	render();
});

render();
```

</details>

### Giải thích từng hàm

- `getList(name)`: hàm tự đặt, nhận tên cột, trả `<ul>` của cột đó.
- `getColumnName(card)`: hàm tự đặt, nhận một thẻ, trả tên cột chứa nó (`'todo'`, `'doing'` hoặc `'done'`).
- `showMessage(text)`: hàm tự đặt; `clearTimeout` hẹn giờ cũ, ghi chữ vào thông báo, rồi hẹn 3 giây xoá chữ.
- `render()`: hàm tự đặt; ghi số việc từng cột và khoá nút `←`/`→` theo cột của thẻ.
- `liftCard(card)`: hàm tự đặt; bật `data-lifted` cho thẻ trong 800 ms, mỗi thẻ có hẹn giờ riêng.
- `moveCard(card, step)`: hàm tự đặt; chuyển thẻ sang cột cách `step` cột, trả `true` nếu chuyển được, `false` nếu không.
- ``board.querySelector(`[data-list="${name}"]`)``: chuỗi mẫu dựng selector có giá trị biến; `querySelector` trả phần tử đầu tiên khớp hoặc `null`.
- `closest(selector)`: đi **ngược lên** từ phần tử, trả tổ tiên đầu tiên khớp (kể cả chính nó) hoặc `null`.
- `element.dataset.column`: đọc `data-column`, luôn là chuỗi. `card.dataset.lifted = ''` ghi `data-lifted=""`; `card.dataset.timer = ...` ghi `data-timer`, giá trị số được đổi thành chuỗi.
- `list.children.length`: `children` là các phần tử con trực tiếp (không có chữ), `length` là số lượng.
- `columns.indexOf(giá trị)`: trả vị trí đầu tiên của giá trị trong mảng, `-1` nếu không có.
- `Math.max(0, Math.min(columns.length - 1, from + step))`: `Math.min` lấy số nhỏ hơn rồi `Math.max` lấy số lớn hơn: chặn kết quả trong khoảng `0` đến `columns.length - 1`.
- `Number(x)`: đổi sang số; `Number(undefined)` ra `NaN` (không phải số, và là giá trị "sai" trong điều kiện).
- `limit && target.children.length >= limit`: `&&` đúng khi cả hai vế đúng; `NaN` là sai nên cột không giới hạn bỏ qua cả điều kiện.
- `target.append(card)`: gắn `card` làm con cuối của `target`. Nếu `card` đang ở chỗ khác thì **di chuyển** nó (và làm nó mất focus).
- `setTimeout(hàm, 800)`: hẹn chạy `hàm` sau 800 ms, trả mã hẹn giờ (số). `clearTimeout(mã)`: huỷ hẹn giờ; mã không hợp lệ như `NaN` thì không làm gì.
- `card.removeAttribute('data-lifted')`: gỡ hẳn thuộc tính khỏi phần tử.
- `event.target.closest('[data-move]')`: kiểm tra thao tác bấm có nằm trong một nút chuyển cột không.
- `moveButton.disabled`: `true` nếu nút đang bị khoá. `moveButton.disabled ? a : b`: toán tử ba ngôi, đúng ra `a`, sai ra `b`.
- `card.querySelector('[data-move]:not(:disabled)')`: tìm nút `data-move` **không** bị khoá; `:not(...)` phủ định selector bên trong.
- `focusTarget.focus()`: đưa focus bàn phím vào phần tử. Nút bị khoá không nhận được focus.
- `card.remove()`: gỡ phần tử khỏi trang.
- `if (!card) { return; }`: return sớm; bấm ra ngoài thẻ thì dừng hàm. `!` đảo đúng sai.
- `new FormData(form).get('title').trim()`: lấy chuỗi ô `title`, `trim()` cắt khoảng trắng hai đầu. `title === ''`: so sánh bằng chặt với chuỗi rỗng.
- `template.content.firstElementChild.cloneNode(true)`: lấy `<li>` đầu trong ruột template và nhân bản cả cây con.
- `form.reset()`: đưa mọi ô form về giá trị ban đầu. `event.preventDefault()`: chặn tải lại trang khi gửi form.
- `forEach(function (x) { ... })`: chạy hàm cho từng phần tử của mảng hoặc `NodeList`.
- Chuỗi mẫu `` `Cột này chỉ nhận tối đa ${limit} việc.` ``: dấu huyền; `${...}` chèn giá trị biến vào chuỗi.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `drop-shadow-md` trên `<li>` | `.card { filter: drop-shadow(0 3px 3px rgb(0 0 0 / 0.12)) }` |
| `data-lifted:drop-shadow-xl data-lifted:-translate-y-1` | `.card[data-lifted] { translate: 0 -4px; filter: drop-shadow(0 9px 7px rgb(0 0 0 / 0.1)) }` |
| `transition-[filter,translate] duration-300` | `.card { transition: filter 300ms, translate 300ms }` |
| `[clip-path:polygon(0_0,100%_0,100%_calc(100%_-_16px),calc(100%_-_16px)_100%,0_100%)]` | `.note { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%) }` |
| `text-shadow-sm text-shadow-black/50` | `.column-title { text-shadow: 0 1px 2px rgb(0 0 0 / 0.5) }` |
| `grid gap-4 md:grid-cols-3` | `.board { display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0, 1fr)) }` và `@media (max-width: 767px) { .board { grid-template-columns: minmax(0, 1fr) } }` |
| `disabled:cursor-not-allowed disabled:text-zinc-400` | `.note-button:disabled { cursor: not-allowed; color: #a1a1aa }` |

Khác biệt nhỏ: giá trị bóng Tailwind sinh ra là nhiều lớp bóng chồng nhau tuỳ phiên bản; lời giải dùng một lớp gần đúng nên bóng nhìn tương tự chứ không giống từng điểm ảnh. Bản Tailwind viết `md:grid-cols-3` (từ 768px), còn CSS thuần mặc định ba cột và đổi thành một cột dưới 768px.
