# Bài 028: Thẻ đeo hội thảo kính mờ, nghiêng 3D, ánh sáng theo chuột và form xem trước trực tiếp

Ngày học 10, bài 3/3, cấp 2, chủ đề CSS: Glass + 3D + ánh sáng (ứng dụng thẻ đeo hội thảo), độ khó ★★★★★, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này lưu **họ tên, vai trò và mã vé** bằng `localStorage` (khoá `bai-028-the-deo`); lần đầu mở (chưa có khoá) dùng giá trị mẫu. Thẻ đang lật hay không, góc nghiêng và hạn dùng **không** được lưu.

## Mục tiêu

- Một thẻ kính mờ hai mặt: mặt trước (vai trò, họ tên, mã vé) và mặt sau (mã vạch, hạn dùng). Nút "Lật thẻ" quay thẻ nửa vòng bằng `data-flipped`, cập nhật `aria-pressed` và nhãn nút.
- Rê chuột trên khung thì thẻ **nghiêng 3D theo con trỏ** (phía con trỏ lún xuống như bị ngón tay ấn, tối đa 18°), một vệt sáng `overlay` chạy theo con trỏ, dải màu hologram trượt theo vị trí, và bóng đổ lệch theo hướng nghiêng. Rời chuột thì thẻ trở về thẳng. Người dùng bật giảm chuyển động thì không nghiêng.
- Form ba ô (họ tên, vai trò, mã vé) cập nhật thẻ **ngay khi gõ** bằng sự kiện `input`; mã vé tự viết hoa, bỏ ký tự lạ, chèn dấu `-` sau 3 ký tự (`dev1236` thành `DEV-1236`) và kiểm tra bằng `setCustomValidity`: định dạng `ABC-1234` và chữ số cuối bằng tổng ba chữ số trước đó chia 10 lấy dư.
- Mã vạch mặt sau dựng từ chính mã vé bằng `<template>`: mỗi ký tự một vạch, độ rộng lấy từ `charCodeAt`. Dòng "Hạn dùng" là hôm nay cộng 30 ngày bằng `Date.setDate`.
- Tải lại trang, họ tên, vai trò và mã vé còn nguyên.
- Gặp và tự sửa cái bẫy: **tính toạ độ chuột trên chính phần tử đang nghiêng** làm thẻ rung ở mép.

## Kết quả mong đợi

Nền chàm đậm sang tím, có hai hình tròn cyan và hồng. Giữa trang là thẻ kính trong mờ: chữ `DEVFEST ĐÀ NẴNG 2026`, nhãn vai trò, họ tên lớn, mã vé chữ đơn cách. Khi rê chuột, phía có con trỏ của thẻ lún xuống như bị ấn, một vệt sáng trắng mờ bám theo con trỏ và dải màu cầu vồng lướt qua bề mặt. Bên dưới là nút "Lật thẻ" và form ba ô; gõ vào ô nào thì thẻ đổi theo.

## Tư duy

**Ba lớp để vừa nghiêng vừa lật.** `data-stage` (đứng yên, giữ `perspective`) chứa `data-card` (nghiêng bằng `--rx`, `--ry`) chứa một khối lật (xoay 180° khi `data-flipped`) chứa hai mặt. Mỗi việc một phần tử, nên hai chuyển động không dẫm chân nhau (lý do như bài 019: xoay hai thứ trên cùng một phần tử thì thứ tự áp dụng khó đoán).

**Ánh sáng không phải là 3D, nó là lớp phủ.** Vệt sáng là một lớp `absolute inset-0` có nền `radial-gradient(circle at var(--mx) var(--my), ...)`; JS chỉ đổi `--mx`, `--my` (phần trăm toạ độ chuột trong khung). `mix-blend-overlay` (`mix-blend-mode: overlay`) trộn lớp sáng với nền bên dưới: chỗ tối sáng thêm ít, chỗ sáng sáng thêm nhiều, nên vệt sáng trông như ánh sáng thật rọi lên bề mặt thay vì một mảng trắng đè lên. Dải hologram là một gradient góc 115° rộng gấp ba thẻ (`bg-size-[300%_300%]`, tức `background-size: 300% 300%`); `bg-position-(--pos)` chọn khúc nào của dải đang hiện, nên đổi `--pos` theo chuột là dải trượt qua.

**Đổ bóng và hướng nghiêng.** Bóng lệch về phía cạnh đang nổi lên, tức ngược phía con trỏ (`(0.5 - x) * 40px`): bài 024 đã dạy `shadow-(--shadow)`, JS ghi nguyên chuỗi bóng vào `--shadow`.

**Cái bẫy: đo trên phần tử đã bị biến hình.** Nếu gắn `pointermove` vào **chính thẻ** và lấy `getBoundingClientRect()` của thẻ, mọi thứ lệch đi ngay khi thẻ nghiêng: hộp bao của thẻ đã nghiêng không còn khớp hình ban đầu. Quan trọng hơn là **vùng nhận chuột** cũng nghiêng theo: khi con trỏ ở sát mép, thẻ nghiêng làm mép lùi khỏi con trỏ, trình duyệt phát `pointerleave`, ta đưa thẻ về thẳng, con trỏ lại nằm trên thẻ, phát `pointerenter`, thẻ nghiêng lại... thẻ rung liên tục. Cách chữa: lắng nghe và đo trên `data-stage`, một khung **đứng yên** không có biến hình, chỉ nghiêng phần tử con. Giống tập đánh bóng bàn với đối thủ cố định, không phải với đối thủ đang chạy theo quả bóng.

