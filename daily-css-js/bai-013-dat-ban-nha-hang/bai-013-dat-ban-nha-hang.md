# Bài 013: Đặt bàn nhà hàng với ô chọn giờ kiểu `peer` và danh sách tự xếp thứ tự

Ngày học 5, bài 3/3, cấp 1, chủ đề CSS: Tổng ôn và mini project (ứng dụng đặt bàn), độ khó ★★★★★, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Tải lại trang thì danh sách đặt bàn trống, mọi khung giờ mở lại. Đây là hành vi đúng của bài.

## Mục tiêu

- Chọn một trong sáu khung giờ bằng ô radio **ẩn đi, vẽ lại thành nút bấm** (`sr-only` và `peer-checked:`). Bàn phím vẫn dùng được: Tab, mũi tên, thấy viền focus.
- Chỉnh số khách 1–8 bằng nút `−` và `+`; chạm giới hạn thì nút bị khoá.
- Bấm "Đặt bàn": thiếu giờ hoặc thiếu tên thì hiện lỗi 3 giây; đủ thì thêm một dòng đặt bàn có mã `#B01`, `#B02`..., **xếp đúng thứ tự giờ** dù đặt lúc nào, và dòng mới trượt vào mượt (`starting:`).
- Khung giờ đã đặt bị khoá trên ô chọn; bấm "Huỷ" ở dòng nào thì khung giờ đó mở lại. Dòng tóm tắt dính đáy luôn đúng: "Đã đặt x/6 khung giờ · y khách".
- Tự gặp hai cái bẫy: đặt `peer-checked:` sai chỗ, và xếp lại danh sách bằng `append` làm mọi dòng hiện lại từ đầu.

## Kết quả mong đợi

Đầu trang là dải gradient xanh "Đặt bàn Quán Lá Sen". Dưới là thẻ trắng với sáu nút giờ xếp ba cột; nút đang chọn nền xanh. Đặt 19:00 rồi 18:00: danh sách hiện 18:00 trước, 19:00 sau, hai nút giờ này xám và không bấm được. Một thanh kính mờ dính đáy màn hình ghi "Đã đặt 2/6 khung giờ · 5 khách".

## Tư duy

**Ô radio thật, nhưng ẩn đi.** Ô tròn của radio rất khó tô đẹp. Mẹo quen thuộc: giữ radio thật (để có bàn phím, `FormData`, `disabled` miễn phí) nhưng làm nó "vô hình" bằng `sr-only` (viết tắt của "chỉ dành cho trình đọc màn hình": thu còn 1px, vẫn nhận focus). Ngay sau nó là một `<span>` đẹp mắt đóng vai nút. Muốn `<span>` đổi màu khi radio được chọn, đánh dấu radio là `peer` và viết `peer-checked:` ở span: "khi **anh em đứng trước** có `peer` mà đang `:checked`". Từ khoá là **anh em đứng trước, cùng cha**: `<span>` phải nằm **ngay sau** `<input>` trong cùng một `<label>`. Đặt `peer-checked:` ở `<label>` (là cha của radio, không phải anh em) thì không có tác dụng và không báo lỗi gì.

**Danh sách có thứ tự, thêm đúng chỗ.** Có hai cách giữ danh sách theo giờ: sắp xếp lại toàn bộ rồi `append` từng dòng, hoặc tìm dòng đứng sau vị trí mới và chèn dòng mới ngay trước nó bằng `before()`. Cách đầu ngắn hơn, nhưng cái bẫy nằm ở `starting:`.

**Bẫy CSS và JS: `starting:` chạy mỗi lần phần tử được gắn vào trang.** `starting:opacity-0` (`@starting-style`) là kiểu dáng "trước khi xuất hiện" của phần tử vừa được gắn vào. `append` một phần tử **đang có sẵn** trong trang thực chất gỡ nó ra rồi gắn lại, nên nó cũng được tính là mới: cả danh sách nhấp nháy hiện lại từ đầu mỗi lần đặt bàn. Cách tránh: chỉ gắn dòng **mới** (`before` hoặc `append` cho dòng mới), đừng đụng tới các dòng cũ.

**Bẫy quen thuộc: hẹn giờ cũ.** Tin nhắn "Đã đặt bàn..." tự tắt sau 3 giây. Nếu đặt hai bàn liên tiếp, hẹn giờ của tin thứ nhất sẽ tắt tin thứ hai quá sớm, trừ khi bạn `clearTimeout` hẹn giờ cũ trước khi hẹn giờ mới (bài 008).

