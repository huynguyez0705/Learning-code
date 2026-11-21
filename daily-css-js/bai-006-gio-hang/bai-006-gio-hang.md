# Bài 006: Giỏ hàng có số lượng, chọn món và tổng tiền

Tuần 1, ngày 6/7, vòng 1, độ khó ★★★★☆, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở độc lập không cần mạng hoặc build.
>
> **Lưu dữ liệu:** bài này chưa dùng `localStorage`, cookie hay server. Tải lại trang là giỏ hàng trở về dữ liệu mẫu trong HTML. Đây là hành vi đúng của bài.

## Mục tiêu

- Nút `+` và `−` đổi số lượng từ 1 đến 9; dòng thành tiền của món đó đổi theo. Nút hết lượt thì bị `disabled` và mờ đi, không bao giờ vượt ngưỡng.
- Tích hoặc bỏ tích ô chọn thì tổng cộng chỉ cộng các món đang được chọn; dòng tóm tắt hiện đúng dạng "Đã chọn 3/4 món"; nút Đặt hàng bị khoá khi không chọn món nào.
- Tiền hiển thị theo định dạng Việt Nam bằng `Intl.NumberFormat` (ví dụ `1.290.000 ₫`), không tự ghép dấu chấm bằng tay.
- Dùng **một** listener `click` và **một** listener `change` trên danh sách; xoá món bằng nút `×`, xoá hết thì hiện "Giỏ hàng đang trống" và ẩn thanh tổng.
- Tự làm CSS mới: thanh tổng tiền dính đáy, tên món dài bị cắt hai dòng, đường kẻ giữa các món, màu ô tích, giao diện nút bị khoá; tự gặp và sửa một cái bẫy lưới.

## Kết quả mong đợi

Trang "Giỏ hàng của bạn" có bốn món, ba món đã tích. Tổng cộng ban đầu là `2.378.000 ₫`. Bấm `+` ở tai nghe: tổng thành `3.668.000 ₫`. Tích thêm món thứ tư thì tổng cộng thêm tiền món đó. Tiêu đề trang dính đầu cửa sổ, thanh tổng dính đáy cửa sổ khi danh sách dài hơn màn hình. Ở màn hình 375px không có thanh cuộn ngang, tên món có mã rất dài vẫn gọn trong hai dòng.

## Tư duy

**Dữ liệu nằm ở đâu?** Mỗi món có `data-price` (đơn giá, đồng) và `data-qty` (số lượng) ngay trên thẻ `<li>`. Số lượng không nằm trong chữ hiển thị; chữ hiển thị chỉ là kết quả vẽ ra từ dữ liệu. Muốn đổi, ta sửa dữ liệu trước rồi vẽ lại, đúng thứ tự "ghi dữ liệu → vẽ". Làm ngược lại (đọc con số từ chữ trên màn hình rồi cộng thêm) sẽ hỏng khi chữ có dấu chấm hoặc ký hiệu `₫`.

**Bẫy JS: mọi giá trị đọc từ DOM đều là chuỗi.** `dataset.qty` là chuỗi `'2'`. `'2' + 1` ra `'21'`, không phải `3`. Luôn đổi bằng `Number(...)` trước khi tính. Tiền cũng vậy: lưu đơn vị đồng bằng số nguyên (`99000`), không lưu `"99.000đ"`.

**Bẫy JS: nút vừa bị `disabled` thì mất focus.** Người dùng bàn phím giữ Enter trên nút `+`. Khi đến 9, nút bị khoá và focus rơi về `<body>`: bấm tiếp chẳng đi đâu. Ta chuyển focus sang nút `−` ngay khi nút bấm bị khoá.

**Bẫy CSS: `1fr` không có nghĩa là "chia phần còn lại, tối đa bằng chỗ trống".** `1fr` là `minmax(auto, 1fr)`: cột không được nhỏ hơn nội dung nhỏ nhất của nó. Một mã dài không có khoảng trắng làm cột phình ra và đẩy cả trang tràn ngang. Giống cái cốc có nắp đậy sẵn kích thước tối thiểu: bạn rót chất lỏng vào thì chẳng ai ép nó nhỏ hơn được. Sửa gồm hai bước: `minmax(0,1fr)` cho phép cột co hẹp; còn chuỗi dài bị `line-clamp-2` cắt mất đuôi vì nó cũng ẩn phần tràn, nên cần `wrap-anywhere` để chuỗi ngắt xuống dòng và hiện đủ trong hai dòng.