**Chuẩn hoá toạ độ.** `x = (clientX - rect.left) / rect.width` đổi vị trí tuyệt đối thành số 0 đến 1 trong khung (0 là mép trái, 1 là mép phải); `Math.min(Math.max(x, 0), 1)` chặn nếu chuột vượt ra ngoài. Từ `x`, `y` suy ra mọi thứ: góc `(x - 0.5) * 2 * 18°`, vệt sáng, dải màu, bóng.

**Form xem trước trực tiếp.** `input` nổi bọt lên `<form>` nên một listener ở form nghe cả ba ô. `field.name` cho biết ô nào. Với ô mã vé: viết hoa (`toUpperCase`), bỏ ký tự ngoài `A-Z0-9` (`replace` với biểu thức chính quy), rồi chèn `-` bằng nhóm bắt `$1-$2`. `setCustomValidity(chuỗi)` đặt thông báo lỗi riêng (chuỗi rỗng nghĩa là hợp lệ, bài 021).

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| `perspective-distant`, `transform-3d`, `rotate-x-(--rx) rotate-y-(--ry)`, `shadow-(--shadow)` | Ghi `--rx`, `--ry`, `--shadow` từ vị trí chuột |
| `bg-[radial-gradient(circle_at_var(--mx)_var(--my),...)]`, **`mix-blend-overlay`** | Ghi `--mx`, `--my`; bật `data-tracking` khi chuột ở trên thẻ |
| **`mix-blend-color-dodge bg-size-[300%_300%] bg-position-(--pos)`** dải hologram | Ghi `--pos` |
| `group-data-flipped:rotate-y-180`, `backface-hidden` | Ghi `data-flipped` bằng `toggleAttribute` (trả về `true`/`false`) |
| `w-(--w)` độ rộng từng vạch, `aria-invalid:border-rose-400` | Dựng vạch từ `<template>`; ghi `--w`, `aria-invalid`, nội dung thông báo lỗi |
| `motion-reduce:transition-none` | Đọc `matchMedia('(prefers-reduced-motion: reduce)')` để bỏ qua nghiêng |

JS không thêm hoặc gỡ class, không đặt `style.transform`, không tìm phần tử bằng class.

## Ôn lại

- Bài 020 (`bai-020-ghi-chu-kinh-mo`): vệt sáng `radial-gradient` theo con trỏ, `pointermove` + `getBoundingClientRect` + `setProperty`, `pointerout`.
- Bài 024 (`bai-024-phong-thu-bong-do`): `shadow-(--shadow)`, `style.setProperty` ghi cả chuỗi bóng; bài 019: `rotate-x-(--rx) rotate-y-(--ry)`, `transform-3d`, `window.matchMedia(...).matches`.
- Bài 021 (`bai-021-dang-ky-thanh-vien`): `setCustomValidity`, `validity`, `validationMessage`; bài 025 (`bai-025-vi-chi-tieu-kinh-mo`): `backdrop-blur-md`, `inset-ring-1`, `overflow-clip`, `localStorage`.
- Bài 018: `backface-hidden`, lật quanh trục Y; bài 009: `isolate`.

## Gợi ý từng bước

> Starter đã điền sẵn: nền gradient và hai hình tròn, khung `perspective-distant`, thẻ `group ... transform-3d rounded-3xl shadow-(--shadow) rotate-x-(--rx) rotate-y-(--ry)` có chuyển động, khối lật `group-data-flipped:rotate-y-180`, hai mặt kính (`bg-white/10 backdrop-blur-md inset-ring-1`, `backface-hidden`), lớp hologram (đã có gradient `bg-[linear-gradient(115deg,...)] opacity-35` nhưng **chưa** trộn màu), lớp vệt sáng `bg-[radial-gradient(...)]` ở mặt **trước** (đã có `mix-blend-overlay`), nội dung, nút "Lật thẻ", form ba ô, `<template data-bar-template>` với `w-(--w)`. Bạn tự thêm hai nhóm class mới: **hoà trộn màu** (`mix-blend-*`) và **kích thước, vị trí nền** (`bg-size-*`, `bg-position-*`).

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc `data-app`, `data-stage`, `data-card`, hai mặt `data-side="front"`/`"back"`, các chỗ ghi chữ `data-bind` (`holder`, `role`, `code`; mã vé xuất hiện hai lần), `data-barcode`, `data-expiry`, `data-flip`, `data-form` với ba ô `name` là `holder`, `role`, `code`, các chỗ báo lỗi `data-error`, `data-bar-template`. Kiểm tra: mở trang thấy thẻ kính trống chữ, vệt sáng và dải màu chưa hoạt động.

2. **JS: trạng thái, lưu trữ, xem trước.** **Bạn làm:** toàn bộ JS. Object `state` đọc từ `localStorage` (khoá `bai-028-the-deo`) và trộn với giá trị mẫu bằng cú pháp trải object `{ ...defaults, ...JSON.parse(raw) }`; `saveDraft()`; `render()` ghi `textContent` cho mọi `[data-bind]` (rỗng thì hiện `...`); gán giá trị ban đầu cho `form.elements.holder`, `role`, `code`; listener `input` ở form ghi `state[field.name] = field.value`, lưu, vẽ lại. Kiểm tra: gõ tên thì thẻ đổi ngay; tải lại trang, tên còn nguyên; xoá khoá ở Application, tải lại thì về tên mẫu.

