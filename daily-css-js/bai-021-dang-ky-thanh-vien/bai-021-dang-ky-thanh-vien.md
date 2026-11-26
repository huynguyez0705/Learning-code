# Bài 021: Đăng ký thành viên, kiểm tra form bằng validity và cái bẫy setCustomValidity

Ngày học 8, bài 2/3, cấp 2, chủ đề CSS: Tổng ôn và mini project (ứng dụng form đăng ký câu lạc bộ), độ khó ★★★★☆, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Bấm "Đăng ký" chỉ hiện màn hình chào mừng; tải lại trang thì form trống như ban đầu. Đây là hành vi đúng của bài.

## Mục tiêu

- Mỗi ô có thông báo lỗi tiếng Việt đúng với lỗi đang gặp (thiếu, quá ngắn, sai dạng, quá trẻ), nhưng **chỉ hiện sau khi bạn đã rời ô đó** (trạng thái "đã chạm").
- Viền ô đổi đỏ khi lỗi và xanh khi hợp lệ, cũng chỉ sau khi đã chạm. Lúc mới mở trang, không ô nào bị đỏ.
- Ô ngày sinh tự không cho chọn ngày làm bạn dưới 16 tuổi (tính từ ngày hôm nay bằng `Date`).
- Thanh độ mạnh mật khẩu đổi độ dài và màu theo 5 tiêu chí; ô "Nhập lại mật khẩu" báo lỗi khi không khớp và hết lỗi ngay khi khớp lại (cái bẫy `setCustomValidity`).
- Bấm "Đăng ký" khi còn lỗi: mọi ô hiện lỗi, con trỏ nhảy vào ô lỗi đầu tiên. Khi hợp lệ: hiện lời chào kèm ngày sinh viết đầy đủ.

## Kết quả mong đợi

Một thẻ kính tối với sáu ô: tên đăng nhập, email, ngày sinh, mật khẩu (kèm thanh độ mạnh), nhập lại mật khẩu, ô đồng ý nội quy. Thanh dưới dính đáy thẻ cho biết "Còn 6 ô chưa hợp lệ" và có nút "Đăng ký". Gõ `ab` vào tên đăng nhập rồi bấm Tab: viền đỏ, dòng lỗi "Tên đăng nhập cần ít nhất 4 ký tự." Gõ lại cho đủ: viền xanh, dòng lỗi biến mất, bộ đếm giảm một. Đăng ký thành công thì form biến mất, hiện "Chào lan_nguyen! Ngày sinh của bạn là 1 tháng 5, 2000."

## Tư duy

**Trình duyệt đã biết kiểm tra, bạn chỉ cần hỏi.** Các thuộc tính HTML `required`, `minlength`, `pattern`, `type="email"`, `max` đã khai báo luật. Mỗi ô có đối tượng `field.validity` (kiểu `ValidityState`) ghi lý do cụ thể: `valueMissing` (thiếu), `tooShort` (ngắn hơn `minlength`), `patternMismatch` (sai `pattern`), `typeMismatch` (sai dạng email), `rangeOverflow` (vượt `max`), `customError` (lỗi do bạn tự đặt). `field.validity.valid` là `true` khi không dính lỗi nào. Ta thêm `novalidate` vào form để trình duyệt **không** tự bật bong bóng báo lỗi bằng tiếng Anh, mà tự vẽ lời báo tiếng Việt.

**Hai trạng thái khác nhau: "hợp lệ" và "đã chạm".** Ô trống bắt buộc **luôn** là `:invalid`, ngay khi trang vừa mở. Nếu CSS chỉ dùng `invalid:border-rose-500` thì cả form đỏ rực trước khi người dùng làm gì sai. Giải pháp là thêm một trạng thái thứ hai do JS ghi: `data-touched`, đặt khi ô mất focus. CSS chỉ báo lỗi khi cả hai cùng đúng: `data-touched:invalid:`. Giống thầy giáo chỉ chấm bài sau khi em nộp, không chấm tờ giấy trắng còn nằm trên bàn.

**Cái bẫy: `setCustomValidity` không tự quên.** `setCustomValidity('Chưa khớp')` đánh dấu ô là lỗi cho tới khi bạn gọi lại `setCustomValidity('')` với chuỗi **rỗng**. Nếu chỉ viết "khi lệch thì đặt lỗi" mà quên nhánh xoá, ô "Nhập lại mật khẩu" bị kẹt ở trạng thái lỗi mãi dù người dùng đã gõ đúng, và form không bao giờ gửi được. Vì thế hàm kiểm tra phải luôn chạy cả hai nhánh (đặt hoặc xoá), và phải chạy lại khi **mật khẩu gốc** đổi, không chỉ khi ô nhập lại đổi.