**Thanh dính đáy cần nền đặc.** `sticky bottom-0` giữ thanh ở đáy khung nhìn khi cuộn. Nếu nền trong suốt, chữ các món đi qua phía sau sẽ lộ ra, vì vậy thanh đã có sẵn `bg-orange-50`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Bố cục, màu, viền focus, thanh tiêu đề dính đã dựng sẵn | Đọc `data-price`, `data-qty`, tính tiền |
| Bạn thêm: thanh tổng dính đáy, kẻ giữa các món, cắt tên dài, màu ô tích | Ghi số lượng vào `data-qty`, ghi chữ tiền bằng `textContent` |
| Bạn thêm: giao diện nút bị khoá bằng `disabled:` | Bật/tắt thuộc tính `disabled` của nút |
| Ẩn danh sách, hiện thông báo trống theo `data-empty` | Đếm món, bật/tắt `data-empty` |

JS không thêm/gỡ class giao diện, không đặt `style.*`, không tự ghép dấu chấm ngăn cách hàng nghìn, không tìm phần tử bằng class.

## Ôn lại

- Bài 004 (`bai-004-bang-diem-cot-dinh`): `sticky` và `top-0`, `tabular-nums`, uỷ quyền sự kiện bằng `closest`, `aria-pressed`.
- Bài 005 (`bai-005-binh-luan-dong`): event delegation trên danh sách, `remove()`, focus tiêu đề sau khi xoá, `group-data-empty:block`, `wrap-anywhere`, `textContent`.
- Bài 003 (`bai-003-hop-thoai-xac-nhan`): `closest`, `toggleAttribute`.
- Bài 002 (`bai-002-menu-ba-cham`): `relative` làm mốc cho `absolute` (nút `×` đặt góc phải thẻ món).

## Gợi ý từng bước

> Starter đã điền sẵn: màu nền, chữ, cỡ chữ, khoảng cách, `flex`/`grid` cơ bản, tiêu đề `sticky top-0`, nút `+`/`−`/`×` có viền focus và hover, nút Đặt hàng, thông báo trống (`group-data-empty:block`), ẩn danh sách và thanh tổng khi trống (`group-data-empty:hidden`). Bạn tự thêm các class ghi ở dòng **Bạn làm:**. Không có ô nào hiện chữ tiền, số lượng hay dòng tóm tắt, vì chúng do JS vẽ.

1. **Làm quen HTML và đường kẻ giữa các món.** **Bạn làm:** thẻ `<ul data-list>`: `divide-y divide-orange-200`. Đọc các thuộc tính `data-*` và hiểu vai trò: `data-item`, `data-price`, `data-qty`, `data-check`, `data-qty-text`, `data-line-total`, `data-decrease`, `data-increase`, `data-remove`, `data-total`, `data-summary`, `data-status`, `data-checkout`, `data-cart`. `divide-y` kẻ đường ngang giữa các con trực tiếp (trừ con cuối). Kiểm tra: có đường kẻ cam nhạt giữa bốn món, không có đường dưới món cuối.

2. **Lưới hai cột và cái bẫy `1fr`.** **Bạn làm:** mỗi thẻ `<li data-item>` (4 thẻ): thêm `grid-cols-[auto_1fr]`, kiểm tra ở màn hình 375px, rồi **sửa thành** `grid-cols-[auto_minmax(0,1fr)]`. Cột ô tích rộng theo nội dung (`auto`), cột còn lại lấy phần dư. Kiểm tra bước đầu: món thứ ba (mã dài) làm cả trang tràn ngang. Sau khi sửa: hết tràn, nhưng chữ bị cắt đuôi. Mở DevTools, thử gỡ rồi thêm lại class để thấy khác biệt.

