# Bài 003: Hộp thoại xác nhận xoá và bẫy `fixed` trong phần tử bị nhấc

Tuần 1, ngày 3/7, vòng 1, độ khó ★★★☆☆, thời gian ước tính 45 phút.

> Trước khi làm, mở PowerShell ở thư mục `daily-css-js` và chạy `npm run dev` (cách cài lần đầu xem `daily-css-js/README.md`). `starter/index.html` đã nối sẵn `<link rel="stylesheet" href="../../build/tailwind.css" />`.
>
> Bạn làm bằng Tailwind, còn lời giải (`solution/`) viết bằng **CSS thuần** trong `solution/style.css` để bạn đối chiếu mỗi class ra thuộc tính CSS nào.

## Mục tiêu

- Danh sách 8 dự án, phía trên có thanh tiêu đề **dính** ở đỉnh màn hình khi cuộn (`sticky top-0`). Thẻ đang nhấc lên khi rê chuột không được đè lên thanh này.
- Bấm "Xoá" ở một thẻ: hiện hộp thoại phủ **toàn màn hình** (`fixed inset-0`), nền tối mờ phía sau, hộp trắng ở giữa, ghi đúng tên dự án sắp xoá.
- Mở hộp thoại: focus vào nút "Huỷ"; phần trang phía sau không bấm được, không Tab tới được.
- Đóng bằng "Huỷ", bấm vào nền tối, hoặc Escape: focus về lại đúng nút "Xoá" vừa bấm.
- Bấm "Xoá dự án": thẻ biến mất, số đếm trên thanh tiêu đề giảm 1, focus về tiêu đề.

## Kết quả mong đợi

Nền xám xanh nhạt, cột giữa rộng khoảng 448px. Trên cùng là "Dự án" kèm một viên tròn tím nhạt ghi số 8, bên dưới là dòng chữ nhỏ. Tám thẻ trắng xếp dọc, mỗi thẻ có tên, thời gian cập nhật và chữ "Xoá" màu đỏ hồng bên phải. Cuộn xuống thì thanh tiêu đề đứng yên ở trên, các thẻ trượt qua bên dưới nó. Bấm "Xoá" ở thẻ "App ghi chú": cả màn hình tối lại, một hộp trắng trượt nhẹ lên giữa màn hình với dòng "Bạn sắp xoá **App ghi chú**", hai nút "Huỷ" và "Xoá dự án" (nền đỏ).

## Tư duy

**Bẫy chính: `fixed` không phải lúc nào cũng bám theo màn hình.** Bình thường `position: fixed` lấy **khung nhìn** (viewport) làm khung tham chiếu, nên `fixed inset-0` phủ kín màn hình. Nhưng nếu một phần tử tổ tiên có `transform`, `translate`, `scale`, `rotate`, `filter` hoặc `perspective` khác `none`, thì tổ tiên đó trở thành khung tham chiếu cho mọi con cháu `fixed`. Lúc đó `fixed inset-0` chỉ phủ kín **tổ tiên đó**, không còn phủ màn hình.

Bài 002 bạn đã biết `-translate-y-0.5` trên thẻ tạo ra stacking context. Bài này cũng chính lớp đó gây ra hậu quả thứ hai: nếu đặt hộp thoại **bên trong** thẻ, thì khi thẻ đang nhấc (rê chuột, hoặc có focus bên trong), hộp thoại bị nhét gọn trong thẻ. Tệ hơn, khi bấm "Xoá" thì focus nằm trong thẻ, nên `focus-within` giữ thẻ ở trạng thái nhấc, và hộp thoại kẹt luôn trong đó.

Giống như dán một tờ thông báo "phủ kín bức tường" nhưng lại dán vào trong một khung ảnh treo trên tường: tờ giấy chỉ phủ được khung ảnh. Cách sửa đúng là đặt hộp thoại **ra ngoài**, làm con trực tiếp của `body`, nằm ngoài `main`. HTML của bài đã đặt sẵn như vậy. Ở bước 5 bạn sẽ cố tình dời nó vào trong thẻ để tận mắt thấy bẫy.