**`focusout` thay cho `blur`.** Sự kiện `blur` không nổi bọt lên form, nên không uỷ quyền được. `focusout` làm cùng việc nhưng nổi bọt, nên một listener ở form nghe được mọi ô. `input` thì vốn đã nổi bọt.

**Ngày tháng và múi giờ.** `new Date('2000-05-01')` hiểu chuỗi đó là nửa đêm theo giờ UTC. Nếu định dạng bằng múi giờ máy (ở Mỹ chẳng hạn) có thể ra "30 tháng 4". Vì vậy khi định dạng ngày sinh ta truyền `timeZone: 'UTC'` cho `Intl.DateTimeFormat`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Viền đỏ/xanh bằng `data-touched:invalid:` và `data-touched:valid:` | Ghi `data-touched` khi ô mất focus |
| Thanh độ mạnh `w-(--pct)` và màu `group-data-[level=...]:` | Ghi `data-level` và `--pct` |
| Thanh dưới dính đáy `sticky bottom-0` kính mờ, `placeholder:` | Đọc `validity`, viết thông báo lỗi, đếm ô chưa hợp lệ |
| Khoá/hiện bằng thuộc tính `hidden` | `setCustomValidity`, `checkValidity`, chuyển màn hình thành công |

JS không thêm hoặc gỡ class, không đổi `style.borderColor`, không tìm phần tử bằng class (chỉ dùng `data-*`, `name` và `form.elements`).

## Ôn lại

- Bài 013 (`bai-013-dat-ban-nha-hang`): `sticky bottom-0` kèm `backdrop-blur-md`, gradient, `padStart`, `form.reset()`, `FormData`.
- Bài 015 (`bai-015-theo-doi-uong-nuoc`): `style.setProperty('--pct', ...)` với `w-(--pct)`, `toggleAttribute(tên, force)`.
- Bài 009 (`bai-009-quiz-kinh-mo`): `submit` với `preventDefault`, trả focus.
- Bài 007 (`bai-007-the-thoi-tiet`) và bài 012: `data-[...]:` / `group-data-[...]:` đổi màu theo trạng thái.
- Bài 016 (`bai-016-bang-viec-the-dan`): `transition-[...]`, `disabled:`; bài 014: uỷ quyền sự kiện và `closest`.
- Bài 018 (`bai-018-ket-sat-ma-pin`): biểu thức chính quy `/^[0-9]$/.test(...)`.

## Gợi ý từng bước