3. **Cắt tên món và màu ô tích.** **Bạn làm:** mỗi `<h2>` tên món (4 thẻ): `line-clamp-2 wrap-anywhere`. Mỗi ô `<input data-check>` (4 thẻ): `accent-orange-600`. `line-clamp-2` giới hạn tên hai dòng, phần dư thành dấu `…`; `wrap-anywhere` cho chuỗi dài ngắt dòng ở bất kỳ chỗ nào; `accent-orange-600` đổi màu ô tích gốc của trình duyệt. Kiểm tra: tên món thứ ba nằm trong hai dòng, không tràn; ô tích màu cam.

4. **Thanh tổng dính đáy.** **Bạn làm:** thẻ `<div>` chứa tổng cộng và nút Đặt hàng: `sticky bottom-0`. `bottom-0` ghim thanh vào cạnh dưới của khung nhìn khi cuộn. Nó đã có nền đặc `bg-orange-50` và `border-t`. Kiểm tra: thu cửa sổ xuống thấp khoảng 400px để trang phải cuộn; thanh phải ở đáy cửa sổ khi chưa cuộn tới cuối.

5. **JS: chọn phần tử, định dạng tiền và vẽ một món.** **Bạn làm:** toàn bộ JS từ bước này trở đi. Chọn các phần tử bằng `data-*`. Tạo `new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` một lần ở đầu file. Viết hàm vẽ một món: đọc `item.dataset.price` và `item.dataset.qty`, đổi bằng `Number`, ghi số lượng và thành tiền (`formatter.format(...)`) bằng `textContent`, đặt `disabled` cho nút `−` khi số lượng là 1 và cho nút `+` khi là 9. Kiểm tra: gọi hàm cho từng món bằng `forEach` khi tải trang; thấy số lượng, thành tiền; nút `−` của món số lượng 1 bị mờ (bạn sẽ thêm `disabled:opacity-40 disabled:cursor-not-allowed` ở bước 8).

6. **JS: vẽ cả giỏ hàng.** Lấy mọi món bằng `Array.from(list.querySelectorAll('[data-item]'))`, lọc món đang tích bằng `filter`, cộng thành tiền bằng `reduce` rồi ghi tổng. Ghi dòng "Đã chọn x/y món" vào `[data-summary]`, đặt `checkoutButton.disabled`, bật `data-empty` trên `[data-cart]` khi hết món. Kiểm tra: tổng ban đầu là `2.378.000 ₫`, dòng tóm tắt là "Đã chọn 3/4 món".

7. **JS: đổi số lượng, xoá món, tích chọn.** Gắn **một** `click` lên `[data-list]`: tìm `event.target.closest('[data-item]')` rồi xem người dùng bấm `[data-remove]`, `[data-increase]` hay `[data-decrease]`. Đổi số lượng bằng hàm `clamp` (dùng `Math.min` và `Math.max`) rồi ghi lại `item.dataset.qty = String(...)`. Sau khi nút bấm bị khoá, chuyển focus sang nút kia. Xoá bằng `item.remove()` rồi focus `[data-heading]`. Gắn **một** `change` lên danh sách để vẽ lại khi tích/bỏ tích. Gắn click cho nút Đặt hàng ghi lời xác nhận vào `[data-status]`. Kiểm tra: giữ Enter trên nút `+` đến 9, focus nhảy sang `−`, không rơi về đầu trang; xoá hết món thì hiện "Giỏ hàng đang trống" và thanh tổng biến mất.

8. **Giao diện nút bị khoá.** **Bạn làm:** thêm `disabled:opacity-40 disabled:cursor-not-allowed` cho 8 nút `+`/`−` và nút Đặt hàng. Variant `disabled:` chỉ áp dụng khi nút có thuộc tính `disabled`. Kiểm tra: ở số lượng 1 nút `−` mờ; bỏ tích hết món thì nút Đặt hàng mờ; bấm vào nút mờ không làm gì.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `divide-y divide-orange-200` | `> :not(:last-child) { border-bottom: 1px solid #fed7aa }` |
| `grid-cols-[auto_1fr]` | `grid-template-columns: auto 1fr` |
| `grid-cols-[auto_minmax(0,1fr)]` | `grid-template-columns: auto minmax(0, 1fr)` |
| `line-clamp-2` | `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden` |
| `wrap-anywhere` | `overflow-wrap: anywhere` |
| `accent-orange-600` | `accent-color: #ea580c` |
| `sticky bottom-0` | `position: sticky; bottom: 0` |
| `disabled:opacity-40` | `button:disabled { opacity: 0.4 }` |
| `disabled:cursor-not-allowed` | `button:disabled { cursor: not-allowed }` |