3. **JS: mã vé và kiểm tra.** **Bạn làm:** toàn bộ JS. `formatCode(text)` (viết hoa, bỏ ký tự ngoài `A-Z0-9`, `slice(0, 7)`, chèn `-` bằng `replace(/^([A-Z0-9]{3})([A-Z0-9]+)$/, '$1-$2')`). `checkCode(code)` trả chuỗi lỗi hoặc `''`: kiểm định dạng bằng `/^[A-Z]{3}-\d{4}$/.test(code)`, rồi tính tổng ba chữ số đầu bằng `reduce` và so `% 10` với chữ số thứ tư. `validateField(field)`: `setCustomValidity`, ghi `validationMessage` vào `[data-error="tên"]`, ghi `aria-invalid`. Kiểm tra: gõ `dev1237` thành `DEV-1237` và báo "Chữ số cuối phải là 6."; `DEV-1236` hợp lệ; họ tên 1 ký tự báo lỗi của trình duyệt (`minlength`).

4. **JS: mã vạch và hạn dùng.** **Bạn làm:** toàn bộ JS. `renderBarcode()` biến `state.code` thành mảng ký tự bằng `Array.from(chuỗi)`, mỗi ký tự nhân bản `<template>` và ghi `--w` là `((char.charCodeAt(0) % 4) + 1) * 2 + 'px'`, rồi `replaceChildren(...)`. Hạn dùng: `new Date()`, `setDate(getDate() + 30)`, định dạng bằng `Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })`. Kiểm tra: đổi mã vé thì mã vạch (sau khi lật) đổi theo; hạn dùng đúng 30 ngày sau hôm nay (qua cuối tháng vẫn đúng, vì `setDate(40)` tự sang tháng sau).

5. **JS: lật thẻ.** **Bạn làm:** toàn bộ JS. Uỷ quyền `click` ở `data-app`, `closest('[data-flip]')`; `card.toggleAttribute('data-flipped')` (một tham số: đảo trạng thái, và **trả về** `true` nếu thuộc tính đang có sau khi đảo); ghi `aria-pressed`, đổi chữ nút, và đặt `aria-hidden` cho mặt đang quay lưng để trình đọc màn hình không đọc nhầm. Kiểm tra: mặt sau hiện khi bật, mặt trước hiện khi tắt; Tab tới nút rồi Enter vẫn lật được.

6. **JS: nghiêng 3D theo chuột và cái bẫy.** **Bạn làm:** toàn bộ JS. Làm theo hai pha. **Pha 1 ("cách hiển nhiên"):** gắn `pointermove` và `pointerleave` vào **chính `data-card`**, tính `x`, `y` từ `card.getBoundingClientRect()` rồi viết `setTilt(x, y)`: `--ry` là `(x - 0.5) * 2 * 18` độ, `--rx` là `-(y - 0.5) * 2 * 18` độ, `--mx`/`--my`/`--pos` theo phần trăm, `--shadow` là `(0.5 - x) * 40 + 'px ' + ((0.5 - y) * 40 + 24) + 'px 40px rgb(0 0 0 / 0.45)'`. Rê chuột chậm vào sát mép thẻ để thấy **thẻ rung**. **Pha 2 (sửa):** chuyển cả hai listener (và thêm `pointerenter` bật `data-tracking`) sang `data-stage`, đo bằng `stage.getBoundingClientRect()` và chặn `x`, `y` bằng `Math.min(Math.max(giá_trị, 0), 1)`. `pointerleave` thì tắt `data-tracking` và gọi `setTilt(0.5, 0.5)`. Thêm kiểm tra `window.matchMedia('(prefers-reduced-motion: reduce)').matches` để bỏ qua nghiêng. Gọi `setTilt(0.5, 0.5)` một lần lúc khởi động (để `--shadow` có giá trị). Kiểm tra: rê chuột vào sát mép trong khung thì thẻ nghiêng mượt, không rung; thoát khỏi khung thì thẻ trở lại thẳng.

7. **CSS: hoà trộn màu và nền lướt.** **Bạn làm:** thêm `mix-blend-color-dodge bg-size-[300%_300%] bg-position-(--pos)` vào `<div>` lớp hologram (mặt trước, có `bg-[linear-gradient(115deg,...)]`); thêm `mix-blend-overlay` vào `<div>` vệt sáng của mặt **sau** (chép theo mặt trước). `mix-blend-color-dodge` làm sáng rực các màu của dải theo nền kính; `bg-size-[300%_300%]` làm dải gradient to gấp ba thẻ (nếu thiếu, dải chỉ vừa khít thẻ nên đổi `--pos` không thấy gì); `bg-position-(--pos)` đọc vị trí nền từ biến CSS. Kiểm tra: rê chuột thì dải màu cầu vồng chạy qua thẻ; lật thẻ, vệt sáng ở mặt sau cũng có cảm giác "ánh sáng" thay vì mảng trắng; xoá `mix-blend-overlay` ở DevTools để thấy khác biệt.

