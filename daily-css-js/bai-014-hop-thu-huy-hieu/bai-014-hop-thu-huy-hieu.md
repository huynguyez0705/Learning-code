# Bài 014: Hộp thư với huy hiệu chưa đọc và vạch báo `before:`

Ngày học 6, bài 1/3, cấp 1, chủ đề CSS: Định vị và quản lý layer (ứng dụng hộp thư), độ khó ★★★, thời gian ước tính 35 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Tải lại trang thì năm thư trở về trạng thái mẫu (3 thư chưa đọc). Đây là hành vi đúng của bài.

## Mục tiêu

- Huy hiệu số thư chưa đọc màu đỏ nằm **chồng lên góc trên phải** nút chuông (`absolute` với offset âm); số này luôn đúng sau mỗi thao tác, ẩn đi khi bằng 0, và hiện `9+` nếu quá 9.
- Thư chưa đọc có **vạch xanh ở mép trái** vẽ bằng phần tử ảo `before:` và chữ người gửi đậm; bấm vào một thư thì đảo trạng thái đọc/chưa đọc.
- Hai nút lọc "Tất cả" / "Chưa đọc" đổi danh sách bằng thuộc tính `hidden`; nút "Đọc hết" bị khoá khi không còn thư chưa đọc.
- Dùng đúng `filter`, `hasAttribute` và `toggleAttribute(tên, force)` (tham số thứ hai).

## Kết quả mong đợi

Đầu trang là thanh xanh có chữ "Hộp thư" và nút chuông tròn, một chấm đỏ ghi số 3 đè lên góc chuông. Dưới là hai nút lọc và liên kết "Đọc hết", rồi danh sách năm thư trong khung bo góc. Ba thư chưa đọc có vạch xanh dọc ở mép trái và tên người gửi đậm. Bấm một thư: vạch biến mất, huy hiệu giảm một. Bấm "Chưa đọc": chỉ còn các thư chưa đọc.

## Tư duy

**Định vị chồng lớp.** Khi một phần tử cần "đè" lên góc của phần tử khác, bạn cần hai thứ: cha có `relative` (làm mốc), con có `absolute` cùng độ lệch. Độ lệch **âm** (`-top-1.5`, `-right-1.5`) kéo huy hiệu **ra ngoài** mép cha, như tem dán chồng ra khỏi góc phong bì. `min-w-5` cho huy hiệu rộng tối thiểu 20px nên số một chữ số vẫn tròn; số `9+` hai ký tự thì tự nở rộng ra.

**Phần tử ảo `before:` cũng định vị được.** Vạch xanh mép trái không cần thẻ HTML riêng. Biến thể `before:` tạo phần tử ảo `::before` ngay trước nội dung của `<li>`. Nó chỉ tồn tại khi có thuộc tính `content`, vì thế cần `before:content-['']` (chuỗi rỗng). Có `before:absolute before:inset-y-0 before:left-0 before:w-1` là vạch cao bằng cả `<li>` (cha `relative`) và rộng 4px. Mặc định `before:hidden`, và `data-unread:before:block` chỉ mở ra khi `<li>` có `data-unread`: **một thuộc tính do JS ghi quyết định cả vạch lẫn chữ đậm**.

**Trạng thái nằm ở DOM.** Không có mảng riêng giữ danh sách thư. Hàm `render()` đọc thẳng các `<li data-mail>` trong trang, đếm những thẻ có `data-unread`, rồi ghi lại huy hiệu, nút lọc, nút "Đọc hết". Mỗi lần có thay đổi chỉ cần gọi `render()`: một công thức duy nhất tính ra giao diện từ dữ liệu.

**Hai kiểu của `toggleAttribute`.** `toggleAttribute('data-unread')` đảo: có thì gỡ, chưa có thì thêm. Thêm tham số thứ hai `force`: `toggleAttribute('data-unread', false)` luôn **gỡ**, `true` luôn **thêm**, bất kể trước đó ra sao. "Đọc hết" cần `false`: nếu dùng kiểu đảo thì thư đã đọc sẽ bị đổi ngược thành chưa đọc.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Huy hiệu chồng góc chuông (`absolute -top-1.5 -right-1.5 min-w-5`) | Ghi số vào huy hiệu, ẩn khi bằng 0 |
| Vạch xanh mép trái (`before:...`, `data-unread:before:block`) và chữ đậm (`group-data-unread:`) | Bật/tắt thuộc tính `data-unread` trên `<li>` |
| Nút lọc đang chọn (`aria-pressed:`), nút "Đọc hết" xám (`disabled:`) | Ghi `aria-pressed` và `disabled` |