## Tự kiểm tra

- [ ] Tổng ban đầu `2.378.000 ₫`; bấm `+` ở tai nghe thành `3.668.000 ₫`.
- [ ] Số lượng không xuống dưới 1 hay vượt 9; nút hết lượt mờ và không bấm được.
- [ ] Tích/bỏ tích đổi tổng và dòng "Đã chọn x/y món"; bỏ tích hết thì nút Đặt hàng bị khoá.
- [ ] Ở 375px không có thanh cuộn ngang; tên món dài nằm trong hai dòng.
- [ ] DevTools: sửa `data-qty` của một `<li>` thành `5` bằng tay không đổi chữ hiển thị cho tới khi bấm `+`; kiểm tra vì sao (JS chỉ vẽ lại khi có sự kiện).
- [ ] Bàn phím: Tab qua từng nút, Enter/Space đổi số lượng; giữ Enter trên `+` đến 9, focus sang `−`.
- [ ] Bật `prefers-reduced-motion: reduce` trong DevTools: màu nút đổi tức thì.
- [ ] Xoá hết món: hiện thông báo trống, thanh tổng biến mất, focus ở tiêu đề.
- [ ] Tự hỏi: vì sao tính tiền từ `data-*` thay vì từ chữ trên màn hình? Vì sao cần `Number` trước phép cộng? Vì sao `minmax(0,1fr)` chưa đủ để hiện trọn tên món?

## Thử thách thêm