> Starter đã điền sẵn: toàn bộ bố cục, thẻ, thanh dưới dính đáy, nút, viền focus, thanh độ mạnh (`w-(--pct)`, `group-data-[level=...]:`, `transition-[width]`), `novalidate` trên form, `aria-describedby`, và **ba ô nhập đầu** (tên đăng nhập, email, ngày sinh) đã có `placeholder:text-slate-500` (riêng ngày sinh không có placeholder) cùng `data-touched:invalid:border-rose-500 data-touched:valid:border-emerald-500`. Hai ô nhập cuối (mật khẩu, nhập lại mật khẩu) bạn tự thêm. Phần còn lại chủ yếu là JS.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-field` (mọi ô cần kiểm tra), `name` (khoá để tra `form.elements`), `data-error-for` (chỗ viết lỗi, trùng `name` của ô), `data-meter` (có `data-level` và biến `--pct`), `data-strength-text`, `data-remaining`, `data-success` (có `hidden`), `data-success-text`, `data-restart`. Ô `username` có `required minlength pattern`; `email` có `type="email"`; `birth` là `type="date"` chưa có `max`. Kiểm tra: mở trang thấy ba ô đầu chưa đỏ (vì chưa chạm), form chưa có lời lỗi nào.

2. **JS: giới hạn ngày sinh bằng `Date`.** **Bạn làm:** toàn bộ JS. Viết `setBirthLimit()`: tạo `new Date()` (hôm nay), gọi `setFullYear(getFullYear() - 16)` để lùi 16 năm, rồi ghép chuỗi `YYYY-MM-DD` bằng `getFullYear()`, `getMonth() + 1` (tháng đếm từ 0), `getDate()`, mỗi số đưa qua `String(số).padStart(2, '0')`. Gán vào `form.elements.birth.max`. Kiểm tra: mở bộ chọn ngày, ngày sau mốc 16 năm trước không chọn được; Console gõ `form.elements.birth.max` (tạm in ra) ra đúng ngày.

3. **JS: thông báo lỗi từ `validity` và trạng thái "đã chạm".** **Bạn làm:** toàn bộ JS. Tạo object `messages` khoá theo `name` của ô, mỗi giá trị là object `{ tên cờ validity: lời tiếng Việt }`. Viết `getMessage(field)`: trả `''` nếu `field.validity.valid`; trả `field.validationMessage` nếu `validity.customError`; còn lại duyệt `Object.keys(messages[field.name])` bằng `find` để lấy cờ đầu tiên đang `true`, tra lời tương ứng. Viết `renderField(field)`: tìm dòng lỗi bằng `form.querySelector` với selector `[data-error-for="tên"]`, chỉ ghi lời lỗi khi `field.hasAttribute('data-touched')`, và ghi `aria-invalid`. Gắn `form.addEventListener('focusout', ...)`: nếu `event.target.matches('[data-field]')` thì `toggleAttribute('data-touched', true)` rồi `renderField`. Gắn `form.addEventListener('input', ...)` gọi lại `renderField(event.target)` để lỗi cập nhật khi đang gõ. Kiểm tra: gõ `ab` vào tên đăng nhập rồi Tab thì ra lỗi "ít nhất 4 ký tự"; gõ `Lan` ra lỗi "chỉ dùng chữ thường"; gõ đúng thì lỗi biến mất. Ô email gõ `abc` ra lỗi sai dạng. Chọn ngày sinh quá trẻ (gõ tay) ra lỗi về tuổi.

4. **CSS: viền theo trạng thái, và cái bẫy `invalid:`.** **Bạn làm:** trên `<input id="password">` và `<input id="confirm">` thêm `placeholder:text-slate-500 data-touched:invalid:border-rose-500 data-touched:valid:border-emerald-500`. Làm thử trước: chỉ thêm `invalid:border-rose-500` vào ô mật khẩu rồi tải lại trang. Ô mật khẩu đỏ ngay dù bạn chưa làm gì, vì ô `required` còn trống luôn là `:invalid`. Đổi thành `data-touched:invalid:border-rose-500`: lúc đầu hết đỏ, chạm rồi để trống thì mới đỏ. `data-touched:` khớp khi phần tử có thuộc tính `data-touched` (giá trị gì cũng được), `invalid:` khớp bộ chọn `:invalid`; xếp chồng hai tiền tố là điều kiện "và". `placeholder:` tô màu chữ gợi ý. Kiểm tra: chạm vào ô mật khẩu rồi Tab đi: viền đỏ và có dòng lỗi; gõ 8 ký tự: viền xanh.

5. **JS: thanh độ mạnh mật khẩu.** **Bạn làm:** toàn bộ JS (CSS đã điền sẵn). Tạo mảng `passwordRules` gồm 5 biểu thức chính quy: có ít nhất 8 ký tự `/.{8}/`, 12 ký tự `/.{12}/`, có cả chữ thường và hoa, có chữ số `/[0-9]/`, có ký tự đặc biệt `/[^A-Za-z0-9]/`. Viết `scorePassword(value)`: dùng `passwordRules.filter(...)` giữ các luật mà `rule.test(value)` trả `true`, trả `.length`. Viết `renderMeter()`: ô trống thì cấp `none`; điểm 1–2 là `weak`, 3–4 là `medium`, 5 là `strong`. Ghi `meter.dataset.level = cấp`, `meter.style.setProperty('--pct', ...)` với giá trị là điểm nhân 20 kèm `%` (dùng chuỗi mẫu) và dòng chữ "Độ mạnh: ...". Gọi nó trong `input` khi `field.name === 'password'`, và một lần lúc khởi động. Kiểm tra: gõ `abcdefgh` thanh đỏ ngắn; `Abcdefgh1` vàng; `Abcdefgh1!xyz` xanh đầy. Xoá hết thì thanh xám, rỗng.

6. **JS: nhập lại mật khẩu, và cái bẫy `setCustomValidity`.** **Bạn làm:** toàn bộ JS. Viết `checkConfirm()`. Viết **sai trước**: nếu `confirm.value !== password.value` thì `confirm.setCustomValidity('Mật khẩu nhập lại chưa khớp.')`, không có nhánh `else`. Gõ mật khẩu `Abc12345`, nhập lại `Abc1234` (thấy lỗi), rồi sửa thành `Abc12345`: lỗi vẫn còn, ô mãi mãi `:invalid`, bộ đếm không giảm. Sửa: dùng toán tử ba ngôi `confirm.setCustomValidity(lệch ? 'Mật khẩu nhập lại chưa khớp.' : '')`, tức luôn gọi, chuỗi rỗng là "hết lỗi". "Lệch" chỉ tính khi ô nhập lại không trống (`confirm.value !== ''`) để ô trống vẫn báo `valueMissing`. Gọi `checkConfirm()` đầu hàm xử lý `input` (mọi lần gõ), rồi `renderField(form.elements.confirm)` để lỗi của ô nhập lại cập nhật cả khi bạn sửa **mật khẩu gốc**. Kiểm tra: nhập lại khớp rồi sửa mật khẩu gốc một ký tự: ô nhập lại báo "chưa khớp" ngay; sửa lại khớp: hết báo.

7. **JS: bộ đếm, gửi form và màn hình thành công.** **Bạn làm:** toàn bộ JS. Viết `renderRemaining()`: `form.querySelectorAll('[data-field]:invalid').length` đếm ô chưa hợp lệ (`:invalid` là bộ chọn CSS, dùng được trong `querySelector`), ghi "Còn N ô chưa hợp lệ" hoặc "Mọi ô đã hợp lệ"; gọi sau mỗi `input` và lúc khởi động. Tạo `state = { user: null }` và `renderView()`: `form.hidden = state.user !== null`, `success.hidden = state.user === null`, khi có user thì ghi lời chào (ngày sinh định dạng bằng `new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long', timeZone: 'UTC' })`) và `success.focus()`. Viết `handleSubmit(event)`: `preventDefault()`; nếu `!form.checkValidity()` thì đặt `data-touched` cho **mọi** ô rồi `renderField`, `focus()` vào `form.querySelector('[data-field]:invalid')` và `return`; còn không thì đặt `state.user` rồi `renderView()`. Viết `handleRestart()` cho nút "Đăng ký người khác": `state.user = null`, `form.reset()`, gọi `checkConfirm()`, gỡ `data-touched` khỏi mọi ô và vẽ lại lỗi, vẽ lại thanh độ mạnh, bộ đếm, màn hình, rồi `focus()` về ô tên đăng nhập. Kiểm tra: bấm "Đăng ký" ngay khi mở: mọi ô đỏ và con trỏ vào ô tên đăng nhập; điền hợp lệ rồi đăng ký ra màn hình chào; bấm "Đăng ký người khác" thấy form sạch, không ô nào đỏ, thanh độ mạnh rỗng.

8. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `data-touched:invalid:border-rose-500` | `.input[data-touched]:invalid { border-color: #f43f5e }` |
| `data-touched:valid:border-emerald-500` | `.input[data-touched]:valid { border-color: #10b981 }` |
| `placeholder:text-slate-500` | `.input::placeholder { color: #64748b }` |
| `w-(--pct)` | `width: var(--pct)` |
| `group-data-[level=weak]:bg-rose-500` | `.meter[data-level="weak"] .meter-fill { background: #f43f5e }` |
| `transition-[width] duration-300` | `transition: width 300ms` |
| `sticky bottom-0 -mx-5 -mb-5` | `position: sticky; bottom: 0; margin: 0 -20px -20px` |
| `backdrop-blur-md` | `backdrop-filter: blur(12px)` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Mới mở trang: không ô nào viền đỏ hay xanh, không có dòng lỗi, bộ đếm "Còn 6 ô chưa hợp lệ".
- [ ] Chạm vào từng ô rồi Tab đi mà để trống: ô đó mới đỏ và có dòng lỗi đúng nội dung. Gõ đúng thì xanh, lỗi biến mất, bộ đếm giảm.
- [ ] Ô ngày sinh không cho chọn ngày làm bạn dưới 16 tuổi; gõ tay ngày vượt mốc thì báo lỗi về tuổi.
- [ ] Mật khẩu: 4 mức thanh (rỗng, đỏ, vàng, xanh) đúng theo số tiêu chí.
- [ ] Nhập lại mật khẩu: lệch thì báo lỗi, khớp lại thì hết lỗi (kể cả khi bạn sửa mật khẩu gốc sau đó).
- [ ] Bấm "Đăng ký" khi còn lỗi: mọi ô hiện lỗi, focus vào ô lỗi đầu tiên (đọc `document.activeElement` ở Console). Hợp lệ hết thì ra màn hình chào, ngày sinh đúng ngày bạn chọn.
- [ ] DevTools: xoá `data-touched` khỏi một ô đang đỏ thì viền hết đỏ, không cần JS. Xoá `novalidate` khỏi form rồi bấm đăng ký để thấy bong bóng lỗi mặc định của trình duyệt; gắn lại.
- [ ] Bàn phím: Tab qua mọi ô, checkbox, nút; viền focus rõ; Enter trong một ô gửi form như bấm nút. Thanh dưới dính đáy khi cuộn trên màn hình thấp.
- [ ] Bật `prefers-reduced-motion: reduce`: thanh độ mạnh đổi độ dài tức thì, không chuyển mượt.
- [ ] Tự hỏi: vì sao ô `required` còn trống đã `:invalid` ngay từ đầu? Vì sao dùng `focusout` mà không dùng `blur`? Nếu thiếu `else`/nhánh `''` ở `setCustomValidity` thì điều gì xảy ra với `form.checkValidity()`?

## Thử thách thêm