JS không thêm hoặc gỡ class, không đặt `style`, không tìm phần tử bằng class. JS chỉ tìm bằng thuộc tính `data-*`.

## Ôn lại

- Bài 001, 002, 003 (thư mục `bai-001-the-phu-dinh-vi`, `bai-002-menu-ba-cham`, `bai-003-hop-thoai-xac-nhan`): `relative`/`absolute`, `group-data-*:`.
- Bài 007 (`bai-007-the-thoi-tiet`): `aria-pressed` và `setAttribute`.
- Bài 002 và 005: `toggleAttribute`, uỷ quyền sự kiện với `closest`.
- Bài 006 (`bai-006-gio-hang`): `disabled:`.

## Gợi ý từng bước

> Starter đã điền sẵn: màu nền, thanh đầu trang, nút chuông (`relative`, viền focus), nút lọc với `aria-pressed:`, nút "Đọc hết" với `disabled:`, khung danh sách, mỗi `<li>` có `group relative border-b ...` và chữ người gửi đậm theo `group-data-unread:`. Huy hiệu mới chỉ có `absolute`, màu và cỡ chữ, **chưa có vị trí và độ rộng tối thiểu**. **Ba thẻ `<li>` đầu** đã có đủ nhóm class `before:`; **hai thẻ `<li>` cuối** chưa có: bạn chép theo ba thẻ đầu ở bước 3.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-bell`, `data-badge`, `data-tabs` với hai nút `data-filter="all"` và `data-filter="unread"`, `data-read-all`, `data-list`, năm `<li data-mail>` (ba cái có `data-unread`), mỗi `<li>` có một `<button data-open>`, `data-empty` (đang `hidden`). Kiểm tra: mở trang, huy hiệu nằm lệch ở **cạnh chuông** thay vì đè lên góc (vì chưa có offset); thư chưa đọc đã có chữ người gửi đậm, ba thư đầu đã có vạch xanh.

2. **CSS: huy hiệu chồng góc chuông.** **Bạn làm:** trên `<span data-badge>` thêm `-top-1.5 -right-1.5 min-w-5`. `-top-1.5` là `top: -6px`, `-right-1.5` là `right: -6px`: số âm đẩy huy hiệu ra ngoài mép trên và mép phải của chuông. Kiểm tra: huy hiệu đè lên góc trên phải chuông; trong DevTools đổi `-top-1.5` thành `top-1.5` thì huy hiệu chui vào trong. Gỡ `relative` khỏi nút chuông thì huy hiệu bay đi chỗ khác (mốc định vị sai).

3. **CSS: vạch báo thư chưa đọc.** **Bạn làm:** trên **2 thẻ `<li>` cuối** thêm `before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-sky-500 before:content-[''] before:hidden data-unread:before:block`. Chép đúng theo ba thẻ đầu. `before:` là biến thể sinh phần tử ảo `::before`; `content-['']` là bắt buộc để nó tồn tại; `inset-y-0` là `top: 0; bottom: 0`. Kiểm tra: thư thứ tư (chưa đọc) có vạch xanh dọc mép trái, thư thứ năm (đã đọc) không; trong DevTools thêm tay `data-unread` vào thư thứ năm thì vạch hiện ra. Thử bỏ `before:content-['']` thì vạch biến mất.

4. **JS: lấy phần tử và viết hai hàm nhỏ.** **Bạn làm:** toàn bộ JS. Lấy phần tử bằng `document.querySelector('[data-list]')` và các phần tử khác (`data-tabs`, `data-bell`, `data-badge`, `data-empty`, `data-read-all`); `filterButtons` là `Array.from(tabs.querySelectorAll('[data-filter]'))`. Khai báo `const maxBadge = 9` và `let filter = 'all'`. Viết `getMails()` trả `Array.from(list.querySelectorAll('[data-mail]'))` (`Array.from` đổi `NodeList` thành mảng thật để dùng `filter`). Viết `isUnread(mail)` trả `mail.hasAttribute('data-unread')`; `hasAttribute(tên)` trả `true` nếu phần tử có thuộc tính đó, `false` nếu không. Kiểm tra: trong DevTools gõ `getMails().filter(isUnread).length` ra 3.

5. **JS: `render()`.** **Bạn làm:** toàn bộ JS. Viết `render()` theo khung:

   ```js
   function render() {
   	const mails = getMails();
   	const count = mails.filter(/* hàm kiểm tra */).length;
   	badge.textContent = /* count > maxBadge ? ... : ... */;
   	badge.hidden = /* count bằng 0 */;
   	/* khoá nút "Đọc hết" khi count bằng 0 */
   }
   ```

   `filter(hàm)` trả **mảng mới** chỉ gồm phần tử mà hàm trả `true`; ở đây truyền thẳng tên hàm `isUnread` (không có `()`, vì ta đưa hàm đi chứ không gọi nó). Số lớn hơn `maxBadge` thì viết `9+` bằng chuỗi mẫu. Cuối file gọi `render()`. Kiểm tra: mở trang, huy hiệu ghi 3; trong DevTools gỡ `data-unread` của một thư rồi gọi `render()` thì huy hiệu ghi 2, gỡ hết thì huy hiệu biến mất và "Đọc hết" xám.

6. **JS: bấm thư để đảo trạng thái.** **Bạn làm:** toàn bộ JS. Gắn **một** `click` ở `list`. `event.target.closest('[data-open]')`; nếu `null` thì `return`. Rồi `open.closest('[data-mail]').toggleAttribute('data-unread')` và `render()`. Kiểm tra: bấm một thư chưa đọc thì vạch mất, chữ hết đậm, huy hiệu giảm; bấm lại thì ngược lại.

7. **JS: lọc, đọc hết, bấm chuông.** **Bạn làm:** toàn bộ JS. Trong `render()` thêm: `mails.forEach(function (mail) { mail.hidden = ...; })` với điều kiện: đang lọc `'unread'` **và** thư không chưa đọc; `empty.hidden` chỉ `false` khi đang lọc `'unread'` mà `count` bằng 0; và `forEach` trên `filterButtons` để `setAttribute('aria-pressed', String(button.dataset.filter === filter))`. Gắn `click` ở `tabs` (uỷ quyền giống bước 6) để gán `filter = button.dataset.filter` rồi `render()`. Nút "Đọc hết": `getMails().forEach(function (mail) { mail.toggleAttribute('data-unread', false); })`; tham số thứ hai `false` là `force`. Bấm chuông thì `filter = 'unread'`. Kiểm tra: lọc "Chưa đọc" rồi bấm một thư thì thư đó biến mất khỏi danh sách; bấm "Đọc hết" ở chế độ lọc thì hiện "Không còn thư chưa đọc."; thử bỏ `false` đi và thấy lỗi: thư đã đọc bị đổi ngược thành chưa đọc.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `absolute -top-1.5 -right-1.5` | `position: absolute; top: -6px; right: -6px` |
| `min-w-5` | `min-width: 20px` |
| `before:content-['']` | `.mail::before { content: "" }` |
| `before:absolute before:inset-y-0 before:left-0 before:w-1` | `.mail::before { position: absolute; top: 0; bottom: 0; left: 0; width: 4px }` |
| `before:hidden data-unread:before:block` | `.mail::before { display: none }` và `.mail[data-unread]::before { display: block }` |
| `group-data-unread:font-bold` | `.mail[data-unread] .mail-sender { font-weight: 700 }` |
| `aria-pressed:bg-sky-700` | `.tab[aria-pressed="true"] { background: #0369a1 }` |

## Tự kiểm tra

- [ ] Huy hiệu đè đúng góc trên phải chuông; số đúng sau mỗi lần bấm; bằng 0 thì ẩn.
- [ ] Thư chưa đọc có vạch xanh và chữ đậm; bấm vào đảo trạng thái; "Đọc hết" làm tất cả thành đã đọc (không có thư nào bị đảo ngược).
- [ ] DevTools: gỡ `relative` khỏi nút chuông thì huy hiệu bay đi chỗ khác. Gỡ `before:content-['']` thì vạch mất. Thêm tay `data-unread` vào một `<li>` thì vạch và chữ đậm xuất hiện.
- [ ] Bàn phím: Tab qua chuông, hai nút lọc, "Đọc hết", từng thư; Enter hoặc Space trên thư đảo trạng thái; thấy viền focus rõ ở từng nút.
- [ ] Bật `prefers-reduced-motion: reduce`: bài này không có chuyển động nên không có gì đổi (đúng).
- [ ] Tự hỏi: vì sao huy hiệu cần cha `relative`? Vì sao truyền `isUnread` mà không viết `isUnread()` vào `filter`? Khi lọc "Chưa đọc" và bấm một thư, vì sao thư biến mất ngay?

## Thử thách thêm

1. Tiêu đề trang thêm số thư chưa đọc: `document.title = ...` trong `render()`. Không cần class mới.
2. Thêm nút "Ghim" ở góc dưới phải mỗi thư bằng `absolute bottom-2 right-3`; thư ghim có `data-pinned` và nổi lên đầu danh sách bằng `prepend`. Gợi ý class: `data-pinned:before:bg-amber-500`.

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
		<title>Bài 014 - Hộp thư huy hiệu</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<header class="top">
			<div class="top-inner">
				<h1 class="top-title">Hộp thư</h1>
				<button type="button" data-bell class="bell" aria-label="Chuông: 3 thư chưa đọc">
					🔔
					<span data-badge class="badge">3</span>
				</button>
			</div>
		</header>
		<main class="page">
			<div class="toolbar">
				<div data-tabs class="tabs" role="group" aria-label="Lọc thư">
					<button type="button" data-filter="all" aria-pressed="true" class="tab">Tất cả</button>
					<button type="button" data-filter="unread" aria-pressed="false" class="tab">Chưa đọc</button>
				</div>
				<button type="button" data-read-all class="read-all">Đọc hết</button>
			</div>
			<ul data-list class="mail-list">
				<li data-mail data-unread class="mail">
					<button type="button" data-open class="mail-open">
						<span class="mail-sender">Lan Anh</span>
						<span class="mail-subject">Họp nhóm chiều thứ Sáu</span>
					</button>
				</li>
				<li data-mail data-unread class="mail">
					<button type="button" data-open class="mail-open">
						<span class="mail-sender">Minh Khoa</span>
						<span class="mail-subject">Hoá đơn tháng 11</span>
					</button>
				</li>
				<li data-mail class="mail">
					<button type="button" data-open class="mail-open">
						<span class="mail-sender">Thư viện</span>
						<span class="mail-subject">Sách bạn mượn sắp đến hạn</span>
					</button>
				</li>
				<li data-mail data-unread class="mail">
					<button type="button" data-open class="mail-open">
						<span class="mail-sender">Hà My</span>
						<span class="mail-subject">Ảnh chuyến đi Đà Lạt</span>
					</button>
				</li>
				<li data-mail class="mail">
					<button type="button" data-open class="mail-open">
						<span class="mail-sender">Ban tổ chức</span>
						<span class="mail-subject">Xác nhận đăng ký workshop</span>
					</button>
				</li>
			</ul>
			<p data-empty hidden class="empty">Không còn thư chưa đọc.</p>
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
	font-weight: 700;
}