1. Thêm ô "Chọn tất cả" ở đầu danh sách: tích thì mọi món được tích, và nó tự chuyển trạng thái chưa xác định (`indeterminate`) khi chỉ một số món được tích. Gợi ý class: `accent-orange-600`.
2. Thêm mã giảm giá: ô nhập `GIAM10` giảm 10% tổng cộng, hiện dòng "Giảm" riêng. Gợi ý: `data-discount` trên giỏ hàng, `tabular-nums`, `text-orange-800`; làm tròn bằng `Math.round`.

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
		<title>Bài 006 - Giỏ hàng</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main data-page class="page">
			<header class="site-header">
				<h1 data-heading tabindex="-1" class="title">Giỏ hàng của bạn</h1>
				<p data-summary aria-live="polite" class="summary"></p>
			</header>
			<section data-cart class="cart">
				<ul data-list class="list">
					<li data-item data-price="1290000" data-qty="1" class="item">
						<input data-check type="checkbox" checked aria-label="Chọn Tai nghe Bluetooth chống ồn" class="check" />
						<div class="body">
							<h2 class="name">Tai nghe Bluetooth chống ồn</h2>
							<p class="price">1.290.000&nbsp;₫</p>
							<div class="row">
								<div class="stepper">
									<button data-decrease type="button" aria-label="Giảm số lượng" class="step-button">−</button>
									<output data-qty-text class="qty"></output>
									<button data-increase type="button" aria-label="Tăng số lượng" class="step-button">+</button>
								</div>
								<p data-line-total class="line-total"></p>
							</div>
						</div>
						<button data-remove type="button" aria-label="Xoá Tai nghe Bluetooth chống ồn" class="remove">
							<span aria-hidden="true">×</span>
						</button>
					</li>
					<li data-item data-price="890000" data-qty="1" class="item">
						<input data-check type="checkbox" checked aria-label="Chọn Bàn phím cơ 87 phím" class="check" />
						<div class="body">
							<h2 class="name">Bàn phím cơ 87 phím</h2>
							<p class="price">890.000&nbsp;₫</p>
							<div class="row">
								<div class="stepper">
									<button data-decrease type="button" aria-label="Giảm số lượng" class="step-button">−</button>
									<output data-qty-text class="qty"></output>
									<button data-increase type="button" aria-label="Tăng số lượng" class="step-button">+</button>
								</div>
								<p data-line-total class="line-total"></p>
							</div>
						</div>
						<button data-remove type="button" aria-label="Xoá Bàn phím cơ 87 phím" class="remove">
							<span aria-hidden="true">×</span>
						</button>
					</li>
					<li data-item data-price="99000" data-qty="2" class="item">
						<input data-check type="checkbox" checked aria-label="Chọn Cáp sạc nhanh USB-C" class="check" />
						<div class="body">
							<h2 class="name">Cáp sạc nhanh USB-C mã CAP_SAC_NHANH_USB_C_LIGHTNING_MFI_2M_TRANG_PHIEN_BAN_GIOI_HAN</h2>
							<p class="price">99.000&nbsp;₫</p>
							<div class="row">
								<div class="stepper">
									<button data-decrease type="button" aria-label="Giảm số lượng" class="step-button">−</button>
									<output data-qty-text class="qty"></output>
									<button data-increase type="button" aria-label="Tăng số lượng" class="step-button">+</button>
								</div>
								<p data-line-total class="line-total"></p>
							</div>
						</div>
						<button data-remove type="button" aria-label="Xoá Cáp sạc nhanh USB-C" class="remove">
							<span aria-hidden="true">×</span>
						</button>
					</li>
					<li data-item data-price="175000" data-qty="1" class="item">
						<input data-check type="checkbox" aria-label="Chọn Đế tản nhiệt laptop" class="check" />
						<div class="body">
							<h2 class="name">Đế tản nhiệt laptop</h2>
							<p class="price">175.000&nbsp;₫</p>
							<div class="row">
								<div class="stepper">
									<button data-decrease type="button" aria-label="Giảm số lượng" class="step-button">−</button>
									<output data-qty-text class="qty"></output>
									<button data-increase type="button" aria-label="Tăng số lượng" class="step-button">+</button>
								</div>
								<p data-line-total class="line-total"></p>
							</div>
						</div>
						<button data-remove type="button" aria-label="Xoá Đế tản nhiệt laptop" class="remove">
							<span aria-hidden="true">×</span>
						</button>
					</li>
				</ul>
				<p class="empty">Giỏ hàng đang trống</p>
				<p data-status aria-live="polite" class="status"></p>
				<div class="bar">
					<div>
						<p class="bar-label">Tổng cộng</p>
						<p data-total class="bar-total"></p>
					</div>
					<button data-checkout type="button" class="checkout">Đặt hàng</button>
				</div>
			</section>
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
output {
	font: inherit;
	color: inherit;
}

button {
	border: 0;
	background: none;
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
	background: #fff7ed;
	color: #431407;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	margin: 0 auto;
	min-height: 100vh;
	max-width: 576px;
	padding: 0 24px 32px;
}

.site-header {
	position: sticky;
	top: 0;
	z-index: 10;
	padding: 20px 0;
	border-bottom: 1px solid #fed7aa;
	background: #fff7ed;
}

.title {
	font-size: 24px;
	line-height: 32px;
	font-weight: 700;
}

.title:focus {
	outline: none;
}

.summary {
	margin-top: 4px;
	font-size: 14px;
	line-height: 20px;
	color: #9a3412;
}

.empty {
	display: none;
	padding: 40px 0;
	text-align: center;
	color: #9a3412;
}

.cart[data-empty] .list,
.cart[data-empty] .bar {
	display: none;
}

.cart[data-empty] .empty {
	display: block;
}

.list > .item:not(:last-child) {
	border-bottom: 1px solid #fed7aa;
}

.item {
	position: relative;
	display: grid;
	grid-template-columns: auto minmax(0, 1fr);
	gap: 12px;
	padding: 16px 0;
}

.check {
	margin-top: 4px;
	width: 20px;
	height: 20px;
	cursor: pointer;
	accent-color: #ea580c;
}