**Bẫy phụ, ôn lại bài 002: thanh tiêu đề dính cần `z-10`.** `sticky` là một kiểu định vị, nhưng nếu không có `z-index` thì nó được vẽ theo thứ tự HTML. Thẻ đang nhấc có `translate` nên cũng tạo một "xấp giấy" riêng, và vì thẻ đứng **sau** thanh tiêu đề trong HTML nên được vẽ đè lên. Cho thanh tiêu đề `z-10` là nó luôn nằm trên.

**Thứ tự lớp trong hộp thoại.** Bên trong `[data-dialog]` có hai con: nền tối `absolute inset-0` và hộp trắng. Hộp trắng đứng sau trong HTML và có `relative`, nên được vẽ trên nền tối. Nền tối là một phần tử riêng để JS bắt được cú click "bấm ra ngoài hộp".

**Trạng thái:**
- Hộp thoại mở hay đóng: thuộc tính `data-open` trên `[data-dialog]`, giống bài 002. Tailwind đọc bằng `data-open:` trên chính nó và `group-data-open:` trên hộp trắng bên trong.
- Trang phía sau bị khoá: thuộc tính `inert` trên `main`. `inert` là thuộc tính HTML có sẵn: phần tử có `inert` cùng mọi thứ bên trong không bấm được, không Tab tới được, không `focus()` được.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Thanh tiêu đề dính và nằm trên (`sticky top-0 z-10`) | Bắt click "Xoá", "Huỷ", "Xoá dự án", click nền tối, phím Escape |
| Hộp thoại phủ màn hình (`fixed inset-0 z-50`), nền tối, hộp ở giữa | Bật/tắt `data-open` trên hộp thoại, `inert` trên `main` |
| Ẩn/hiện, mờ dần, trượt lên theo `data-open` | Ghi tên dự án vào hộp thoại bằng `textContent` |
| Tắt chuyển động khi `motion-reduce` | Nhớ thẻ nào đang chờ xoá và nút nào đã mở hộp; xoá thẻ, cập nhật số đếm, chuyển focus |

JS KHÔNG nên: thêm/gỡ `invisible`, `opacity-0`, đặt `style.display`, tự tính vị trí giữa màn hình, hay dời hộp thoại vào trong thẻ. JS chỉ ghi hai trạng thái là `data-open` và `inert`, cùng nội dung chữ.

## Ôn lại

- Bài 001 (`bai-001-the-phu-dinh-vi`): `absolute inset-0` làm lớp phủ, ẩn bằng `visibility` để không Tab vào được, Escape, `focus()`.
- Bài 002 (`bai-002-menu-ba-cham`): `translate` tạo stacking context, `data-open:` và `group-data-open:`, `toggleAttribute(name, force)`, `forEach`, `closest`, trả focus về nút đã mở.
- Mới ở bài này: `fixed`, `sticky`, `inert`, `textContent`, `remove()`, và lưu "ai mở hộp thoại" vào biến `let`.

## Gợi ý từng bước