.site {
	background: #f8fafc;
	color: #0f172a;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.top {
	background: #0369a1;
	color: #ffffff;
}

.top-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 576px;
	margin: 0 auto;
	padding: 16px 24px;
}

.bell {
	position: relative;
	width: 40px;
	height: 40px;
	border-radius: 9999px;
	background: #0284c7;
	font-size: 18px;
}

.bell:focus-visible,
.tab:focus-visible,
.read-all:focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}

.badge {
	position: absolute;
	top: -6px;
	right: -6px;
	min-width: 20px;
	padding: 0 4px;
	border-radius: 9999px;
	background: #f43f5e;
	color: #ffffff;
	font-size: 12px;
	font-weight: 700;
	line-height: 20px;
	text-align: center;
}

.page {
	max-width: 576px;
	margin: 0 auto;
	padding: 24px;
}

.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
}

.tabs {
	display: flex;
	gap: 8px;
}

.tab {
	padding: 6px 12px;
	border: 1px solid #cbd5e1;
	border-radius: 9999px;
	font-size: 14px;
}

.tab[aria-pressed="true"] {
	border-color: #0369a1;
	background: #0369a1;
	color: #ffffff;
}

.tab:focus-visible,
.read-all:focus-visible,
.mail-open:focus-visible {
	outline-color: #0369a1;
}