8. **Hoàn thiện.** **Bạn làm:** không có class mới. Chạy hết phần Tự kiểm tra, đặc biệt thử cái bẫy, bàn phím và giảm chuyển động.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `mix-blend-overlay` | `mix-blend-mode: overlay` |
| `mix-blend-color-dodge` | `mix-blend-mode: color-dodge` |
| `bg-size-[300%_300%]` | `background-size: 300% 300%` |
| `bg-position-(--pos)` | `background-position: var(--pos)` |
| `bg-[radial-gradient(circle_at_var(--mx)_var(--my),rgb(255_255_255/0.55),transparent_55%)]` | `background-image: radial-gradient(circle at var(--mx) var(--my), rgb(255 255 255 / 0.55), transparent 55%)` |
| `perspective-distant` | `perspective: 1200px` |
| `rotate-x-(--rx) rotate-y-(--ry)` | `transform: rotateX(var(--rx)) rotateY(var(--ry))` |
| `shadow-(--shadow)` | `box-shadow: var(--shadow)` |
| `data-tracking:duration-75` | `.badge[data-tracking] { transition-duration: 75ms }` |
| `group-data-tracking:opacity-100` | `.badge[data-tracking] .glare { opacity: 1 }` |
| `isolate overflow-clip` | `isolation: isolate; overflow: clip` |

## Tự kiểm tra

- [ ] Rê chuột vào góc phải trên của khung: thẻ nghiêng về phía đó (cạnh gần con trỏ lún xuống, cạnh xa nổi lên), vệt sáng ở góc phải trên, dải hologram lướt, bóng lệch về phía ngược lại. Rời khỏi khung: thẻ về thẳng.
- [ ] Rê chuột chậm sát mép khung: thẻ không nháy, không rung (nếu rung, bạn còn đang nghe trên `data-card`). Kiểm tra Console: gõ `card.hasAttribute('data-tracking')` không thấy đổi qua lại liên tục.
- [ ] Gõ tên có dấu và rất dài: thẻ cắt bằng `truncate`, không tràn. Xoá hết tên: thẻ hiện `...`.
- [ ] Mã vé: gõ `abc12` thành `ABC-12`, báo lỗi định dạng; gõ ký tự lạ (`@`, dấu cách) thì bị bỏ; `ABC-1234` báo chữ số cuối phải là 6; `ABC-1236` hợp lệ, ô hết viền đỏ.
- [ ] Lật thẻ: mặt sau có mã vạch đúng 8 vạch (7 ký tự và dấu `-`) và hạn dùng. Đổi mã vé thì mã vạch đổi.
- [ ] Tải lại trang: họ tên, vai trò, mã vé còn nguyên (Application, Local Storage thấy `bai-028-the-deo`).
- [ ] DevTools: xoá `bg-size-[300%_300%]` thì rê chuột không thấy dải lướt; xoá `isolate` ở mặt trước thì xem vệt sáng có đổi khác không; xoá `backface-hidden` ở mặt trước thì mặt sau bị chữ đè.
- [ ] Bàn phím: Tab qua nút "Lật thẻ" và ba ô, viền focus rõ; Enter ở nút lật được thẻ; trình đọc màn hình (hoặc Accessibility) chỉ đọc mặt đang hiện (`aria-hidden` mặt kia).
- [ ] Bật `prefers-reduced-motion: reduce` (rồi tải lại): rê chuột không còn nghiêng hay sáng, thẻ lật tức thì (`motion-reduce:transition-none`).
- [ ] Tự hỏi: vì sao đo toạ độ trên `data-stage` mà không trên `data-card`? `toggleAttribute('data-flipped')` trả về gì và vì sao tiện? Vì sao `bg-size-[300%_300%]` bắt buộc để `bg-position-(--pos)` có tác dụng? Vì sao dùng `input` thay vì `change` cho form xem trước?

## Thử thách thêm

1. Thêm "lớp nổi": chữ họ tên nằm ở lớp riêng `translate-z-8` (khối `transform-3d` ở mặt trước) để khi nghiêng, chữ nhô khỏi mặt thẻ một chút; nhớ rằng `overflow-clip` và `isolate` trên mặt ép phẳng con bên trong, nên phải đặt chữ ở lớp nằm ngoài các thuộc tính đó (liên hệ cái bẫy bài 027).
2. Nút "Tải mã vé" dùng `canvas` hoặc `<a download>` để xuất mã vé thành tệp văn bản; hoặc thêm ô "Công ty" với `datalist` gợi ý và lưu danh sách công ty đã nhập vào `localStorage` (mảng, bỏ trùng bằng `new Set`, xem lại bài 025).

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
		<title>Bài 028 - Thẻ đeo hội thảo</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<div aria-hidden="true" class="blob blob-cyan"></div>
		<div aria-hidden="true" class="blob blob-pink"></div>
		<main data-app class="app">
			<h1 class="title">Thẻ đeo hội thảo</h1>
			<p class="hint">Rê chuột lên thẻ để nghiêng 3D, bấm "Lật thẻ" để xem mặt sau.</p>
			<div data-stage class="stage">
				<article data-card aria-label="Xem trước thẻ đeo" class="badge">
					<div class="flipper">
						<section data-side="front" class="side front">
							<div aria-hidden="true" class="holo"></div>
							<div aria-hidden="true" class="glare"></div>
							<div class="content">
								<p class="event">DevFest Đà Nẵng 2026</p>
								<p data-bind="role" class="role"></p>
								<p data-bind="holder" class="holder"></p>
								<p data-bind="code" class="code"></p>
							</div>
						</section>
						<section data-side="back" class="side back">
							<div aria-hidden="true" class="glare"></div>
							<div class="content">
								<p class="event">Quét tại cổng vào</p>
								<div data-barcode aria-hidden="true" class="barcode"></div>
								<p data-bind="code" class="code"></p>
								<p data-expiry class="expiry"></p>
							</div>
						</section>
					</div>
				</article>
			</div>
			<button type="button" data-flip aria-pressed="false" class="flip">Lật thẻ</button>
			<form data-form novalidate class="form">
				<label class="field">
					Họ và tên
					<input name="holder" required minlength="2" maxlength="24" autocomplete="off" class="input" />
					<span data-error="holder" class="error"></span>
				</label>
				<label class="field">
					Vai trò
					<select name="role" class="input">
						<option value="Diễn giả" class="option">Diễn giả</option>
						<option value="Tình nguyện viên" class="option">Tình nguyện viên</option>
						<option value="Người tham dự" class="option">Người tham dự</option>
					</select>
				</label>
				<label class="field">
					Mã vé (ví dụ DEV-1236)
					<input name="code" required maxlength="8" autocomplete="off" class="input mono" />
					<span data-error="code" class="error"></span>
				</label>
			</form>
			<template data-bar-template>
				<span data-bar class="bar"></span>
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