1. **Bố cục trang.** `body`: `bg-slate-100 font-sans text-slate-800`. `main`: `mx-auto max-w-md px-6 pb-24` (`mx-auto` căn giữa, `max-w-md` rộng tối đa 448px, `pb-24` chừa 96px dưới cùng cho dễ cuộn). `ul`: `space-y-3`. Kiểm tra: một cột thẻ ở giữa, chưa có màu thẻ.
2. **Thẻ.** `article`: `flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md`. `justify-between` đẩy khối chữ sang trái, nút "Xoá" sang phải. `h2`: `font-medium`. `p` trong thẻ: `text-sm text-slate-500`. Nút "Xoá" (`[data-delete]`): `rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600`. Kiểm tra: 8 thẻ trắng, chữ "Xoá" đỏ hồng bên phải, Tab tới thấy viền.
3. **Thanh tiêu đề dính.** `header`: `sticky top-0 bg-slate-100 py-4`, **chưa thêm `z-10`**. `sticky top-0` nghĩa là cuộn bình thường cho tới khi phần tử chạm đỉnh, rồi dính lại ở `top: 0`. Cần `bg-slate-100` vì không có nền thì thẻ trượt qua sẽ lộ ra sau chữ. `h1`: `text-lg font-semibold focus:outline-none` (JS sẽ `focus()` vào tiêu đề sau khi xoá, không cần viền ở đây). Số đếm `[data-count]`: `ml-1 rounded-full bg-indigo-100 px-2 text-sm text-indigo-700`. Dòng chữ nhỏ: `text-xs text-slate-500`.
4. **Nhấc thẻ và gặp bẫy phụ.** Thêm cho `article`: `transition-transform duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5 motion-reduce:transition-none`. Thu nhỏ cửa sổ cho có thanh cuộn, cuộn để một thẻ nằm dưới thanh tiêu đề, rồi rê chuột vào phần thẻ còn lộ ra: thẻ **đè lên** thanh tiêu đề. Thêm `z-10` vào `header`: hết đè. Đọc lại "Bẫy phụ" trong mục Tư duy.
5. **Hộp thoại và bẫy chính.** `[data-dialog]`: `group fixed inset-0 z-50 grid place-items-center p-6`. Nền tối `[data-dialog-backdrop]`: `absolute inset-0 bg-slate-900/50` (`/50` là độ trong suốt 50%). Hộp trắng `[role="dialog"]`: `relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl`. `h2` trong hộp: `text-lg font-semibold`. `p`: `mt-2 text-sm text-slate-600`. Khối nút: `mt-5 flex justify-end gap-2`. "Huỷ": `rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`. "Xoá dự án": `rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600`. Lúc này hộp thoại đang hiện và phủ kín màn hình.
   **Thí nghiệm bẫy:** cắt cả khối `<div data-dialog ...>...</div>`, dán vào trong `article` đầu tiên, ngay trước `</article>`, lưu file. Rê chuột vào thẻ đầu: lớp tối co lại chỉ bằng cái thẻ. Mở DevTools, xem tab Computed của `article` có `translate: 0px -2px`. Đọc lại "Bẫy chính" trong mục Tư duy, rồi **dời khối đó về chỗ cũ** (sau `</main>`, trước `<script>`).
6. **Ẩn hộp thoại theo trạng thái.** Thêm cho `[data-dialog]`: `invisible opacity-0 transition-opacity duration-200 data-open:visible data-open:opacity-100 motion-reduce:transition-none`. Thêm cho hộp trắng: `translate-y-2 transition-[translate] duration-200 group-data-open:translate-y-0 motion-reduce:transition-none`. Chỉ cho `opacity` (và `translate`) chuyển động, `visibility` đổi ngay, để `focus()` vào "Huỷ" lúc mở luôn thành công. Kiểm tra: hộp thoại biến mất; trong DevTools tự thêm thuộc tính `data-open` vào `[data-dialog]` thì nó hiện và hộp trắng trượt lên.
7. **JS: lấy phần tử và mở hộp thoại.** Dùng `document.querySelector` lấy `main` (`[data-page]`), tiêu đề (`[data-heading]`), số đếm (`[data-count]`), hộp thoại (`[data-dialog]`) và các phần bên trong nó. Tạo hai biến `let` để nhớ: thẻ đang chờ xoá và nút "Xoá" vừa bấm (để trả focus). Dùng `let` vì giá trị thay đổi mỗi lần mở; ban đầu gán `null` nghĩa là "chưa có gì".
   Viết hàm `setDialog(isOpen)` bật/tắt hai thuộc tính: `dialog.toggleAttribute('data-open', isOpen)` và `page.toggleAttribute('inert', isOpen)`.
   Gắn click cho từng nút "Xoá" bằng `querySelectorAll('[data-card]')` và `forEach` như bài 002. Khi bấm: nhớ thẻ và nút, ghi tên dự án vào `[data-dialog-name]` bằng `textContent`, gọi `setDialog(true)`, rồi `focus()` nút "Huỷ".
   `textContent` đọc hoặc ghi **chữ thuần** của phần tử. Ghi bằng `textContent` an toàn hơn `innerHTML`, vì chữ được hiểu là chữ chứ không phải thẻ HTML.
   Kiểm tra: bấm "Xoá" ở thẻ nào thì hộp thoại ghi đúng tên thẻ đó, focus nằm ở "Huỷ", Tab không ra được phần trang phía sau.