.read-all {
	font-size: 14px;
	color: #0369a1;
	text-decoration: underline;
}

.read-all:disabled {
	color: #94a3b8;
	cursor: not-allowed;
	text-decoration: none;
}

.mail-list {
	overflow: hidden;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
}

.mail {
	position: relative;
	border-bottom: 1px solid #e2e8f0;
	background: #ffffff;
}

.mail:last-child {
	border-bottom: 0;
}

.mail::before {
	content: "";
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: 4px;
	background: #0ea5e9;
	display: none;
}

.mail[data-unread]::before {
	display: block;
}

.mail-open {
	display: block;
	width: 100%;
	padding: 12px 20px;
	text-align: left;
}

.mail-open:focus-visible {
	outline: 2px solid #0369a1;
	outline-offset: -2px;
}

.mail-sender {
	display: block;
	font-size: 14px;
	color: #475569;
}

.mail[data-unread] .mail-sender {
	font-weight: 700;
	color: #0f172a;
}

.mail-subject {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.empty {
	margin-top: 16px;
	text-align: center;
	color: #64748b;
}
```

`solution/script.js`

```js
const list = document.querySelector('[data-list]');
const tabs = document.querySelector('[data-tabs]');
const bell = document.querySelector('[data-bell]');
const badge = document.querySelector('[data-badge]');
const empty = document.querySelector('[data-empty]');
const readAllButton = document.querySelector('[data-read-all]');
const filterButtons = Array.from(tabs.querySelectorAll('[data-filter]'));
const maxBadge = 9;
let filter = 'all';

function getMails() {
	return Array.from(list.querySelectorAll('[data-mail]'));
}

function isUnread(mail) {
	return mail.hasAttribute('data-unread');
}

function render() {
	const mails = getMails();
	const count = mails.filter(isUnread).length;
	badge.textContent = count > maxBadge ? `${maxBadge}+` : String(count);
	badge.hidden = count === 0;
	bell.setAttribute('aria-label', `Chuông: ${count} thư chưa đọc`);
	readAllButton.disabled = count === 0;
	mails.forEach(function (mail) {
		mail.hidden = filter === 'unread' && !isUnread(mail);
	});
	empty.hidden = !(filter === 'unread' && count === 0);
	filterButtons.forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
	});
}