**DOM là nguồn dữ liệu.** Mỗi dòng đặt bàn mang `data-slot` và `data-guests`. Không có mảng riêng nào để giữ đồng bộ: hàm `render()` đọc thẳng các dòng đang có trong trang để khoá ô giờ, đếm khách và viết tóm tắt. Thêm hay huỷ bàn xong chỉ cần gọi `render()`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Ô giờ: ẩn radio (`sr-only`), nút chọn/khoá/focus theo trạng thái radio (`peer-checked:`, `peer-disabled:`, `peer-focus-visible:`) | Ghi `input.disabled` cho từng ô giờ |
| Dòng mới trượt vào (`starting:opacity-0 starting:-translate-y-3`) | Tạo dòng từ `template`, đặt đúng chỗ |
| Màu thông báo theo loại (`data-[type=error]:`) | Ghi `data-type` và chữ vào thông báo, hẹn giờ tắt |
| Nút số khách xám khi hết giới hạn (`disabled:`) | Ghi `disabled` theo số khách |
| Thanh tóm tắt dính đáy, kính mờ (`sticky bottom-4 backdrop-blur-md`) | Ghi chữ tóm tắt |

JS không thêm hoặc gỡ class, không đặt `style`, không tìm phần tử bằng class. JS chỉ tìm bằng thuộc tính `data-*` hoặc `name`.

## Ôn lại

- Bài 004 và 006: `sticky`, thanh dính đáy (`sticky bottom-0`) của giỏ hàng.
- Bài 009 (`bai-009-quiz-kinh-mo`): `backdrop-blur-md`, `supports-[backdrop-filter]:`, `FormData`, `submit` với `preventDefault`, trả focus.
- Bài 005 và 008: `template`, `cloneNode(true)`, `remove()`, uỷ quyền sự kiện với `closest`, `localeCompare`, `setTimeout`/`clearTimeout`.
- Bài 006 (`bai-006-gio-hang`): `Math.min/Math.max`, `reduce`, `disabled:`, `grid`.
- Bài 007 (`bai-007-the-thoi-tiet`): gradient `bg-linear-to-br`, `data-[...=...]:`.

## Gợi ý từng bước