8. **JS: đóng và xoá.**
   - Hàm đóng: gọi `setDialog(false)` **trước**, rồi mới `focus()` nút "Xoá" đã nhớ. Làm ngược lại thì `main` vẫn đang `inert`, nên `focus()` vào nút bên trong nó sẽ không có tác dụng.
   - Gắn hàm đóng cho click "Huỷ", click nền tối, và phím Escape. Với Escape, chỉ đóng khi hộp thoại đang mở: `event.key === 'Escape' && dialog.hasAttribute('data-open')`. `&&` nghĩa là "cả hai điều kiện đều đúng".
   - Hàm xoá: `currentCard.closest('li').remove()`. `closest('li')` đi ngược lên tìm `li` bọc thẻ, còn `remove()` gỡ phần tử đó khỏi trang. Sau đó đếm lại bằng `document.querySelectorAll('[data-card]').length` và ghi vào số đếm, rồi `setDialog(false)` và `focus()` tiêu đề. Tiêu đề có `tabindex="-1"` nên `focus()` vào được bằng JS, nhưng phím Tab vẫn bỏ qua nó.
   Kiểm tra: xoá "App ghi chú" thì còn 7 thẻ, số đếm thành 7.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `sticky top-0` | `position: sticky; top: 0` |
| `fixed inset-0` | `position: fixed; top: 0; right: 0; bottom: 0; left: 0` |
| `z-10`, `z-50` | `z-index: 10`, `z-index: 50` |
| `mx-auto` | `margin-left: auto; margin-right: auto` |
| `max-w-md`, `max-w-sm` | `max-width: 448px`, `max-width: 384px` |
| `pb-24` | `padding-bottom: 96px` |
| `justify-between` | `justify-content: space-between` |
| `grid place-items-center` | `display: grid; place-items: center` (con nằm giữa cả hai chiều) |
| `bg-slate-900/50` | `background: rgb(15 23 42 / 0.5)` (màu slate-900, trong suốt 50%) |
| `shadow-2xl` | `box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)` |
| `-translate-y-0.5`, `translate-y-2` | `translate: 0 -2px`, `translate: 0 8px` |
| `invisible` / `data-open:visible` | `visibility: hidden` / `[data-open] { visibility: visible }` |
| `group-data-open:translate-y-0` | `.group[data-open] .hop-trang { translate: 0 0 }` |
| `transition-[translate]` | `transition-property: translate` |
| `focus:outline-none` | `:focus { outline: none }` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Cuộn xuống: thanh tiêu đề đứng yên ở đỉnh, rê chuột vào thẻ nằm sát dưới nó thì thẻ không đè lên thanh.
- [ ] Trong DevTools, xoá class `z-10` khỏi `header` rồi rê chuột như trên: thẻ đè lên thanh. Thêm lại: hết đè.
- [ ] Bấm "Xoá" ở thẻ bất kỳ: lớp tối phủ **kín màn hình**, không chỉ phủ cái thẻ.
- [ ] Dời hộp thoại vào trong `article` (như bước 5): lớp tối co lại bằng thẻ. Giải thích được vì sao, rồi dời về chỗ cũ.
- [ ] Mở hộp thoại: focus ở "Huỷ"; bấm Tab nhiều lần, focus chỉ đi giữa "Huỷ" và "Xoá dự án" (cùng thanh địa chỉ của trình duyệt), không vào các thẻ phía sau.
- [ ] Đóng bằng "Huỷ", bằng click nền tối, bằng Escape: cả ba lần focus đều về đúng nút "Xoá" đã bấm.
- [ ] Click vào **bên trong** hộp trắng (vào chữ): hộp thoại không đóng.
- [ ] "Xoá dự án": thẻ biến mất, số đếm giảm 1, focus nằm ở tiêu đề "Dự án".
- [ ] Trong Elements: `data-open` trên `[data-dialog]` và `inert` trên `main` bật/tắt cùng lúc.
- [ ] Bật giả lập `prefers-reduced-motion: reduce`: thẻ không nhấc mượt, hộp thoại hiện ngay không mờ dần.
- [ ] Tự hỏi: vì sao click vào chữ trong hộp trắng không đóng hộp, dù hộp trắng nằm ngay trên nền tối?
- [ ] Tự hỏi: nếu trong hàm đóng bạn `focus()` nút "Xoá" trước rồi mới `setDialog(false)`, chuyện gì xảy ra? Thử đổi chỗ hai dòng để kiểm chứng.
- [ ] Tự hỏi: nếu bỏ `hover:-translate-y-0.5` và `focus-within:-translate-y-0.5` khỏi thẻ, hộp thoại đặt trong thẻ có còn bị co lại không?