h1 {
	font-size: 20px;
	line-height: 28px;
	font-weight: 700;
}

.site {
	position: relative;
	min-height: 100vh;
	overflow: clip;
	padding: 16px;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
	color: #ffffff;
	background: linear-gradient(to bottom right, #020617, #1e1b4b, #4a044e);
}

.blob {
	position: absolute;
	width: 256px;
	height: 256px;
	border-radius: 9999px;
}

.blob-cyan {
	top: -64px;
	left: -64px;
	background: rgb(34 211 238 / 0.4);
}

.blob-pink {
	top: 288px;
	right: -64px;
	width: 288px;
	height: 288px;
	background: rgb(217 70 239 / 0.5);
}

.app {
	position: relative;
	margin: 0 auto;
	max-width: 384px;
}

.hint {
	margin-top: 4px;
	font-size: 14px;
	line-height: 20px;
	color: rgb(255 255 255 / 0.7);
}

.stage {
	position: relative;
	margin-top: 24px;
	perspective: 1200px;
}

.badge {
	position: relative;
	height: 224px;
	border-radius: 24px;
	transform: rotateX(var(--rx)) rotateY(var(--ry));
	transform-style: preserve-3d;
	box-shadow: var(--shadow);
	transition: transform 300ms ease-out;
}

.badge[data-tracking] {
	transition-duration: 75ms;
}

.flipper {
	position: absolute;
	inset: 0;
	transform-style: preserve-3d;
	transition: transform 700ms ease-out;
}

.badge[data-flipped] .flipper {
	transform: rotateY(180deg);
}

.side {
	position: absolute;
	inset: 0;
	isolation: isolate;
	overflow: clip;
	border: 1px solid rgb(255 255 255 / 0.25);
	border-radius: 24px;
	background: rgb(255 255 255 / 0.1);
	backdrop-filter: blur(12px);
	box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.2);
	backface-visibility: hidden;
}

.back {
	transform: rotateY(180deg);
}