> Starter đã điền sẵn: gradient đầu trang, thẻ form (`shadow-sm`), lưới `grid-cols-3`, màu chữ và viền, nút số khách với `disabled:`, thông báo `data-[type=error]:text-rose-600`, thanh tóm tắt `sticky bottom-4 backdrop-blur-md`, dòng đặt bàn trong `<template>` kèm `transition-[opacity,translate] duration-500`. **Bốn ô giờ đầu** (17:30, 18:00, 18:30, 19:00) đã có đủ class `peer`; **hai ô giờ cuối** (19:30, 20:00) chưa có class `peer` nào: bạn chép theo bốn ô đầu ở bước 2. `<li>` trong `<template>` chưa có class `starting:`.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-form`, sáu `<input type="radio" name="slot" value="17:30">`, `data-name`, `data-stepper` với hai nút `data-step="-1"` và `data-step="1"`, `data-guests-output` (thẻ `<output>`), `data-message` (có `role="status"`), `data-list-title` (có `tabindex="-1"` để nhận focus bằng JS), `data-empty`, `data-bookings` (danh sách), `data-summary`, `<template data-booking-template>`. `<form>` có `novalidate` để bạn tự kiểm tra lỗi bằng JS. Kiểm tra: ở bốn ô đầu bấm vào chữ giờ thì nền xanh; ở hai ô cuối bấm vào thì nhìn thấy vòng tròn radio mặc định nhỏ xíu cạnh chữ.

2. **CSS: ô giờ kiểu `peer`, và cái bẫy.** **Bạn làm:** trên **2 ô cuối** (19:30, 20:00). Với `<input>` thêm `peer sr-only`. Với `<span>` thêm `peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-600 peer-disabled:cursor-not-allowed peer-disabled:border-zinc-200 peer-disabled:bg-zinc-100 peer-disabled:text-zinc-400`. Làm **theo đúng thứ tự** để gặp bẫy ở ô 19:30: thêm `peer sr-only` vào input, nhưng dán các class `peer-checked:...` vào `<label>` thay vì `<span>`. Bấm 19:30: radio biến mất nhưng nút không đổi màu. Chuyển các class `peer-*` sang `<span>` đứng ngay sau input: nút đổi màu. Làm tiếp ô 20:00. Kiểm tra: bấm từng ô thì chỉ một ô xanh; Tab vào nhóm radio thấy viền focus quanh nút (không phải quanh vòng tròn đã ẩn); mũi tên trái/phải đổi ô.

3. **CSS: dòng đặt bàn trượt vào.** **Bạn làm:** `<li data-booking>` trong `<template>` thêm `starting:opacity-0 starting:-translate-y-3`. `starting:` là biến thể Tailwind sinh ra `@starting-style`: kiểu dáng ban đầu mà phần tử có ngay khi vừa được gắn vào trang, sau đó trình duyệt chuyển nó về kiểu dáng thường theo `transition` đã có sẵn. Chưa kiểm tra được ở bước này; làm xong bước 6 mới thấy dòng trượt vào.

4. **JS: số khách và nút `−`/`+`.** **Bạn làm:** toàn bộ JS. Lấy các phần tử bằng `querySelector` với selector thuộc tính. Khai báo `let guests = 2`, `const minGuests = 1`, `const maxGuests = 8`. Viết `renderGuests()`: ghi `guestsOutput.textContent = guests`, rồi `disabled` cho hai nút (`guests === minGuests`, `guests === maxGuests`). Dùng **một** `click` ở `[data-stepper]`: `event.target.closest('[data-step]')`, nếu `null` thì `return`; không thì `guests = Math.max(minGuests, Math.min(maxGuests, guests + Number(button.dataset.step)))` rồi `renderGuests()`. Gọi `renderGuests()` cuối file. Kiểm tra: bấm `−` ở 2 khách thành 1 và nút `−` xám; bấm `+` tới 8 thì nút `+` xám.

5. **JS: thông báo tự tắt (ôn bẫy hẹn giờ cũ).** **Bạn làm:** toàn bộ JS. Viết `showMessage(text, type)`: `clearTimeout(messageTimer)` trước hết (`let messageTimer = null` khai báo ngoài hàm), ghi `message.textContent`, `message.dataset.type = type` (`'error'` hoặc `'success'`), rồi `messageTimer = setTimeout(hàm, 3000)`; hàm hẹn giờ xoá chữ và gỡ `data-type` bằng `removeAttribute`. Kiểm tra: trong DevTools gọi `showMessage('Thử', 'error')` thì chữ đỏ, 3 giây sau biến mất; gọi hai lần cách nhau 2 giây thì chữ chỉ biến mất sau 3 giây kể từ lần gọi thứ hai.

6. **JS: gửi form và thêm dòng đặt bàn.** **Bạn làm:** toàn bộ JS. Gắn `submit` cho `form`, gọi `event.preventDefault()`. Lấy `const data = new FormData(form)`, `const slot = data.get('slot')` (`null` khi chưa chọn giờ), `const name = data.get('name').trim()`. Thiếu giờ thì `showMessage('Hãy chọn một khung giờ.', 'error')` rồi `return`; thiếu tên thì báo lỗi, `nameInput.focus()` rồi `return`. Viết `createBooking(slot, name, guestCount)`: tăng `counter` (`let counter = 0`); lấy dòng mẫu bằng `template.content.firstElementChild.cloneNode(true)` (`firstElementChild` là phần tử con đầu tiên của ruột template, tức chính `<li>`; `cloneNode(true)` nhân bản cả cây con); ghi `item.dataset.slot`, `item.dataset.guests`; điền chữ vào bốn chỗ bằng `item.querySelector('[data-booking-...]').textContent`. Mã đặt bàn: `` `#B${String(counter).padStart(2, '0')}` ``; `padStart(độ dài, ký tự đệm)` thêm ký tự đệm vào **đầu** chuỗi cho đủ độ dài: `'1'.padStart(2, '0')` là `'01'`. Tạm thời thêm dòng bằng `list.append(item)`. Sau khi thêm: `form.reset()` (trả mọi ô về ban đầu, khác sự kiện `reset` ở bài 012: chỉ là gọi hàm), `guests = 2`, `renderGuests()`, `showMessage(..., 'success')`. Kiểm tra: đặt 19:00 rồi 18:00: hai dòng hiện, nhưng 19:00 đứng trước 18:00 (chưa xếp thứ tự), dòng mới trượt vào từ trên xuống.

7. **JS: xếp đúng thứ tự giờ, khoá ô giờ, tóm tắt.** **Bạn làm:** toàn bộ JS. Viết `getBookings()` trả `Array.from(list.querySelectorAll('[data-booking]'))`. Trước hết thử **cách có bẫy**: trong `createBooking`, sau khi `append`, sắp xếp bằng `getBookings().sort(function (a, b) { return a.dataset.slot.localeCompare(b.dataset.slot); })` rồi `forEach` `list.append(booking)`. Đặt vài bàn và để ý: mỗi lần đặt, **cả danh sách** nhấp nháy mờ rồi hiện lại. Sửa: bỏ `sort`, chỉ chèn dòng mới. Dùng `getBookings().find(function (booking) { return booking.dataset.slot.localeCompare(slot) > 0; })` để tìm dòng đầu tiên có giờ **sau** giờ mới (`find` trả phần tử đầu tiên thoả hàm, hoặc `undefined`). Nếu tìm được thì `later.before(item)`, không thì `list.append(item)`. `before(node)` chèn `node` ngay trước phần tử gọi nó, và chỉ gắn `node` vào trang, không đụng tới các dòng khác. Viết `render()`: `const takenSlots = bookings.map(...)` lấy mảng giờ đã đặt; `slotInputs.forEach(function (input) { input.disabled = takenSlots.includes(input.value); })` (`includes(giá trị)` trả `true` nếu mảng có giá trị đó); `empty.hidden = bookings.length > 0` (thuộc tính `hidden` ẩn hoặc hiện phần tử); `bookings.reduce(function (sum, booking) { return sum + Number(booking.dataset.guests); }, 0)` cho tổng khách; ghi `summary.textContent`. Gọi `render()` sau khi đặt và cuối file. Kiểm tra: đặt 20:00, 18:00, 19:00 theo thứ tự đó, danh sách luôn 18:00, 19:00, 20:00; chỉ dòng mới trượt vào; ba ô giờ đó xám và không bấm được; tóm tắt "Đã đặt 3/6 khung giờ · x khách".