1. Thêm ô "Lặp lại email" với cùng cách `setCustomValidity`, và nút "Hiện mật khẩu" đổi `type` giữa `password` và `text` (dùng `aria-pressed`, `aria-pressed:bg-sky-500`).
2. Lưu bản nháp (tên đăng nhập, email) vào `localStorage` bằng debounce 400 ms: mỗi lần `input` thì `clearTimeout` hẹn giờ cũ rồi `setTimeout` lưu. Nhớ **không** lưu mật khẩu. Thêm `animate-` hoặc `starting:` cho dòng lỗi để nó trượt xuống khi xuất hiện.

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
		<title>Bài 021 - Đăng ký thành viên</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<h1 class="title">Đăng ký thành viên</h1>
			<p class="subtitle">Câu lạc bộ Đọc sách Mộc, dành cho bạn từ 16 tuổi.</p>
			<div class="card">
				<form data-form novalidate class="form">
					<div class="field">
						<label for="username" class="label">Tên đăng nhập</label>
						<input id="username" data-field name="username" type="text" required minlength="4" maxlength="16" pattern="[a-z0-9_]+" autocomplete="username" placeholder="ví dụ: lan_nguyen" aria-describedby="username-error" class="input" />
						<p id="username-error" data-error-for="username" class="error"></p>
					</div>
					<div class="field">
						<label for="email" class="label">Email</label>
						<input id="email" data-field name="email" type="email" required autocomplete="email" placeholder="ten@example.com" aria-describedby="email-error" class="input" />
						<p id="email-error" data-error-for="email" class="error"></p>
					</div>
					<div class="field">
						<label for="birth" class="label">Ngày sinh</label>
						<input id="birth" data-field name="birth" type="date" required aria-describedby="birth-error" class="input" />
						<p id="birth-error" data-error-for="birth" class="error"></p>
					</div>
					<div class="field">
						<label for="password" class="label">Mật khẩu</label>
						<input id="password" data-field name="password" type="password" required minlength="8" autocomplete="new-password" placeholder="Ít nhất 8 ký tự" aria-describedby="password-error" class="input" />
						<div data-meter data-level="none" style="--pct: 0%" class="meter">
							<div class="meter-track"><div class="meter-fill"></div></div>
							<p data-strength-text class="strength-text">Độ mạnh: chưa nhập</p>
						</div>
						<p id="password-error" data-error-for="password" class="error"></p>
					</div>
					<div class="field">
						<label for="confirm" class="label">Nhập lại mật khẩu</label>
						<input id="confirm" data-field name="confirm" type="password" required autocomplete="new-password" placeholder="Gõ lại mật khẩu" aria-describedby="confirm-error" class="input" />
						<p id="confirm-error" data-error-for="confirm" class="error"></p>
					</div>
					<div class="field">
						<label class="terms">
							<input id="terms" data-field name="terms" type="checkbox" required aria-describedby="terms-error" class="checkbox" />
							Tôi đồng ý với nội quy câu lạc bộ
						</label>
						<p id="terms-error" data-error-for="terms" class="error"></p>
					</div>
					<div class="submit-bar">
						<p data-remaining aria-live="polite" class="remaining"></p>
						<button type="submit" class="submit-button">Đăng ký</button>
					</div>
				</form>
				<section data-success hidden tabindex="-1" class="success">
					<h2 class="success-title">Đăng ký thành công</h2>
					<p data-success-text class="success-text"></p>
					<button type="button" data-restart class="restart-button">Đăng ký người khác</button>
				</section>
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

h1,
h2 {
	font-size: inherit;
	font-weight: inherit;
}