## Thử thách thêm

1. Khoá cuộn trang khi hộp thoại mở. Gợi ý: JS bật thêm thuộc tính `data-locked` trên `body` (`document.body.toggleAttribute('data-locked', isOpen)` trong `setDialog`), còn `body` có class `data-locked:overflow-hidden`.
2. Thay `div` hộp thoại bằng thẻ `<dialog>` có sẵn của HTML và mở bằng `showModal()`. Thẻ này tự nằm ở "top layer", tầng cao hơn mọi `z-index`. Thử đặt nó vào trong thẻ đang nhấc: nó có còn bị co lại không? Gợi ý class cho nền tối: `backdrop:bg-slate-900/50`.

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
		<title>Bài 003 - Hộp thoại xác nhận xoá</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body>
		<main data-page class="page">
			<header class="toolbar">
				<h1 data-heading tabindex="-1" class="toolbar-title">Dự án <span data-count class="count">8</span></h1>
				<p class="toolbar-hint">Cuộn xuống: thanh này dính ở trên cùng</p>
			</header>
			<ul class="card-list">
				<li>
					<article data-card class="card">
						<div>
							<h2 data-card-name class="card-title">Website quán cà phê</h2>
							<p class="card-meta">Cập nhật 2 giờ trước</p>
						</div>
						<button data-delete type="button" class="delete-button">Xoá</button>
					</article>
				</li>
				<li>
					<article data-card class="card">
						<div>
							<h2 data-card-name class="card-title">App ghi chú</h2>
							<p class="card-meta">Cập nhật hôm qua</p>
						</div>
						<button data-delete type="button" class="delete-button">Xoá</button>
					</article>
				</li>
				<li>
					<article data-card class="card">
						<div>
							<h2 data-card-name class="card-title">Landing page khoá học</h2>
							<p class="card-meta">Cập nhật 3 ngày trước</p>
						</div>
						<button data-delete type="button" class="delete-button">Xoá</button>
					</article>
				</li>
				<li>
					<article data-card class="card">
						<div>
							<h2 data-card-name class="card-title">Blog du lịch</h2>
							<p class="card-meta">Cập nhật 1 tuần trước</p>
						</div>
						<button data-delete type="button" class="delete-button">Xoá</button>
					</article>
				</li>
				<li>
					<article data-card class="card">
						<div>
							<h2 data-card-name class="card-title">Trang portfolio</h2>
							<p class="card-meta">Cập nhật 2 tuần trước</p>
						</div>
						<button data-delete type="button" class="delete-button">Xoá</button>
					</article>
				</li>
				<li>
					<article data-card class="card">
						<div>
							<h2 data-card-name class="card-title">Shop bánh ngọt</h2>
							<p class="card-meta">Cập nhật 3 tuần trước</p>
						</div>
						<button data-delete type="button" class="delete-button">Xoá</button>
					</article>
				</li>
				<li>
					<article data-card class="card">
						<div>
							<h2 data-card-name class="card-title">Dashboard bán hàng</h2>
							<p class="card-meta">Cập nhật 1 tháng trước</p>
						</div>
						<button data-delete type="button" class="delete-button">Xoá</button>
					</article>
				</li>
				<li>
					<article data-card class="card">
						<div>
							<h2 data-card-name class="card-title">Game đoán số</h2>
							<p class="card-meta">Cập nhật 2 tháng trước</p>
						</div>
						<button data-delete type="button" class="delete-button">Xoá</button>
					</article>
				</li>
			</ul>
		</main>
		<div data-dialog class="dialog">
			<div data-dialog-backdrop class="dialog-backdrop"></div>
			<div role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-text" class="dialog-panel">
				<h2 id="dialog-title" class="dialog-title">Xoá dự án?</h2>
				<p id="dialog-text" class="dialog-text">Bạn sắp xoá <strong data-dialog-name></strong>. Thao tác này không hoàn tác được.</p>
				<div class="dialog-actions">
					<button data-dialog-cancel type="button" class="button">Huỷ</button>
					<button data-dialog-confirm type="button" class="button danger">Xoá dự án</button>
				</div>
			</div>
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