.name {
	padding-right: 40px;
	font-weight: 600;
	line-height: 1.25;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	overflow-wrap: anywhere;
}

.price {
	margin-top: 4px;
	font-size: 14px;
	line-height: 20px;
	color: #9a3412;
	font-variant-numeric: tabular-nums;
}

.row {
	margin-top: 12px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.stepper {
	display: flex;
	align-items: center;
	gap: 4px;
}

.step-button {
	width: 32px;
	height: 32px;
	border: 1px solid #fdba74;
	border-radius: 8px;
	background: #fff;
	font-weight: 500;
	color: #7c2d12;
	transition: background-color 150ms ease;
}

.step-button:hover {
	background: #ffedd5;
}

.step-button:disabled,
.checkout:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.qty {
	min-width: 32px;
	text-align: center;
	font-variant-numeric: tabular-nums;
}

.line-total {
	font-weight: 600;
	font-variant-numeric: tabular-nums;
}

.remove {
	position: absolute;
	top: 12px;
	right: 0;
	width: 32px;
	height: 32px;
	border-radius: 9999px;
	font-size: 20px;
	line-height: 1;
	color: #9a3412;
	transition: background-color 150ms ease;
}

.remove:hover {
	background: #ffedd5;
}

.status {
	min-height: 20px;
	padding-top: 8px;
	font-size: 14px;
	line-height: 20px;
	color: #9a3412;
}

.bar {
	position: sticky;
	bottom: 0;
	margin-top: 8px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 16px 0;
	border-top: 1px solid #fdba74;
	background: #fff7ed;
}

.bar-label {
	font-size: 14px;
	line-height: 20px;
	color: #9a3412;
}

.bar-total {
	font-size: 20px;
	line-height: 28px;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
}

.checkout {
	padding: 8px 16px;
	border-radius: 8px;
	background: #ea580c;
	font-weight: 600;
	color: #fff;
	transition: background-color 150ms ease;
}

.checkout:hover {
	background: #c2410c;
}

.step-button:focus-visible,
.remove:focus-visible,
.check:focus-visible,
.checkout:focus-visible {
	outline: 2px solid #c2410c;
	outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
	.step-button,
	.remove,
	.checkout {
		transition: none;
	}
}
```

`solution/script.js`

```js
const MIN_QTY = 1;
const MAX_QTY = 9;
const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

const cart = document.querySelector('[data-cart]');
const list = document.querySelector('[data-list]');
const heading = document.querySelector('[data-heading]');
const summary = document.querySelector('[data-summary]');
const total = document.querySelector('[data-total]');
const status = document.querySelector('[data-status]');
const checkoutButton = document.querySelector('[data-checkout]');

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function getLineTotal(item) {
	return Number(item.dataset.price) * Number(item.dataset.qty);
}

function isSelected(item) {
	return item.querySelector('[data-check]').checked;
}

function addLineTotal(sum, item) {
	return sum + getLineTotal(item);
}

function renderItem(item) {
	const qty = Number(item.dataset.qty);
	item.querySelector('[data-qty-text]').textContent = String(qty);
	item.querySelector('[data-line-total]').textContent = formatter.format(getLineTotal(item));
	item.querySelector('[data-decrease]').disabled = qty <= MIN_QTY;
	item.querySelector('[data-increase]').disabled = qty >= MAX_QTY;
}

function renderCart() {
	const items = Array.from(list.querySelectorAll('[data-item]'));
	const selected = items.filter(isSelected);
	total.textContent = formatter.format(selected.reduce(addLineTotal, 0));
	summary.textContent = `Đã chọn ${selected.length}/${items.length} món`;
	checkoutButton.disabled = selected.length === 0;
	cart.toggleAttribute('data-empty', items.length === 0);
	status.textContent = '';
}

function changeQuantity(item, step) {
	const next = clamp(Number(item.dataset.qty) + step, MIN_QTY, MAX_QTY);
	item.dataset.qty = String(next);
	renderItem(item);
	renderCart();
}

function removeItem(item) {
	item.remove();
	renderCart();
	heading.focus();
}

function handleListClick(event) {
	const item = event.target.closest('[data-item]');
	if (!item) {
		return;
	}
	const decrease = item.querySelector('[data-decrease]');
	const increase = item.querySelector('[data-increase]');
	if (event.target.closest('[data-remove]')) {
		removeItem(item);
	} else if (event.target.closest('[data-increase]')) {
		changeQuantity(item, 1);
		if (increase.disabled) {
			decrease.focus();
		}
	} else if (event.target.closest('[data-decrease]')) {
		changeQuantity(item, -1);
		if (decrease.disabled) {
			increase.focus();
		}
	}
}

function handleListChange(event) {
	if (event.target.matches('[data-check]')) {
		renderCart();
	}
}

function checkout() {
	const count = list.querySelectorAll('[data-check]:checked').length;
	status.textContent = `Đã đặt ${count} món, tổng ${total.textContent}.`;
}

list.addEventListener('click', handleListClick);
list.addEventListener('change', handleListChange);
checkoutButton.addEventListener('click', checkout);

list.querySelectorAll('[data-item]').forEach(renderItem);
renderCart();
```

</details>

### Giải thích từng hàm

- `new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`: tạo bộ định dạng số theo ngôn ngữ Việt Nam. `style: 'currency'` biến số thành tiền, `currency: 'VND'` chọn đồng; kết quả có dấu chấm ngăn nghìn và ký hiệu `₫`. Tạo một lần ở đầu file rồi dùng lại.
- `formatter.format(số)`: nhận số, trả chuỗi đã định dạng, ví dụ `format(99000)` ra `99.000 ₫`.
- `document.querySelector(selector)`: trả phần tử đầu tiên khớp selector hoặc `null`. Bài chỉ dùng selector `data-*`.
- `element.querySelectorAll(selector)`: trả `NodeList` mọi phần tử con khớp. Selector `[data-check]:checked` chỉ lấy ô đang được tích.
- `clamp(value, min, max)`: hàm tự đặt, ép `value` nằm trong khoảng `min`..`max`. `Math.max(value, min)` lấy số lớn hơn (không thấp hơn `min`), rồi `Math.min(..., max)` lấy số nhỏ hơn (không cao hơn `max`).
- `getLineTotal(item)`: hàm tự đặt, trả đơn giá nhân số lượng của một món. `Number(chuỗi)` đổi chuỗi sang số; `item.dataset.price` đọc thuộc tính `data-price`, luôn là chuỗi.
- `item.dataset.qty = String(next)`: `dataset` là đối tượng ánh xạ các thuộc tính `data-*`; gán vào là ghi thuộc tính `data-qty`. Giá trị luôn thành chuỗi, `String(...)` làm điều đó rõ ràng.
- `isSelected(item)`: hàm tự đặt, trả `true` nếu ô tích của món đang được tích. `.checked` là thuộc tính đúng/sai của ô tích.
- `addLineTotal(sum, item)`: hàm tự đặt dùng cho `reduce`; nhận tổng đang cộng dồn và một món, trả tổng mới.
- `renderItem(item)`: hàm tự đặt, vẽ số lượng, thành tiền và trạng thái `disabled` của hai nút cho một món. `button.disabled = true/false` bật hoặc tắt thuộc tính `disabled`; nút bị khoá không nhận click và mất focus.
- `` `Đã chọn ${selected.length}/${items.length} món` ``: chuỗi mẫu (template literal) dùng dấu huyền; `${...}` chèn giá trị biểu thức vào chuỗi.
- `Array.from(nodeList)`: đổi `NodeList` thành mảng thật để dùng `filter` và `reduce`.
- `array.filter(hàm)`: trả mảng mới chỉ gồm phần tử mà hàm trả `true`. Truyền tên hàm `isSelected` không có `()`: nếu có `()` thì gọi ngay thay vì đưa hàm cho `filter` gọi.
- `array.reduce(hàm, 0)`: gộp mảng thành một giá trị. Hàm nhận (tổng đang có, phần tử) và trả tổng mới. Tham số thứ hai `0` là giá trị khởi đầu; bỏ nó thì phần tử đầu tiên bị dùng làm khởi đầu, và mảng rỗng sẽ báo lỗi.
- `renderCart()`: hàm tự đặt, vẽ tổng, dòng tóm tắt, trạng thái nút Đặt hàng và `data-empty`; cũng xoá `status` cũ.
- `cart.toggleAttribute('data-empty', items.length === 0)`: nếu tham số thứ hai là `true` thì luôn thêm thuộc tính, `false` thì luôn gỡ. Khác `toggleAttribute(name)` chỉ đảo trạng thái.
- `===`: so sánh bằng nghiêm ngặt cả giá trị lẫn kiểu, trả `true` hoặc `false`.
- `changeQuantity(item, step)`: hàm tự đặt, cộng `step` (`1` hoặc `-1`) vào số lượng, ép trong khoảng cho phép, ghi lại và vẽ lại.
- `removeItem(item)`: hàm tự đặt. `item.remove()` gỡ phần tử khỏi trang. `heading.focus()` chuyển focus vào tiêu đề; tiêu đề có `tabindex="-1"` nên nhận focus bằng JS nhưng không nằm trong thứ tự Tab.
- `handleListClick(event)`: hàm tự đặt, nhận sự kiện click đã nổi bọt lên danh sách. `event.target` là phần tử thực sự bị bấm. `closest(selector)` đi từ phần tử đó lên các cha và trả phần tử đầu tiên khớp, hoặc `null`. Vì thế bấm vào chữ `×` bên trong nút vẫn tìm ra nút. `if (!item) return;` là return sớm: không bấm trong món nào thì dừng. `!` đảo giá trị đúng/sai.
- `else if`: chỉ kiểm tra nhánh sau khi nhánh trước sai, nên mỗi lần bấm chỉ làm một việc.
- `decrease.focus()` / `increase.focus()`: chuyển focus sang nút còn dùng được khi nút vừa bấm bị khoá.
- `handleListChange(event)`: hàm tự đặt. Sự kiện `change` của ô tích nổi bọt lên danh sách. `event.target.matches(selector)` trả `true` nếu chính phần tử đó khớp selector; khác `closest` ở chỗ không đi lên các cha.
- `checkout()`: hàm tự đặt, đếm ô đang tích bằng `.length` rồi ghi lời xác nhận vào `status`.
- `element.addEventListener('click', hàm)`: đăng ký hàm chạy mỗi khi có sự kiện; truyền tên hàm không có `()`.
- `list.querySelectorAll('[data-item]').forEach(renderItem)`: `forEach` gọi hàm cho từng phần tử. Nó còn truyền thêm chỉ số và mảng làm tham số 2 và 3; `renderItem` chỉ khai báo một tham số nên bỏ qua hai giá trị đó.
- `textContent`: đọc/ghi chữ thuần của phần tử; ghi vào không bao giờ bị hiểu thành HTML.
- Selector thuộc tính `[data-check]:checked`: `[data-check]` khớp phần tử có thuộc tính đó; `:checked` chỉ giữ ô được tích.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

- `divide-y divide-orange-200` trên `ul` ↔ `.list > .item:not(:last-child) { border-bottom: 1px solid #fed7aa }`.
- `grid-cols-[auto_minmax(0,1fr)]` trên `li` ↔ `.item { grid-template-columns: auto minmax(0, 1fr) }`.
- `line-clamp-2 wrap-anywhere` ↔ `.name { display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere }`.
- `accent-orange-600` ↔ `.check { accent-color: #ea580c }`.
- `sticky bottom-0` ↔ `.bar { position: sticky; bottom: 0 }`.
- `disabled:opacity-40 disabled:cursor-not-allowed` ↔ `.step-button:disabled, .checkout:disabled { opacity: 0.4; cursor: not-allowed }`.
- `group-data-empty:hidden` / `group-data-empty:block` ↔ `.cart[data-empty] .list, .cart[data-empty] .bar { display: none }` và `.cart[data-empty] .empty { display: block }`.
- `motion-reduce:transition-none` ↔ `@media (prefers-reduced-motion: reduce) { ... transition: none }`.