.holo {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background-image: linear-gradient(115deg, #ff7ab8, #ffd36e, #6effc4, #6ec6ff, #c28aff, #ff7ab8);
	background-size: 300% 300%;
	background-position: var(--pos);
	mix-blend-mode: color-dodge;
	opacity: 0.35;
}

.glare {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background-image: radial-gradient(circle at var(--mx) var(--my), rgb(255 255 255 / 0.55), transparent 55%);
	mix-blend-mode: overlay;
	opacity: 0;
	transition: opacity 300ms;
}

.badge[data-tracking] .glare {
	opacity: 1;
}

.content {
	position: relative;
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
	padding: 20px;
}

.back .content {
	align-items: center;
}

.event {
	font-size: 12px;
	line-height: 16px;
	font-weight: 600;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: rgb(255 255 255 / 0.7);
}

.role {
	width: fit-content;
	border-radius: 9999px;
	background: rgb(255 255 255 / 0.2);
	padding: 2px 12px;
	font-size: 12px;
	line-height: 16px;
	font-weight: 600;
}

.holder {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 24px;
	line-height: 32px;
	font-weight: 700;
}

.code {
	font-family: ui-monospace, monospace;
	font-size: 14px;
	line-height: 20px;
	letter-spacing: 0.1em;
	font-variant-numeric: tabular-nums;
	color: rgb(255 255 255 / 0.8);
}

.expiry {
	font-size: 12px;
	line-height: 16px;
	color: rgb(255 255 255 / 0.6);
}

.barcode {
	display: flex;
	height: 64px;
	align-items: stretch;
	gap: 2px;
}

.bar {
	width: var(--w);
	background: rgb(255 255 255 / 0.9);
}

.flip {
	margin-top: 24px;
	width: 100%;
	border-radius: 12px;
	background: rgb(255 255 255 / 0.9);
	padding: 8px 16px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	color: #1e1b4b;
	transition: transform 150ms;
}

.flip:hover {
	transform: translateY(-2px);
}

.form {
	margin-top: 24px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.field {
	display: block;
	font-size: 12px;
	line-height: 16px;
	color: rgb(255 255 255 / 0.7);
}

.input {
	margin-top: 4px;
	width: 100%;
	border: 1px solid rgb(255 255 255 / 0.25);
	border-radius: 12px;
	background: rgb(255 255 255 / 0.1);
	padding: 8px 12px;
	font-size: 14px;
	line-height: 20px;
	color: #ffffff;
}

.input[aria-invalid="true"] {
	border-color: #fb7185;
}

.mono {
	font-family: ui-monospace, monospace;
	letter-spacing: 0.1em;
}

.option {
	color: #0f172a;
}

.error {
	margin-top: 4px;
	display: block;
	min-height: 16px;
	color: #fda4af;
}

.flip:focus-visible,
.input:focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
	.badge,
	.flipper,
	.glare,
	.flip {
		transition: none;
	}
}
```

`solution/script.js`

```js
const STORAGE_KEY = 'bai-028-the-deo';
const MAX_TILT = 18;
const defaults = { holder: 'Nguyễn Minh Anh', role: 'Diễn giả', code: 'DEV-1236' };

const app = document.querySelector('[data-app]');
const stage = app.querySelector('[data-stage]');
const card = app.querySelector('[data-card]');
const form = app.querySelector('[data-form]');
const flipButton = app.querySelector('[data-flip]');
const barcode = app.querySelector('[data-barcode]');
const barTemplate = app.querySelector('[data-bar-template]');
const expiryText = app.querySelector('[data-expiry]');
const bindings = app.querySelectorAll('[data-bind]');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const dateFormatter = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
const state = loadDraft();

function loadDraft() {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw === null ? { ...defaults } : { ...defaults, ...JSON.parse(raw) };
}

function saveDraft() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCode(text) {
	const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
	return clean.replace(/^([A-Z0-9]{3})([A-Z0-9]+)$/, '$1-$2');
}

function checkCode(code) {
	if (!/^[A-Z]{3}-\d{4}$/.test(code)) {
		return 'Mã vé có dạng ABC-1234.';
	}
	const digits = code.slice(4).split('').map(Number);
	const sum = digits.slice(0, 3).reduce(function (total, digit) { return total + digit; }, 0);
	if (sum % 10 !== digits[3]) {
		return 'Chữ số cuối phải là ' + (sum % 10) + '.';
	}
	return '';
}

function validateField(field) {
	if (field.name === 'code') {
		field.setCustomValidity(checkCode(field.value));
	}
	const valid = field.validity.valid;
	app.querySelector('[data-error="' + field.name + '"]').textContent = valid ? '' : field.validationMessage;
	field.setAttribute('aria-invalid', String(!valid));
}

function renderBarcode() {
	const bars = Array.from(state.code).map(function (char) {
		const bar = barTemplate.content.firstElementChild.cloneNode(true);
		bar.style.setProperty('--w', ((char.charCodeAt(0) % 4) + 1) * 2 + 'px');
		return bar;
	});
	barcode.replaceChildren(...bars);
}

function render() {
	bindings.forEach(function (element) {
		element.textContent = state[element.dataset.bind].trim() || '...';
	});
	renderBarcode();
}

function setTilt(x, y) {
	const rotateY = (x - 0.5) * 2 * MAX_TILT;
	const rotateX = -(y - 0.5) * 2 * MAX_TILT;
	const shadow = (0.5 - x) * 40 + 'px ' + ((0.5 - y) * 40 + 24) + 'px 40px rgb(0 0 0 / 0.45)';
	card.style.setProperty('--rx', rotateX.toFixed(2) + 'deg');
	card.style.setProperty('--ry', rotateY.toFixed(2) + 'deg');
	card.style.setProperty('--mx', x * 100 + '%');
	card.style.setProperty('--my', y * 100 + '%');
	card.style.setProperty('--pos', x * 100 + '% ' + y * 100 + '%');
	card.style.setProperty('--shadow', shadow);
}

function handlePointerEnter() {
	if (!reduceMotion.matches) {
		card.toggleAttribute('data-tracking', true);
	}
}

function handlePointerMove(event) {
	if (reduceMotion.matches) {
		return;
	}
	const rect = stage.getBoundingClientRect();
	const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
	const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
	setTilt(x, y);
}

function handlePointerLeave() {
	card.toggleAttribute('data-tracking', false);
	setTilt(0.5, 0.5);
}

function handleInput(event) {
	const field = event.target;
	if (field.name === 'code') {
		field.value = formatCode(field.value);
	}
	state[field.name] = field.value;
	if (field.name !== 'role') {
		validateField(field);
	}
	saveDraft();
	render();
}

function handleClick(event) {
	if (!event.target.closest('[data-flip]')) {
		return;
	}
	const flipped = card.toggleAttribute('data-flipped');
	flipButton.setAttribute('aria-pressed', String(flipped));
	flipButton.textContent = flipped ? 'Lật về mặt trước' : 'Lật thẻ';
	card.querySelector('[data-side="front"]').setAttribute('aria-hidden', String(flipped));
	card.querySelector('[data-side="back"]').setAttribute('aria-hidden', String(!flipped));
}

const expiry = new Date();
expiry.setDate(expiry.getDate() + 30);
expiryText.textContent = 'Hạn dùng: ' + dateFormatter.format(expiry);
card.querySelector('[data-side="back"]').setAttribute('aria-hidden', 'true');
form.elements.holder.value = state.holder;
form.elements.role.value = state.role;
form.elements.code.value = state.code;
setTilt(0.5, 0.5);
render();
stage.addEventListener('pointerenter', handlePointerEnter);
stage.addEventListener('pointermove', handlePointerMove);
stage.addEventListener('pointerleave', handlePointerLeave);
form.addEventListener('input', handleInput);
app.addEventListener('click', handleClick);
```

</details>

### Giải thích từng hàm

- `loadDraft()`: `localStorage.getItem(khoá)` trả chuỗi hoặc `null` (chưa lưu); `raw === null ? A : B` là toán tử ba ngôi. `{ ...defaults }` là **cú pháp trải object**: sao chép từng thuộc tính của `defaults` vào object mới; `{ ...defaults, ...JSON.parse(raw) }` trải hai object liên tiếp, thuộc tính đến sau **ghi đè** thuộc tính trùng tên, nên dữ liệu đã lưu thắng giá trị mẫu còn khoá thiếu vẫn có mẫu. `JSON.parse(raw)` đổi chuỗi JSON thành object.
- `saveDraft()`: `JSON.stringify(state)` đổi object thành chuỗi; `localStorage.setItem(khoá, chuỗi)` ghi lại.
- `formatCode(text)`: `text.toUpperCase()` viết hoa; `replace(/[^A-Z0-9]/g, '')` thay mọi ký tự **không** thuộc `A-Z0-9` bằng chuỗi rỗng (`[^...]` là tập phủ định, cờ `g` là thay mọi chỗ khớp, không chỉ chỗ đầu); `slice(0, 7)` giữ tối đa 7 ký tự (tham số thứ hai là vị trí **dừng**, không tính); `replace(/^([A-Z0-9]{3})([A-Z0-9]+)$/, '$1-$2')`: `^` đầu chuỗi, `$` cuối chuỗi, `{3}` đúng 3 lần, `+` một hoặc nhiều, mỗi cặp ngoặc tròn là một **nhóm bắt**, `$1` và `$2` trong chuỗi thay thế chèn lại nhóm 1 và nhóm 2 với dấu `-` ở giữa. Chuỗi chưa đủ 4 ký tự không khớp nên không bị chèn `-`.
- `checkCode(code)`: trả chuỗi lỗi hoặc `''`. `/^[A-Z]{3}-\d{4}$/.test(code)` trả `true`/`false` (`\d` là một chữ số 0–9); `!` đảo kết quả. `code.slice(4)` lấy từ vị trí 4 đến hết (chỉ phần số); `.split('')` tách thành mảng từng ký tự; `.map(Number)` truyền **tên hàm** `Number` đổi từng ký tự thành số; `digits.slice(0, 3)` lấy ba chữ số đầu; `.reduce(hàm, 0)` gộp mảng thành một giá trị, hàm nhận `(tổng tích luỹ, phần tử)` và `0` là giá trị khởi đầu; `sum % 10` là phần dư khi chia 10; `!==` là "không bằng chặt"; `return` sớm thoát hàm.
- `validateField(field)`: `field.setCustomValidity(chuỗi)` đặt thông báo lỗi riêng, chuỗi **rỗng** là hợp lệ (quên chuỗi rỗng thì ô kẹt ở trạng thái sai); `field.validity.valid` là `true` khi mọi ràng buộc (kể cả `required`, `minlength`) đều qua; `field.validationMessage` là câu lỗi của trình duyệt (hoặc chuỗi bạn đặt); `setAttribute('aria-invalid', String(!valid))` ghi `"true"`/`"false"` để CSS `aria-invalid:` và trình đọc màn hình biết; `[data-error="' + field.name + '"]` ghép tên ô vào selector.
- `renderBarcode()`: `Array.from(state.code)` tách chuỗi thành mảng từng ký tự; `.map(hàm)` trả mảng mới; `cloneNode(true)` nhân bản sâu nút trong template; `char.charCodeAt(0)` trả mã số của ký tự đầu (ví dụ `'D'` là 68); `% 4` lấy dư, `+ 1` đưa về 1–4, `* 2` thành 2–8, nối `'px'`; `style.setProperty('--w', giá trị)` ghi biến CSS; `barcode.replaceChildren(...bars)` thay toàn bộ con (dấu `...` trải mảng thành từng tham số).
- `render()`: `bindings.forEach(hàm)` duyệt từng phần tử; `element.dataset.bind` đọc `data-bind`; `state[element.dataset.bind]` là truy cập thuộc tính bằng tên động (ngoặc vuông); `.trim()` cắt khoảng trắng hai đầu; `a || '...'` trả `a` nếu `a` không rỗng, ngược lại trả `'...'`.
- `setTilt(x, y)`: nhận toạ độ đã chuẩn hoá 0–1. `(x - 0.5) * 2 * MAX_TILT` đổi sang góc từ −18 đến 18 (con trỏ bên phải thì `rotateY` dương, mép phải lùi ra xa người xem); `rotateX` có dấu trừ vì `rotateX` dương làm mép **trên** lùi ra xa, mà ta muốn con trỏ ở phía trên thì mép trên lùi; `rotateX.toFixed(2)` làm tròn chuỗi 2 chữ số thập phân; `x * 100 + '%'` nhân trước rồi ghép chuỗi; `card.style.setProperty(tên, giá trị)` ghi từng biến CSS (`--rx`, `--ry`, `--mx`, `--my`, `--pos`, `--shadow`).
- `handlePointerEnter()`: `card.toggleAttribute('data-tracking', true)`: tham số thứ hai `force` là `true` thì luôn **bật** (khác `toggleAttribute(tên)` một tham số chỉ đảo trạng thái); `reduceMotion.matches` là `true` khi người dùng bật giảm chuyển động. `window.matchMedia('(prefers-reduced-motion: reduce)')` trả đối tượng `MediaQueryList`.
- `handlePointerMove(event)`: `event.clientX`/`clientY` là toạ độ chuột trong cửa sổ; `stage.getBoundingClientRect()` trả hộp `{ left, top, width, height }` của khung đứng yên; `Math.min(Math.max(v, 0), 1)` kẹp `v` vào khoảng 0 đến 1 (`max` lấy số lớn hơn nên không nhỏ hơn 0, `min` lấy số nhỏ hơn nên không lớn hơn 1).
- `handlePointerLeave()`: `toggleAttribute('data-tracking', false)` luôn **tắt**; `setTilt(0.5, 0.5)` đưa thẻ về giữa (thẳng, vệt sáng ở giữa).
- `handleInput(event)`: `event.target` là ô vừa được gõ; `field.name` là thuộc tính `name`; `state[field.name] = field.value` ghi vào object bằng tên động; `if (field.name !== 'role')` bỏ qua ô chọn vai trò vì không có chỗ báo lỗi.
- `handleClick(event)`: `!event.target.closest('[data-flip]')` đúng khi không bấm vào nút lật, `return` sớm. `card.toggleAttribute('data-flipped')` **trả về** `true` nếu sau khi đảo thuộc tính đang có, `false` nếu vừa bị gỡ; `flipped ? 'Lật về mặt trước' : 'Lật thẻ'` là toán tử ba ngôi chọn chữ nút; `card.querySelector('[data-side="front"]')` chọn bằng thuộc tính có giá trị.
- Phần khởi động: `new Date()` là thời điểm hiện tại; `expiry.setDate(expiry.getDate() + 30)` đặt ngày trong tháng, vượt quá số ngày của tháng thì tự nhảy sang tháng sau; `dateFormatter.format(expiry)` ra chuỗi như `28 thg 12, 2026`; `form.elements.holder` lấy ô theo `name`; `stage.addEventListener('pointerenter', handlePointerEnter)` và các dòng tương tự đăng ký hàm bằng cách truyền tên hàm, không có `()`; `const state = loadDraft()` giữ nguyên tham chiếu nhưng vẫn sửa được thuộc tính.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Tailwind trong starter | CSS trong `solution/style.css` |
|---|---|
| `relative mt-6 perspective-distant` trên `data-stage` | `.stage { position: relative; margin-top: 24px; perspective: 1200px }` |
| `group relative h-56 transform-3d rounded-3xl shadow-(--shadow) rotate-x-(--rx) rotate-y-(--ry) transition-transform duration-300 ease-out data-tracking:duration-75` | `.badge { position: relative; height: 224px; border-radius: 24px; transform: rotateX(var(--rx)) rotateY(var(--ry)); transform-style: preserve-3d; box-shadow: var(--shadow); transition: transform 300ms ease-out }` và `.badge[data-tracking] { transition-duration: 75ms }` |
| `absolute inset-0 transform-3d transition-transform duration-700 group-data-flipped:rotate-y-180` | `.flipper { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform 700ms ease-out }` và `.badge[data-flipped] .flipper { transform: rotateY(180deg) }` |
| `absolute inset-0 isolate overflow-clip rounded-3xl border border-white/25 bg-white/10 inset-ring-1 inset-ring-white/20 backdrop-blur-md backface-hidden` | `.side { position: absolute; inset: 0; isolation: isolate; overflow: clip; border: 1px solid rgb(255 255 255 / 0.25); border-radius: 24px; background: rgb(255 255 255 / 0.1); backdrop-filter: blur(12px); box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.2); backface-visibility: hidden }` |
| `rotate-y-180` (mặt sau) | `.back { transform: rotateY(180deg) }` |
| `pointer-events-none absolute inset-0 bg-[linear-gradient(...)] opacity-35 mix-blend-color-dodge bg-size-[300%_300%] bg-position-(--pos)` | `.holo { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(...); background-size: 300% 300%; background-position: var(--pos); mix-blend-mode: color-dodge; opacity: 0.35 }` |
| `... bg-[radial-gradient(...)] mix-blend-overlay opacity-0 transition-opacity duration-300 group-data-tracking:opacity-100` | `.glare { ...; mix-blend-mode: overlay; opacity: 0; transition: opacity 300ms }` và `.badge[data-tracking] .glare { opacity: 1 }` |
| `w-(--w) bg-white/90` trên vạch | `.bar { width: var(--w); background: rgb(255 255 255 / 0.9) }` |
| `aria-invalid:border-rose-400` | `.input[aria-invalid="true"] { border-color: #fb7185 }` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { .badge, .flipper, .glare, .flip { transition: none } }` |

Khác biệt nhỏ: Tailwind ghép `rotate-x-*` và `rotate-y-*` qua các biến `--tw-rotate-x`, `--tw-rotate-y`; bản thuần viết thẳng `rotateX(...) rotateY(...)` trong `transform`. Tailwind cũng ghép `inset-ring-1` với `shadow-*` trong một `box-shadow`; ở đây `box-shadow: var(--shadow)` đứng ở thẻ ngoài còn viền sáng bên trong đứng ở hai mặt, nên không cần gộp.