h1,
h2 {
	font-size: inherit;
	font-weight: inherit;
}

body {
	background: #f1f5f9;
	color: #1e293b;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	max-width: 448px;
	margin: 0 auto;
	padding: 0 24px 96px;
}

.toolbar {
	position: sticky;
	top: 0;
	z-index: 10;
	padding: 16px 0;
	background: #f1f5f9;
}

.toolbar-title {
	font-size: 18px;
	font-weight: 600;
}

.toolbar-title:focus {
	outline: none;
}

.count {
	margin-left: 4px;
	padding: 0 8px;
	border-radius: 9999px;
	background: #e0e7ff;
	color: #4338ca;
	font-size: 14px;
}

.toolbar-hint {
	font-size: 12px;
	color: #64748b;
}

.card-list {
	display: grid;
	gap: 12px;
}

.card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 16px;
	border-radius: 16px;
	background: #fff;
	box-shadow:
		0 4px 6px -1px rgb(0 0 0 / 0.1),
		0 2px 4px -2px rgb(0 0 0 / 0.1);
	transition: translate 200ms ease;
}

.card:hover,
.card:focus-within {
	translate: 0 -2px;
}

.card-title {
	font-weight: 500;
}

.card-meta {
	font-size: 14px;
	color: #64748b;
}

.delete-button {
	padding: 6px 12px;
	border-radius: 8px;
	color: #e11d48;
	font-size: 14px;
	font-weight: 500;
}

.delete-button:hover {
	background: #fff1f2;
}

.delete-button:focus-visible {
	outline: 2px solid #e11d48;
	outline-offset: 2px;
}

.dialog {
	position: fixed;
	inset: 0;
	z-index: 50;
	display: grid;
	place-items: center;
	padding: 24px;
	visibility: hidden;
	opacity: 0;
	transition: opacity 200ms ease;
}

.dialog[data-open] {
	visibility: visible;
	opacity: 1;
}

.dialog-backdrop {
	position: absolute;
	inset: 0;
	background: rgb(15 23 42 / 0.5);
}

.dialog-panel {
	position: relative;
	width: 100%;
	max-width: 384px;
	padding: 20px;
	border-radius: 16px;
	background: #fff;
	box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	translate: 0 8px;
	transition: translate 200ms ease;
}

.dialog[data-open] .dialog-panel {
	translate: 0 0;
}

.dialog-title {
	font-size: 18px;
	font-weight: 600;
}

.dialog-text {
	margin-top: 8px;
	font-size: 14px;
	color: #475569;
}

.dialog-actions {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	margin-top: 20px;
}

.button {
	padding: 8px 16px;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
}

.button:hover {
	background: #f1f5f9;
}

.button:focus-visible {
	outline: 2px solid #4f46e5;
	outline-offset: 2px;
}

.button.danger {
	background: #e11d48;
	color: #fff;
}

.button.danger:hover {
	background: #be123c;
}

.button.danger:focus-visible {
	outline-color: #e11d48;
}

@media (prefers-reduced-motion: reduce) {
	.card,
	.dialog,
	.dialog-panel {
		transition: none;
	}
}
```

`solution/script.js`

```js
const page = document.querySelector('[data-page]');
const heading = document.querySelector('[data-heading]');
const count = document.querySelector('[data-count]');
const dialog = document.querySelector('[data-dialog]');
const dialogName = dialog.querySelector('[data-dialog-name]');
const cancelButton = dialog.querySelector('[data-dialog-cancel]');
const confirmButton = dialog.querySelector('[data-dialog-confirm]');
const backdrop = dialog.querySelector('[data-dialog-backdrop]');
let currentCard = null;
let lastTrigger = null;

function setDialog(isOpen) {
	dialog.toggleAttribute('data-open', isOpen);
	page.toggleAttribute('inert', isOpen);
}

function openDialog(card, trigger) {
	currentCard = card;
	lastTrigger = trigger;
	dialogName.textContent = card.querySelector('[data-card-name]').textContent;
	setDialog(true);
	cancelButton.focus();
}