8. **JS: huỷ bàn và trả focus.** **Bạn làm:** toàn bộ JS. Gắn **một** `click` ở `[data-bookings]`: `event.target.closest('[data-cancel]')`, `null` thì `return`. Lấy dòng bằng `button.closest('[data-booking]')`, đọc `slot` từ `dataset` **trước** khi gỡ, rồi `booking.remove()`, `render()`, `listTitle.focus()` (nút vừa bị gỡ nên focus rơi mất, ta trả focus về tiêu đề danh sách, đã có `tabindex="-1"`), và `showMessage(...)`. Kiểm tra: huỷ dòng 19:00 thì ô 19:00 mở lại, tóm tắt giảm; dòng "Chưa có bàn nào được đặt." hiện lại khi huỷ hết.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `sr-only` | `position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border-width: 0` |
| `peer` (trên input) và `peer-checked:bg-emerald-600` (trên span) | `.slot-input:checked + .slot-pill { background: #059669 }` |
| `peer-focus-visible:outline-2` | `.slot-input:focus-visible + .slot-pill { outline: 2px solid ... }` |
| `peer-disabled:bg-zinc-100` | `.slot-input:disabled + .slot-pill { background: #f4f4f5 }` |
| `starting:opacity-0` | `@starting-style { .booking { opacity: 0 } }` |
| `starting:-translate-y-3` | `@starting-style { .booking { translate: 0 -12px } }` |
| `transition-[opacity,translate] duration-500` | `transition: opacity 500ms, translate 500ms` |
| `sticky bottom-4` | `position: sticky; bottom: 16px` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Sáu ô giờ: bấm chọn đổi màu, chỉ một ô được chọn; không thấy vòng tròn radio nào.
- [ ] Đặt không chọn giờ: báo "Hãy chọn một khung giờ."; chọn giờ không nhập tên: báo thiếu tên và focus nhảy vào ô tên; thông báo tự mất sau 3 giây; hai thao tác liên tiếp không làm tin thứ hai tắt sớm.
- [ ] Số khách chỉ từ 1 đến 8, nút chạm giới hạn thì xám; sau khi đặt, số khách về 2 và form trống.
- [ ] Đặt theo thứ tự 20:00, 18:00, 19:00: danh sách luôn xếp 18:00, 19:00, 20:00; mỗi lần đặt **chỉ** dòng mới trượt vào, các dòng cũ đứng yên.
- [ ] Giờ đã đặt bị khoá trên ô chọn; huỷ thì mở lại; mã đặt bàn tăng dần (`#B01`, `#B02`...), huỷ rồi đặt lại không trùng mã.
- [ ] DevTools: gỡ `peer` khỏi một `<input>` thì nút giờ đó không còn đổi màu khi chọn. Gỡ `sr-only` thì hiện lại vòng tròn radio. Dời `<span>` lên trước `<input>` (kéo thả trong DevTools) thì `peer-checked:` hết tác dụng.
- [ ] Bàn phím: Tab tới nhóm giờ, dùng mũi tên chọn, thấy viền focus quanh nút giờ; Enter ở ô tên gửi form; Tab tới "Huỷ" và nhấn Enter huỷ được, focus về tiêu đề danh sách.
- [ ] Bật `prefers-reduced-motion: reduce` trong DevTools: dòng mới hiện tức thì, không trượt; nút giờ đổi màu tức thì.
- [ ] Tự hỏi: vì sao `<span>` phải đứng **sau** `<input>` mà không thể đứng trước? Vì sao ô giờ bị `disabled` thì `FormData` không còn nhận nó, và điều đó có gây hại gì ở đây không? Vì sao dùng `before()` mà không `sort` rồi `append` hết?

## Thử thách thêm