list.addEventListener('click', function (event) {
	const open = event.target.closest('[data-open]');
	if (!open) {
		return;
	}
	open.closest('[data-mail]').toggleAttribute('data-unread');
	render();
});

tabs.addEventListener('click', function (event) {
	const button = event.target.closest('[data-filter]');
	if (!button) {
		return;
	}
	filter = button.dataset.filter;
	render();
});

readAllButton.addEventListener('click', function () {
	getMails().forEach(function (mail) {
		mail.toggleAttribute('data-unread', false);
	});
	render();
});

bell.addEventListener('click', function () {
	filter = 'unread';
	render();
});

render();
```

</details>

### Giải thích từng hàm

- `getMails()`: hàm tự đặt, không nhận gì, trả mảng các `<li data-mail>` hiện có trong trang.
- `isUnread(mail)`: hàm tự đặt, nhận một `<li>`, trả `true` nếu có `data-unread`.
- `render()`: hàm tự đặt, không nhận và không trả gì; đọc DOM rồi ghi lại huy hiệu, nhãn chuông, nút "Đọc hết", thuộc tính `hidden` của từng thư, thông báo rỗng và `aria-pressed` của nút lọc.
- `document.querySelector(selector)`: trả phần tử **đầu tiên** khớp selector, hoặc `null`. Selector `[data-list]` khớp theo thuộc tính.
- `querySelectorAll(selector)`: trả `NodeList` mọi phần tử khớp; chỉ có `forEach`, không có `filter`.
- `Array.from(nodeList)`: tạo mảng thật từ `NodeList` để dùng `filter`, `forEach`.
- `mails.filter(isUnread)`: `Array.prototype.filter(hàm)` trả mảng mới chỉ gồm phần tử mà hàm trả `true`; không sửa mảng gốc. `isUnread` truyền không có `()`: đưa hàm đi để `filter` tự gọi cho từng phần tử.
- `.length`: số phần tử của mảng.
- `mail.hasAttribute(tên)`: trả `true` hoặc `false` tuỳ phần tử có thuộc tính đó, không quan tâm giá trị.
- `toggleAttribute(tên)`: có thuộc tính thì gỡ, chưa có thì thêm. `toggleAttribute(tên, force)`: tham số thứ hai `force` là `true` thì **luôn thêm**, `false` thì **luôn gỡ**; trong bài `toggleAttribute('data-unread', false)` làm "Đọc hết".
- `element.textContent = ...`: ghi chữ thuần cho phần tử.
- `element.hidden = true/false`: thuộc tính HTML `hidden`, ẩn hoặc hiện phần tử. `button.disabled = true` làm nút không bấm được.
- `bell.setAttribute(tên, giá trị)`: ghi thuộc tính, ở đây là `aria-label` và `aria-pressed`.
- `String(giá trị)`: đổi sang chuỗi; `aria-pressed` cần chuỗi `"true"`/`"false"`.
- Chuỗi mẫu `` `${maxBadge}+` ``: dấu huyền, `${...}` chèn giá trị biến vào chuỗi.
- `count > maxBadge ? a : b`: toán tử ba ngôi; điều kiện đúng ra `a`, sai ra `b`.
- `!isUnread(mail)`: `!` đảo đúng thành sai. `&&`: cả hai vế đúng mới đúng. `===`: so sánh bằng, không ép kiểu.
- `!(filter === 'unread' && count === 0)`: đảo cả biểu thức trong ngoặc; `empty.hidden` là `false` (hiện) đúng lúc biểu thức bên trong đúng.
- `addEventListener('click', hàm)`: gắn hàm chạy mỗi lần bấm. `event.target` là phần tử thật bị bấm.
- `event.target.closest(selector)`: đi **ngược lên** từ phần tử bị bấm, trả tổ tiên đầu tiên khớp (gồm chính nó) hoặc `null`.
- `if (!open) { return; }`: return sớm; bấm ra ngoài nút thì dừng hàm.
- `button.dataset.filter`: đọc thuộc tính `data-filter` (luôn là chuỗi).
- `forEach(function (x) { ... })`: chạy hàm cho từng phần tử mảng, không trả gì.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `relative` trên nút chuông | `.bell { position: relative }` |
| `absolute -top-1.5 -right-1.5 min-w-5` | `.badge { position: absolute; top: -6px; right: -6px; min-width: 20px }` |
| `before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-sky-500 before:content-['']` | `.mail::before { content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 4px; background: #0ea5e9 }` |
| `before:hidden data-unread:before:block` | `.mail::before { display: none }` rồi `.mail[data-unread]::before { display: block }` |
| `group-data-unread:font-bold group-data-unread:text-slate-900` | `.mail[data-unread] .mail-sender { font-weight: 700; color: #0f172a }` |
| `aria-pressed:border-sky-700 aria-pressed:bg-sky-700 aria-pressed:text-white` | `.tab[aria-pressed="true"] { ... }` |
| `disabled:text-slate-400 disabled:no-underline` | `.read-all:disabled { color: #94a3b8; text-decoration: none }` |

Khác biệt nhỏ: Tailwind phải tự viết `before:content-['']`; trong CSS thuần là một dòng `content: ""` nằm cùng rule `::before`.