.site {
	min-height: 100vh;
	background: linear-gradient(to bottom, #0f172a, #020617);
	color: #f1f5f9;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	margin: 0 auto;
	max-width: 448px;
	padding: 32px 16px;
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
	color: #94a3b8;
}

.card {
	margin-top: 24px;
	border: 1px solid rgb(255 255 255 / 0.1);
	border-radius: 16px;
	background: rgb(255 255 255 / 0.05);
	padding: 20px;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.label {
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	color: #e2e8f0;
}

.input {
	width: 100%;
	border: 1px solid #475569;
	border-radius: 8px;
	background: #1e293b;
	padding: 8px 12px;
	font-size: 14px;
	line-height: 20px;
	color: #f1f5f9;
}

.input::placeholder {
	color: #64748b;
}

.input[data-touched]:invalid {
	border-color: #f43f5e;
}

.input[data-touched]:valid {
	border-color: #10b981;
}

.input:focus-visible,
.checkbox:focus-visible,
.submit-button:focus-visible,
.restart-button:focus-visible {
	outline: 2px solid #38bdf8;
	outline-offset: 2px;
}

.error {
	min-height: 20px;
	font-size: 12px;
	line-height: 16px;
	color: #fda4af;
}

.meter {
	margin-top: 4px;
}

.meter-track {
	height: 8px;
	overflow: hidden;
	border-radius: 9999px;
	background: #334155;
}

.meter-fill {
	height: 100%;
	width: var(--pct);
	border-radius: 9999px;
	background: #64748b;
	transition: width 300ms;
}

.meter[data-level="weak"] .meter-fill {
	background: #f43f5e;
}

.meter[data-level="medium"] .meter-fill {
	background: #fbbf24;
}

.meter[data-level="strong"] .meter-fill {
	background: #10b981;
}

.strength-text {
	margin-top: 4px;
	font-size: 12px;
	line-height: 16px;
	color: #94a3b8;
}

.terms {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	line-height: 20px;
}

.checkbox {
	width: 16px;
	height: 16px;
	accent-color: #10b981;
}

.submit-bar {
	position: sticky;
	bottom: 0;
	margin: 0 -20px -20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	border-top: 1px solid rgb(255 255 255 / 0.1);
	border-radius: 0 0 16px 16px;
	background: rgb(15 23 42 / 0.7);
	padding: 16px 20px;
	backdrop-filter: blur(12px);
}

.remaining {
	font-size: 14px;
	line-height: 20px;
	color: #cbd5e1;
}

.submit-button,
.restart-button {
	border-radius: 8px;
	background: #0ea5e9;
	padding: 8px 16px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 700;
	color: #020617;
}

.submit-button:hover,
.restart-button:hover {
	background: #38bdf8;
}

.success {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	text-align: center;
}

.success-title {
	font-size: 20px;
	line-height: 28px;
	font-weight: 700;
	color: #6ee7b7;
}

.success-text {
	font-size: 14px;
	line-height: 20px;
	color: #cbd5e1;
}

@media (prefers-reduced-motion: reduce) {
	.meter-fill {
		transition: none;
	}
}
```

`solution/script.js`

```js
const minAge = 16;
const messages = {
	username: {
		valueMissing: 'Hãy nhập tên đăng nhập.',
		tooShort: 'Tên đăng nhập cần ít nhất 4 ký tự.',
		patternMismatch: 'Chỉ dùng chữ thường không dấu, số và dấu gạch dưới.',
	},
	email: { valueMissing: 'Hãy nhập email.', typeMismatch: 'Email chưa đúng dạng, ví dụ ten@example.com.' },
	birth: { valueMissing: 'Hãy chọn ngày sinh.', badInput: 'Ngày sinh chưa hợp lệ.', rangeOverflow: `Bạn cần từ ${minAge} tuổi trở lên.` },
	password: { valueMissing: 'Hãy nhập mật khẩu.', tooShort: 'Mật khẩu cần ít nhất 8 ký tự.' },
	confirm: { valueMissing: 'Hãy nhập lại mật khẩu.' },
	terms: { valueMissing: 'Bạn cần đồng ý với nội quy.' },
};
const passwordRules = [/.{8}/, /.{12}/, /[a-z].*[A-Z]|[A-Z].*[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
const levelNames = { none: 'chưa nhập', weak: 'yếu', medium: 'trung bình', strong: 'mạnh' };
const form = document.querySelector('[data-form]');
const fields = Array.from(form.querySelectorAll('[data-field]'));
const meter = document.querySelector('[data-meter]');
const strengthText = document.querySelector('[data-strength-text]');
const remaining = document.querySelector('[data-remaining]');
const success = document.querySelector('[data-success]');
const successText = document.querySelector('[data-success-text]');
const restartButton = document.querySelector('[data-restart]');
const dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long', timeZone: 'UTC' });
const state = { user: null };

function pad(number) {
	return String(number).padStart(2, '0');
}

function setBirthLimit() {
	const limit = new Date();
	limit.setFullYear(limit.getFullYear() - minAge);
	form.elements.birth.max = `${limit.getFullYear()}-${pad(limit.getMonth() + 1)}-${pad(limit.getDate())}`;
}

function getMessage(field) {
	const validity = field.validity;
	if (validity.valid) {
		return '';
	}
	if (validity.customError) {
		return field.validationMessage;
	}
	const table = messages[field.name];
	const key = Object.keys(table).find(function (name) {
		return validity[name];
	});
	return key === undefined ? 'Giá trị chưa hợp lệ.' : table[key];
}

function renderField(field) {
	const error = form.querySelector(`[data-error-for="${field.name}"]`);
	const message = field.hasAttribute('data-touched') ? getMessage(field) : '';
	error.textContent = message;
	field.setAttribute('aria-invalid', message === '' ? 'false' : 'true');
}

function scorePassword(value) {
	return passwordRules.filter(function (rule) {
		return rule.test(value);
	}).length;
}

function renderMeter() {
	const value = form.elements.password.value;
	const score = scorePassword(value);
	let level = 'strong';
	if (value === '') {
		level = 'none';
	} else if (score <= 2) {
		level = 'weak';
	} else if (score <= 4) {
		level = 'medium';
	}
	meter.dataset.level = level;
	meter.style.setProperty('--pct', `${score * 20}%`);
	strengthText.textContent = `Độ mạnh: ${levelNames[level]}`;
}

function checkConfirm() {
	const confirm = form.elements.confirm;
	const mismatch = confirm.value !== '' && confirm.value !== form.elements.password.value;
	confirm.setCustomValidity(mismatch ? 'Mật khẩu nhập lại chưa khớp.' : '');
}

function renderRemaining() {
	const count = form.querySelectorAll('[data-field]:invalid').length;
	remaining.textContent = count === 0 ? 'Mọi ô đã hợp lệ' : `Còn ${count} ô chưa hợp lệ`;
}

function renderView() {
	form.hidden = state.user !== null;
	success.hidden = state.user === null;
	if (state.user !== null) {
		successText.textContent = `Chào ${state.user.name}! Ngày sinh của bạn là ${dateFormat.format(new Date(state.user.birth))}.`;
		success.focus();
	}
}

function handleInput(event) {
	const field = event.target;
	if (field.name === 'password') {
		renderMeter();
	}
	checkConfirm();
	renderField(field);
	renderField(form.elements.confirm);
	renderRemaining();
}

function handleFocusOut(event) {
	if (!event.target.matches('[data-field]')) {
		return;
	}
	event.target.toggleAttribute('data-touched', true);
	renderField(event.target);
}

function handleSubmit(event) {
	event.preventDefault();
	if (!form.checkValidity()) {
		fields.forEach(function (field) {
			field.toggleAttribute('data-touched', true);
			renderField(field);
		});
		form.querySelector('[data-field]:invalid').focus();
		return;
	}
	state.user = { name: form.elements.username.value, birth: form.elements.birth.value };
	renderView();
}

function handleRestart() {
	state.user = null;
	form.reset();
	checkConfirm();
	fields.forEach(function (field) {
		field.removeAttribute('data-touched');
		renderField(field);
	});
	renderMeter();
	renderRemaining();
	renderView();
	form.elements.username.focus();
}

form.addEventListener('input', handleInput);
form.addEventListener('focusout', handleFocusOut);
form.addEventListener('submit', handleSubmit);
restartButton.addEventListener('click', handleRestart);

setBirthLimit();
renderMeter();
renderRemaining();
```

</details>

### Giải thích từng hàm

- `setBirthLimit()`: không tham số, tính ngày cách hôm nay 16 năm và gán vào thuộc tính `max` của ô ngày sinh. Không trả về gì.
- `pad(number)`: nhận một số, trả chuỗi có ít nhất 2 ký tự, thêm số `0` phía trước nếu thiếu (`5` thành `'05'`).
- `getMessage(field)`: nhận một ô, trả chuỗi lỗi tiếng Việt hoặc `''` nếu ô hợp lệ.
- `renderField(field)`: ghi dòng lỗi của ô (chỉ khi đã chạm) và `aria-invalid`. Không trả về gì.
- `scorePassword(value)`: nhận mật khẩu, trả số tiêu chí đạt (0 tới 5).
- `renderMeter()`: đọc mật khẩu, ghi `data-level`, `--pct` và dòng chữ độ mạnh.
- `checkConfirm()`: đặt hoặc xoá lỗi tuỳ chỉnh của ô nhập lại mật khẩu.
- `renderRemaining()`: đếm ô chưa hợp lệ và ghi dòng tóm tắt ở thanh dưới.
- `renderView()`: hiện form hoặc màn hình thành công tuỳ `state.user`, ghi lời chào và đưa focus sang đó.
- `handleInput(event)`, `handleFocusOut(event)`, `handleSubmit(event)`, `handleRestart()`: bốn hàm xử lý sự kiện. Mỗi hàm được truyền tên cho `addEventListener` (không có `()`, vì có `()` là gọi ngay).
- `document.querySelector(selector)`, `form.querySelector(selector)`: tìm phần tử đầu tiên khớp, trả phần tử hoặc `null`. Selector `[data-field]:invalid` khớp phần tử có `data-field` và đang ở trạng thái không hợp lệ. `form.querySelectorAll(selector)`: trả danh sách mọi phần tử khớp (`NodeList`), có `.length`.
- `Array.from(danhSách)`: đổi `NodeList` thành mảng thật để dùng `forEach`. `array.forEach(hàm)`: gọi hàm cho từng phần tử, trả `undefined`.
- `form.elements.birth`: `elements` là tập hợp các ô của form, truy cập theo thuộc tính `name`.
- `new Date()`: tạo đối tượng thời điểm hiện tại. `setFullYear(năm)` đặt năm (sửa chính đối tượng, trả số mili giây); `getFullYear()`, `getMonth()` (0 là tháng 1), `getDate()` (ngày trong tháng) trả số. `new Date('2000-05-01')`: chuỗi dạng `YYYY-MM-DD` được hiểu là nửa đêm UTC.
- `String(số)`, `string.padStart(2, '0')`: đổi sang chuỗi; `padStart(độ dài, ký tự)` thêm ký tự vào đầu cho đủ độ dài, trả chuỗi mới.
- `field.validity`: đối tượng `ValidityState` với các cờ `valid`, `valueMissing`, `tooShort`, `patternMismatch`, `typeMismatch`, `rangeOverflow`, `badInput`, `customError`, mỗi cờ là `true` hoặc `false`. `validity[name]` lấy cờ theo tên nằm trong biến.
- `field.validationMessage`: chuỗi thông báo của ô; khi dùng `setCustomValidity` thì chính là chuỗi bạn đặt.
- `field.setCustomValidity(chuỗi)`: đặt lỗi tuỳ chỉnh; chuỗi không rỗng làm ô `:invalid` với `customError`, **chuỗi rỗng** xoá lỗi. Không trả về gì.
- `form.checkValidity()`: trả `true` nếu mọi ô hợp lệ, `false` nếu còn ô lỗi. Khác `reportValidity()` ở chỗ không bật bong bóng báo lỗi.
- `Object.keys(obj)`: trả mảng tên khoá của object. `array.find(hàm)`: trả phần tử đầu tiên mà hàm trả `true`, hoặc `undefined` nếu không có (vì vậy so sánh `key === undefined`).
- `field.hasAttribute('data-touched')`: trả `true` nếu phần tử có thuộc tính đó. `toggleAttribute('data-touched', true)`: tham số thứ hai `force` là `true` thì luôn bật, không đảo. `removeAttribute(tên)`: gỡ thuộc tính. `setAttribute('aria-invalid', 'true')`: đặt giá trị thuộc tính (luôn là chuỗi).
- `event.target.matches('[data-field]')`: trả `true` nếu phần tử khớp selector. Dùng để bỏ qua sự kiện từ nút bấm.
- `focusout` và `input`: `focusout` chạy khi một phần tử mất focus và nổi bọt lên form (khác `blur` không nổi bọt); `input` chạy sau mỗi lần giá trị thay đổi.
- `regex.test(chuỗi)`: biểu thức chính quy `/.{8}/` trả `true` nếu chuỗi chứa 8 ký tự bất kỳ liền nhau; `[a-z]` một chữ thường; `[^A-Za-z0-9]` một ký tự **không** phải chữ hay số; `|` nghĩa là "hoặc".
- `array.filter(hàm)`: trả mảng mới chỉ giữ phần tử mà hàm trả `true`; `.length` là số phần tử.
- `element.dataset.level = giá trị`: ghi `data-level`. `style.setProperty('--pct', '60%')`: ghi biến CSS.
- `new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long', timeZone: 'UTC' })`: bộ định dạng ngày; `dateStyle: 'long'` ra "1 tháng 5, 2000"; `timeZone: 'UTC'` ép dùng múi giờ UTC để không lệch ngày. `.format(date)` trả chuỗi.
- `form.reset()`: đưa mọi ô về giá trị ban đầu; chạy đồng bộ, không phát sự kiện `input`, nên phải tự vẽ lại. `element.focus()`: đưa focus bàn phím vào phần tử. `event.preventDefault()`: chặn hành vi mặc định (gửi form và tải lại trang).
- `element.hidden = true/false`: thuộc tính HTML `hidden` ẩn hoặc hiện phần tử.
- `` `...${biểu thức}...` ``: chuỗi mẫu. `điều kiện ? a : b`: toán tử ba ngôi. `!`: phủ định. `!==` và `===`: so sánh chặt chẽ. `let` và `+= 1`: biến gán lại được và cộng thêm 1. `else if`: nhánh điều kiện tiếp theo. Return sớm: `return;` thoát hàm ngay.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `data-touched:invalid:border-rose-500` | `.input[data-touched]:invalid { border-color: #f43f5e }` |
| `data-touched:valid:border-emerald-500` | `.input[data-touched]:valid { border-color: #10b981 }` |
| `placeholder:text-slate-500` | `.input::placeholder { color: #64748b }` |
| `w-(--pct) bg-slate-500 transition-[width] duration-300` | `.meter-fill { width: var(--pct); background: #64748b; transition: width 300ms }` |
| `group-data-[level=medium]:bg-amber-400` | `.meter[data-level="medium"] .meter-fill { background: #fbbf24 }` |
| `sticky bottom-0 -mx-5 -mb-5 rounded-b-2xl backdrop-blur-md` | `.submit-bar { position: sticky; bottom: 0; margin: 0 -20px -20px; border-radius: 0 0 16px 16px; backdrop-filter: blur(12px) }` |
| `min-h-5 text-xs text-rose-300` | `.error { min-height: 20px; font-size: 12px; color: #fda4af }` |
| `hidden` (thuộc tính HTML) | `[hidden] { display: none !important }` |

Khác biệt nhỏ: Tailwind nội suy màu gradient trong không gian `oklab` nên sắc độ hơi khác bản CSS thuần.