1. Tính cả sức chứa: mỗi khung giờ nhận tối đa 8 khách, hai bàn cùng giờ cho phép nếu tổng không quá 8. Gợi ý: bỏ khoá `disabled` theo giờ, thay bằng kiểm tra bằng `reduce` khi gửi form; ô giờ nào đã đầy mới `disabled`. Không cần class mới.
2. Thêm nút "Xoá hết" có hộp xác nhận. Gợi ý: thẻ `<dialog>` hoặc cách của bài 003, `getBookings().forEach(function (booking) { booking.remove(); })`, class `focus-visible:` và `disabled:` khi danh sách trống.

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
		<title>Bài 013 - Đặt bàn nhà hàng</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<header class="hero">
			<h1 class="hero-title">Đặt bàn Quán Lá Sen</h1>
			<p class="hero-sub">Tối nay, sáu khung giờ, mỗi khung giờ một bàn.</p>
		</header>
		<main class="page">
			<form data-form novalidate class="booking-form">
				<fieldset>
					<legend class="legend">Chọn khung giờ</legend>
					<div class="slot-grid">
						<label class="slot">
							<input type="radio" name="slot" value="17:30" class="slot-input" />
							<span class="slot-pill">17:30</span>
						</label>
						<label class="slot">
							<input type="radio" name="slot" value="18:00" class="slot-input" />
							<span class="slot-pill">18:00</span>
						</label>
						<label class="slot">
							<input type="radio" name="slot" value="18:30" class="slot-input" />
							<span class="slot-pill">18:30</span>
						</label>
						<label class="slot">
							<input type="radio" name="slot" value="19:00" class="slot-input" />
							<span class="slot-pill">19:00</span>
						</label>
						<label class="slot">
							<input type="radio" name="slot" value="19:30" class="slot-input" />
							<span class="slot-pill">19:30</span>
						</label>
						<label class="slot">
							<input type="radio" name="slot" value="20:00" class="slot-input" />
							<span class="slot-pill">20:00</span>
						</label>
					</div>
				</fieldset>
				<div>
					<label for="guest-name" class="field-label">Tên người đặt</label>
					<input id="guest-name" type="text" name="name" data-name autocomplete="off" class="text-input" />
				</div>
				<div class="stepper-row">
					<span class="field-label">Số khách</span>
					<div data-stepper class="stepper">
						<button type="button" data-step="-1" aria-label="Giảm số khách" class="step-button">−</button>
						<output data-guests-output class="guests-output">2</output>
						<button type="button" data-step="1" aria-label="Tăng số khách" class="step-button">+</button>
					</div>
				</div>
				<p data-message role="status" class="message"></p>
				<button type="submit" class="submit-button">Đặt bàn</button>
			</form>
			<section>
				<h2 data-list-title tabindex="-1" class="list-title">Danh sách đặt bàn</h2>
				<p data-empty class="empty">Chưa có bàn nào được đặt.</p>
				<ul data-bookings class="booking-list"></ul>
			</section>
			<p data-summary aria-live="polite" class="summary"></p>
		</main>
		<template data-booking-template>
			<li data-booking class="booking">
				<div>
					<p data-booking-code class="booking-code"></p>
					<p data-booking-time class="booking-time"></p>
					<p class="booking-who"><span data-booking-name></span> · <span data-booking-guests></span></p>
				</div>
				<button type="button" data-cancel class="cancel-button">Huỷ</button>
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

button,
input {
	font: inherit;
	color: inherit;
}

button {
	background: none;
	cursor: pointer;
}