function closeDialog() {
	setDialog(false);
	lastTrigger.focus();
	currentCard = null;
	lastTrigger = null;
}

function confirmDelete() {
	currentCard.closest('li').remove();
	count.textContent = String(document.querySelectorAll('[data-card]').length);
	setDialog(false);
	heading.focus();
	currentCard = null;
	lastTrigger = null;
}

document.querySelectorAll('[data-card]').forEach(function (card) {
	card.querySelector('[data-delete]').addEventListener('click', function (event) {
		openDialog(card, event.currentTarget);
	});
});

cancelButton.addEventListener('click', closeDialog);
backdrop.addEventListener('click', closeDialog);
confirmButton.addEventListener('click', confirmDelete);

document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' && dialog.hasAttribute('data-open')) {
		closeDialog();
	}
});
```

</details>

### Giải thích từng hàm

- `document.querySelector('[data-page]')`: tìm phần tử **đầu tiên** khớp selector. Mỗi phần tử ở đây chỉ có một, nên dùng `querySelector` là đủ.
- `dialog.querySelector('[data-dialog-name]')`: gọi `querySelector` trên `dialog` thay vì trên `document`, nghĩa là chỉ tìm bên trong hộp thoại.
- `let currentCard = null;` và `let lastTrigger = null;`: dùng `let` vì mỗi lần mở hộp thoại hai biến này được gán lại. `null` là giá trị "chưa có gì". `currentCard` nhớ thẻ sắp xoá. `lastTrigger` nhớ nút "Xoá" đã bấm để trả focus về đó.
- `setDialog(isOpen)`: hàm tự đặt, bật/tắt cùng lúc hai thuộc tính. Gom vào một hàm vì ba chỗ (mở, đóng, xoá) đều cần đổi cả hai.
- `dialog.toggleAttribute('data-open', isOpen)`: như bài 002. Tham số thứ hai là `force`: `true` luôn thêm, `false` luôn gỡ.
- `page.toggleAttribute('inert', isOpen)`: cùng hàm nhưng với thuộc tính `inert` có sẵn của HTML. Khi `main` có `inert`, mọi thứ bên trong không bấm được, không Tab tới được, không `focus()` được, trình đọc màn hình cũng bỏ qua. Nhờ vậy focus bị giữ trong hộp thoại mà không cần tự viết code bẫy phím Tab.
- `openDialog(card, trigger)`: hàm tự đặt. Nhận thẻ cần xoá và nút đã bấm, nhớ cả hai vào biến, ghi tên dự án, mở hộp thoại, rồi focus "Huỷ". Focus nút "Huỷ" chứ không phải "Xoá dự án" để lỡ bấm Enter thì cũng không mất dữ liệu.
- `card.querySelector('[data-card-name]').textContent`: đọc chữ thuần của tên dự án.
- `dialogName.textContent = ...`: **ghi** chữ thuần vào thẻ `strong`, thay toàn bộ chữ cũ. Khác `innerHTML`: chuỗi ghi vào luôn được hiểu là chữ, không bao giờ thành thẻ HTML.
- `cancelButton.focus()`: đưa con trỏ bàn phím tới "Huỷ". Chạy được vì `visibility` không có transition, nên ngay sau `setDialog(true)` hộp thoại đã `visible`.
- `closeDialog()`: hàm tự đặt. Gọi `setDialog(false)` **trước**, rồi mới `lastTrigger.focus()`. Nếu `main` còn `inert` thì `focus()` vào nút bên trong nó bị bỏ qua. Cuối hàm gán lại `null` cho hai biến để không giữ thẻ cũ.
- `confirmDelete()`: hàm tự đặt, chạy khi bấm "Xoá dự án".
- `currentCard.closest('li')`: đi từ thẻ ngược lên tìm `li` gần nhất. Xoá `li` chứ không chỉ xoá `article`, để không sót lại một `li` rỗng làm lệch khoảng cách.
- `.remove()`: gỡ phần tử khỏi trang. Phần tử biến mất cùng mọi thứ bên trong nó.
- `document.querySelectorAll('[data-card]').length`: `length` là số phần tử trong danh sách. Đếm lại sau khi xoá cho chắc đúng, thay vì tự trừ 1.
- `String(...)`: đổi số thành chuỗi trước khi ghi vào `textContent`. Không có `String` vẫn chạy, nhưng viết ra cho rõ ý.
- `heading.focus()`: thẻ vừa bấm đã bị xoá nên không trả focus về nó được. Đưa focus về tiêu đề, là chỗ hợp lý tiếp theo. `tabindex="-1"` trong HTML cho phép `focus()` bằng JS mà không thêm tiêu đề vào thứ tự phím Tab.
- `event.currentTarget`: phần tử đang gắn listener, ở đây là nút "Xoá". Khác `event.target` là phần tử thật sự bị bấm.
- `cancelButton.addEventListener('click', closeDialog)`: truyền thẳng tên hàm, không có `()`. Viết `closeDialog()` thì hàm chạy ngay lúc gắn, chứ không phải lúc bấm.
- `backdrop.addEventListener('click', closeDialog)`: click nền tối thì đóng. Click vào chữ trong hộp trắng thì `event.target` là hộp trắng hoặc con của nó, không phải nền tối, nên không đóng. Hộp trắng là anh em của nền tối chứ không nằm trong nó, nên cú click không nổi bọt lên nền tối.
- `event.key === 'Escape' && dialog.hasAttribute('data-open')`: `&&` là "và", cả hai phải đúng. Thiếu vế sau thì bấm Escape lúc hộp thoại đang đóng vẫn gọi `closeDialog`, mà lúc đó `lastTrigger` là `null` nên `null.focus()` báo lỗi.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

- `sticky top-0 z-10` trên `header` tương ứng `.toolbar { position: sticky; top: 0; z-index: 10; }`.
- `fixed inset-0 z-50 grid place-items-center p-6` tương ứng `.dialog { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 24px; }`. Trong CSS cũng có thuộc tính viết tắt `inset`, giống hệt tên class.
- `data-open:visible data-open:opacity-100` tương ứng `.dialog[data-open] { visibility: visible; opacity: 1; }`. Ở đây variant `data-open:` đặt trên **chính** phần tử có `data-open`, nên CSS chỉ là selector thuộc tính dán liền tên class.
- `group-data-open:translate-y-0` trên hộp trắng tương ứng `.dialog[data-open] .dialog-panel { translate: 0 0; }`. Giống bài 002: `group` cùng `group-data-*` thành selector con cháu.
- `bg-slate-900/50` tương ứng `background: rgb(15 23 42 / 0.5)`. Ba số đầu là màu slate-900, số sau dấu `/` là độ đục.
- `hover:-translate-y-0.5 focus-within:-translate-y-0.5` tương ứng `.card:hover, .card:focus-within { translate: 0 -2px; }`. Đây chính là dòng gây ra cả hai cái bẫy.
- `space-y-3` thành `display: grid; gap: 12px;` trên `.card-list`, và `flex items-center justify-between gap-4` thành bốn dòng `display`, `align-items`, `justify-content`, `gap` trong `.card`.
- Nút "Xoá dự án" trong CSS dùng hai class `button danger`, tức `.button.danger` (hai class viết liền: phần tử phải có **cả hai**). Bên Tailwind bạn viết thẳng `bg-rose-600 text-white hover:bg-rose-700` lên nút.
- `focus:outline-none` trên tiêu đề tương ứng `.toolbar-title:focus { outline: none; }`. Dùng `:focus` chứ không phải `:focus-visible`, vì trình duyệt có thể hiện viền khi JS `focus()` sau một lần bấm phím.
- `h1, h2 { font-size: inherit; font-weight: inherit; }` ở đầu `style.css` làm thay việc Preflight của Tailwind: bỏ cỡ chữ to mặc định của tiêu đề.
- Màu: `slate-100` `#f1f5f9`, `slate-500` `#64748b`, `slate-600` `#475569`, `slate-800` `#1e293b`, `indigo-100` `#e0e7ff`, `indigo-600` `#4f46e5`, `indigo-700` `#4338ca`, `rose-50` `#fff1f2`, `rose-600` `#e11d48`, `rose-700` `#be123c`. Đây là mã hex gần đúng, Tailwind v4 thật ra dùng `oklch(...)`.