ul {
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
	background: #ecfdf5;
	color: #18181b;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.hero {
	background: linear-gradient(to bottom right, #059669, #0f766e);
	padding: 40px 24px;
	color: #ffffff;
}

.hero-title {
	margin: 0 auto;
	max-width: 576px;
	font-size: 24px;
	line-height: 32px;
	font-weight: 700;
}

.hero-sub {
	margin: 4px auto 0;
	max-width: 576px;
	font-size: 14px;
	line-height: 20px;
	color: #d1fae5;
}

.page {
	margin: 0 auto;
	max-width: 576px;
	padding: 32px 24px;
}

.booking-form {
	display: flex;
	flex-direction: column;
	gap: 20px;
	border: 1px solid #d1fae5;
	border-radius: 16px;
	background: #ffffff;
	padding: 20px;
	box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.legend,
.field-label {
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
}

.field-label {
	display: block;
}

.slot-grid {
	margin-top: 8px;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 8px;
}

.slot-input {
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

.slot-pill {
	display: block;
	cursor: pointer;
	border: 1px solid #d4d4d8;
	border-radius: 8px;
	background: #ffffff;
	padding: 8px 0;
	text-align: center;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	color: #3f3f46;
	transition: color 150ms, background-color 150ms, border-color 150ms;
}

.slot-input:checked + .slot-pill {
	border-color: #059669;
	background: #059669;
	color: #ffffff;
}

.slot-input:focus-visible + .slot-pill {
	outline: 2px solid #059669;
	outline-offset: 2px;
}

.slot-input:disabled + .slot-pill {
	cursor: not-allowed;
	border-color: #e4e4e7;
	background: #f4f4f5;
	color: #a1a1aa;
}

.text-input {
	margin-top: 4px;
	display: block;
	width: 100%;
	border: 1px solid #d4d4d8;
	border-radius: 8px;
	padding: 8px 12px;
	font-size: 14px;
	line-height: 20px;
}

.stepper-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.stepper {
	display: flex;
	align-items: center;
	gap: 12px;
}

.step-button {
	width: 36px;
	height: 36px;
	border: 1px solid #d4d4d8;
	border-radius: 9999px;
	font-size: 18px;
	line-height: 28px;
	font-weight: 600;
}

.step-button:disabled {
	cursor: not-allowed;
	color: #d4d4d8;
}

.guests-output {
	width: 32px;
	text-align: center;
	font-weight: 600;
	font-variant-numeric: tabular-nums;
}

.message {
	min-height: 20px;
	font-size: 14px;
	line-height: 20px;
}

.message[data-type="error"] {
	color: #e11d48;
}

.message[data-type="success"] {
	color: #047857;
}

.submit-button {
	border-radius: 8px;
	background: #059669;
	padding: 10px 16px;
	font-weight: 600;
	color: #ffffff;
}

.text-input:focus-visible,
.step-button:focus-visible,
.submit-button:focus-visible {
	outline: 2px solid #059669;
	outline-offset: 2px;
}

.list-title {
	margin-top: 32px;
	font-size: 18px;
	line-height: 28px;
	font-weight: 600;
}

.empty {
	margin-top: 12px;
	font-size: 14px;
	line-height: 20px;
	color: #71717a;
}

.empty[hidden] {
	display: none;
}

.booking-list {
	margin-top: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.booking {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 1px solid #d1fae5;
	border-radius: 12px;
	background: #ffffff;
	padding: 12px 16px;
	box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	transition: opacity 500ms, translate 500ms;
}

@starting-style {
	.booking {
		opacity: 0;
		translate: 0 -12px;
	}
}

.booking-code {
	font-size: 12px;
	line-height: 16px;
	color: #71717a;
}

.booking-time {
	font-size: 18px;
	line-height: 28px;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
}

.booking-who {
	font-size: 14px;
	line-height: 20px;
	color: #52525b;
}

.cancel-button {
	border: 1px solid #fecdd3;
	border-radius: 8px;
	padding: 6px 12px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	color: #be123c;
}

.cancel-button:focus-visible {
	outline: 2px solid #f43f5e;
	outline-offset: 2px;
}

.summary {
	position: sticky;
	bottom: 16px;
	margin-top: 24px;
	border: 1px solid rgb(255 255 255 / 0.6);
	border-radius: 16px;
	background: rgb(255 255 255 / 0.9);
	padding: 12px 16px;
	text-align: center;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	backdrop-filter: blur(12px);
}

@supports (backdrop-filter: blur(1px)) {
	.summary {
		background: rgb(255 255 255 / 0.6);
	}
}

@media (prefers-reduced-motion: reduce) {
	.slot-pill,
	.booking {
		transition: none;
	}
}
```

`solution/script.js`

```js
const form = document.querySelector('[data-form]');
const slotInputs = Array.from(form.querySelectorAll('input[name="slot"]'));
const nameInput = form.querySelector('[data-name]');
const stepper = form.querySelector('[data-stepper]');
const decreaseButton = stepper.querySelector('[data-step="-1"]');
const increaseButton = stepper.querySelector('[data-step="1"]');
const guestsOutput = form.querySelector('[data-guests-output]');
const message = document.querySelector('[data-message]');
const listTitle = document.querySelector('[data-list-title]');
const list = document.querySelector('[data-bookings]');
const empty = document.querySelector('[data-empty]');
const summary = document.querySelector('[data-summary]');
const template = document.querySelector('[data-booking-template]');
const minGuests = 1;
const maxGuests = 8;
const defaultGuests = 2;
let guests = defaultGuests;
let counter = 0;
let messageTimer = null;

function getBookings() {
	return Array.from(list.querySelectorAll('[data-booking]'));
}

function showMessage(text, type) {
	clearTimeout(messageTimer);
	message.textContent = text;
	message.dataset.type = type;
	messageTimer = setTimeout(function () {
		message.textContent = '';
		message.removeAttribute('data-type');
	}, 3000);
}

function renderGuests() {
	guestsOutput.textContent = guests;
	decreaseButton.disabled = guests === minGuests;
	increaseButton.disabled = guests === maxGuests;
}

function render() {
	const bookings = getBookings();
	const takenSlots = bookings.map(function (booking) {
		return booking.dataset.slot;
	});
	const totalGuests = bookings.reduce(function (sum, booking) {
		return sum + Number(booking.dataset.guests);
	}, 0);
	slotInputs.forEach(function (input) {
		input.disabled = takenSlots.includes(input.value);
	});
	empty.hidden = bookings.length > 0;
	summary.textContent = `Đã đặt ${bookings.length}/${slotInputs.length} khung giờ · ${totalGuests} khách`;
}

function createBooking(slot, name, guestCount) {
	counter += 1;
	const item = template.content.firstElementChild.cloneNode(true);
	item.dataset.slot = slot;
	item.dataset.guests = guestCount;
	item.querySelector('[data-booking-code]').textContent = `#B${String(counter).padStart(2, '0')}`;
	item.querySelector('[data-booking-time]').textContent = slot;
	item.querySelector('[data-booking-name]').textContent = name;
	item.querySelector('[data-booking-guests]').textContent = `${guestCount} khách`;
	const later = getBookings().find(function (booking) {
		return booking.dataset.slot.localeCompare(slot) > 0;
	});
	if (later) {
		later.before(item);
	} else {
		list.append(item);
	}
}

stepper.addEventListener('click', function (event) {
	const button = event.target.closest('[data-step]');
	if (!button) {
		return;
	}
	guests = Math.max(minGuests, Math.min(maxGuests, guests + Number(button.dataset.step)));
	renderGuests();
});

form.addEventListener('submit', function (event) {
	event.preventDefault();
	const data = new FormData(form);
	const slot = data.get('slot');
	const name = data.get('name').trim();
	if (slot === null) {
		showMessage('Hãy chọn một khung giờ.', 'error');
		return;
	}
	if (name === '') {
		showMessage('Hãy nhập tên người đặt.', 'error');
		nameInput.focus();
		return;
	}
	createBooking(slot, name, guests);
	form.reset();
	guests = defaultGuests;
	renderGuests();
	render();
	showMessage(`Đã đặt bàn lúc ${slot} cho ${name}.`, 'success');
});

list.addEventListener('click', function (event) {
	const button = event.target.closest('[data-cancel]');
	if (!button) {
		return;
	}
	const booking = button.closest('[data-booking]');
	const slot = booking.dataset.slot;
	booking.remove();
	render();
	listTitle.focus();
	showMessage(`Đã huỷ bàn lúc ${slot}.`, 'success');
});

renderGuests();
render();
```

</details>

### Giải thích từng hàm

- `getBookings()`: không nhận tham số, trả mảng các dòng đặt bàn hiện có trong danh sách theo thứ tự trên trang.
- `showMessage(text, type)`: hiện thông báo `text` với loại `type` (`'error'` hoặc `'success'`), rồi hẹn 3 giây xoá. Trước khi hẹn, gọi `clearTimeout` để huỷ hẹn giờ của thông báo trước. Không trả về gì.
- `renderGuests()`: ghi số khách vào `<output>` và khoá nút `−` hoặc `+` khi chạm giới hạn.
- `render()`: đọc các dòng đặt bàn hiện có, khoá ô giờ đã đặt, ẩn hoặc hiện dòng "Chưa có bàn nào", ghi tóm tắt. Gọi sau mỗi lần thêm hoặc huỷ bàn.
- `createBooking(slot, name, guestCount)`: tạo một dòng từ `template`, điền dữ liệu và mã đặt bàn, chèn vào đúng vị trí theo giờ. Không trả về gì.
- `document.querySelector(selector)` và `querySelectorAll(selector)`: trả phần tử đầu tiên khớp (hoặc `null`) và `NodeList` mọi phần tử khớp. `input[name="slot"]` là selector thuộc tính theo `name`. `Array.from(nodeList)` đổi `NodeList` thành mảng thật.
- `new FormData(form)` và `data.get('slot')`: gom giá trị các ô của form; `get(tên)` trả chuỗi của ô có tên đó, hoặc `null` nếu không có (radio chưa chọn, hoặc ô bị `disabled`).
- `string.trim()`: cắt khoảng trắng ở hai đầu chuỗi, trả chuỗi mới. `'  Lan  '` thành `'Lan'`.
- `event.preventDefault()`: chặn hành vi mặc định của sự kiện. Ở `submit` là chặn trang tải lại.
- `form.reset()`: đưa mọi ô của form về giá trị ban đầu (radio bỏ chọn, ô tên rỗng). Gọi thẳng như hàm, không liên quan tới việc lắng nghe sự kiện `reset`.
- `element.focus()`: đưa focus bàn phím vào phần tử. Phần tử không tự nhận focus (như tiêu đề) cần `tabindex="-1"`.
- `template.content.firstElementChild.cloneNode(true)`: `content` là ruột của `<template>`; `firstElementChild` là phần tử con đầu tiên (tức `<li>`); `cloneNode(true)` nhân bản phần tử cùng toàn bộ phần tử con (tham số `true`; `false` chỉ nhân đúng thẻ ngoài). Trả về phần tử mới chưa gắn vào trang.
- `element.dataset`: object chứa mọi `data-*`, tên camelCase. Ghi `item.dataset.slot = '18:00'` đặt `data-slot="18:00"`; giá trị luôn là chuỗi.
- `element.textContent = giá trị`: gán chữ cho phần tử, coi giá trị là chữ thường. Số được đổi thành chuỗi.
- `String(counter).padStart(2, '0')`: `String(...)` đổi số thành chuỗi; `padStart(độ dài, ký tự đệm)` đệm thêm vào đầu chuỗi cho đủ độ dài, trả chuỗi mới. `'3'.padStart(2, '0')` là `'03'`.
- `array.map(function (item) { ... })`: trả mảng mới gồm kết quả của hàm với từng phần tử. Ở đây lấy mảng giờ từ mảng dòng đặt bàn.
- `array.reduce(function (sum, item) { ... }, 0)`: gộp mảng thành một giá trị. Tham số thứ hai `0` là giá trị khởi đầu của `sum`; mỗi lượt hàm trả về `sum` mới. Dùng để cộng tổng số khách.
- `array.forEach(function (item) { ... })`: gọi hàm cho từng phần tử của mảng, trả `undefined`. Dùng để khoá hoặc mở từng ô giờ.
- `array.includes(value)`: trả `true` nếu mảng chứa `value` (so sánh chặt chẽ), ngược lại `false`.
- `array.find(function (item) { ... })`: trả phần tử đầu tiên mà hàm trả `true`, hoặc `undefined` nếu không có. Dùng để tìm dòng đứng sau vị trí mới.
- `a.localeCompare(b)`: so sánh hai chuỗi theo thứ tự chữ cái; trả số âm nếu `a` đứng trước `b`, `0` nếu bằng nhau, số dương nếu `a` đứng sau `b`. Với giờ dạng `HH:MM` cho đúng thứ tự thời gian.
- `later.before(item)`: chèn `item` ngay trước `later` trong cùng cha. `list.append(item)`: chèn `item` vào cuối `list`. Cả hai chỉ gắn `item`, không đụng các phần tử khác.
- `booking.remove()`: gỡ phần tử khỏi trang. `element.closest(selector)`: đi từ phần tử lên các tổ tiên, trả phần tử đầu tiên khớp hoặc `null`.
- `element.hidden`, `input.disabled`: thuộc tính nhận `true` hoặc `false`. `hidden` ẩn phần tử, `disabled` khoá ô không cho bấm và loại nó khỏi `FormData`.
- `Math.max(a, b)` và `Math.min(a, b)`: trả số lớn hơn và số nhỏ hơn; lồng hai hàm để kẹp số khách vào 1–8. `Number(text)`: đổi chuỗi thành số.
- `setTimeout(hàm, ms)` và `clearTimeout(id)`: hẹn chạy `hàm` sau `ms` mili giây và trả `id`; `clearTimeout(id)` huỷ lần hẹn đó (với `null` thì không làm gì).
- `setAttribute`/`removeAttribute(name)`: ở bài này chỉ dùng `removeAttribute('data-type')` để gỡ thuộc tính.
- `addEventListener(loại, hàm)`: đăng ký hàm chạy khi có sự kiện; truyền tên hàm hoặc hàm vô danh, không thêm `()`. `event.target` là phần tử đã bị bấm.
- `if (!button) { return; }`: `!` đảo đúng sai; `null` là "sai" nên `!button` là `true` khi bấm ra ngoài nút. `return` sớm thoát hàm.
- `===` và `!==`: so sánh bằng nhau và khác nhau chặt chẽ. `slot === null` kiểm tra radio chưa chọn.
- `` `...${biểu thức}...` ``: chuỗi mẫu, nhúng giá trị vào chuỗi.
- `+=`: cộng rồi gán, `counter += 1` tăng `counter` thêm 1.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `peer sr-only` trên `<input>` | `.slot-input { position: absolute; width: 1px; height: 1px; ...; clip-path: inset(50%) }` |
| `peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-checked:text-white` | `.slot-input:checked + .slot-pill { border-color: #059669; background: #059669; color: #ffffff }` |
| `peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ...` | `.slot-input:focus-visible + .slot-pill { outline: 2px solid #059669; outline-offset: 2px }` |
| `peer-disabled:...` | `.slot-input:disabled + .slot-pill { cursor: not-allowed; ... }` |
| `starting:opacity-0 starting:-translate-y-3` | `@starting-style { .booking { opacity: 0; translate: 0 -12px } }` |
| `transition-[opacity,translate] duration-500` | `.booking { transition: opacity 500ms, translate 500ms }` |
| `data-[type=error]:text-rose-600` | `.message[data-type="error"] { color: #e11d48 }` |
| `sticky bottom-4 backdrop-blur-md supports-[backdrop-filter]:bg-white/60` | `.summary { position: sticky; bottom: 16px; backdrop-filter: blur(12px) }` và `@supports (backdrop-filter: blur(1px)) { .summary { background: rgb(255 255 255 / 0.6) } }` |

Khác biệt nhỏ: Tailwind viết `starting:` thành `@starting-style` lồng trong từng class; bản CSS thuần đặt một khối `@starting-style` ở ngoài cùng. Kết quả như nhau.
