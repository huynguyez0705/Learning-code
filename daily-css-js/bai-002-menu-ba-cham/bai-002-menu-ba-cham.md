# Bài 002: Menu ba chấm và bẫy stacking context

Tuần 1, ngày 2/7, vòng 1, độ khó ★★☆☆☆, thời gian ước tính 40 phút.

> Từ bài này dùng **Tailwind CSS v4** thay cho CSS thuần. `starter/index.html` đã gắn sẵn dòng `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`: mở file là Tailwind chạy, không cần cài gì, chỉ cần có mạng. Không còn `style.css` và `:root`; màu, khoảng cách, bo góc đều lấy từ class có sẵn của Tailwind. Tra class tại tailwindcss.com/docs.

## Mục tiêu

- Ba thẻ dự án xếp dọc, mỗi thẻ có nút `⋯` nằm góc trên phải, cách mép 12px (`top-3 right-3`).
- Bấm `⋯` thì menu 3 mục (Đổi tên, Nhân bản, Xoá) hiện ngay dưới nút và **đè lên thẻ phía dưới**, không bị thẻ dưới che.
- Thẻ nhấc lên 2px khi rê chuột hoặc khi có focus bên trong. Hiệu ứng này sẽ làm menu bị che dù menu có `z-50`; bạn phải tìm ra vì sao và sửa.
- Chỉ một menu mở cùng lúc. Click ra ngoài hoặc bấm Escape thì đóng.
- Mở menu: focus nhảy vào mục "Đổi tên". Đóng bằng Escape: focus về lại nút `⋯` của thẻ đó.

## Kết quả mong đợi

Giữa màn hình là tiêu đề "Dự án của tôi" và ba thẻ trắng bo góc, đổ bóng nhẹ, xếp cách nhau 12px. Rê chuột vào thẻ nào thì thẻ đó nhích lên một chút. Bấm `⋯` ở thẻ đầu, một menu trắng nhỏ hiện ra mờ dần và trượt lên 4px, phủ lên phần trên của thẻ thứ hai. Mục "Xoá" màu đỏ. Bấm `⋯` của thẻ khác thì menu cũ đóng, menu mới mở.

## Tư duy

**Bẫy stacking context.** Ở bài 001, lớp phủ `z-index: 2` đè được huy hiệu `z-index: 1` vì cả hai cùng nằm trong một "tầng". Bài này có ba thẻ anh em. Menu nằm trong thẻ 1 nhưng phải đè lên thẻ 2.

Nếu thẻ 1 chỉ có `relative` thì `z-50` của menu so trực tiếp với thẻ 2, menu thắng. Nhưng khi thẻ được nhấc lên bằng `-translate-y-0.5`, trình duyệt áp thuộc tính `translate` cho thẻ. Mọi phần tử có `transform`, `translate`, `scale`, `rotate`, `opacity` nhỏ hơn 1, `filter` hay `isolation: isolate` đều **tạo stacking context mới**: thẻ biến thành một "hộp kín". `z-50` của menu từ giờ chỉ có nghĩa **bên trong hộp đó**. Ra bên ngoài, cả hộp thẻ 1 (z-index tự động, coi như 0) so với thẻ 2 (cũng 0), và thẻ 2 đứng sau trong HTML nên được vẽ sau, đè lên menu.

Giống như xếp giấy: menu là tờ giấy nằm trên cùng trong **xấp giấy của thẻ 1**, nhưng cả xấp thẻ 1 lại nằm dưới xấp thẻ 2. Tăng `z-50` lên `z-[9999]` cũng vô ích. Cách sửa đúng là **nâng cả xấp thẻ 1**: khi thẻ đang mở menu, cho chính thẻ đó `z-10`.

**Không dùng `overflow-hidden` cho thẻ.** Bài 001 cần `overflow: hidden` để giấu lớp phủ nằm ngoài thẻ. Bài này menu cố tình tràn ra ngoài thẻ, nên `overflow-hidden` sẽ cắt mất menu.

**Trạng thái nằm ở thuộc tính `data-open`.** JS chỉ bật/tắt thuộc tính `data-open` trên thẻ. Tailwind đọc thuộc tính đó qua hai variant:
- `data-open:z-10` đặt trên chính thẻ: "khi thẻ có `data-open` thì `z-index: 10`".
- `group-data-open:visible` đặt trên menu: "khi **tổ tiên có class `group`** đang có `data-open` thì hiện". Muốn dùng `group-*` thì thẻ cha phải có class `group`.

**Vì sao `transition-[opacity,translate]` mà không phải `transition`.** Menu ẩn bằng `invisible` (`visibility: hidden`) để không Tab vào được. Chỉ liệt kê `opacity` và `translate` nghĩa là `visibility` **đổi ngay lập tức**, không chuyển động. Nhờ vậy lúc mở, menu `visible` ngay và `focus()` vào được mục đầu. Đây chính là lỗi focus ở bài 001: `visibility` có transition nên lúc gọi `focus()` phần tử vẫn còn `hidden`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Vị trí nút `⋯` và menu (`absolute`, `top-*`, `right-*`) | Bắt click trên nút `⋯`, click ra ngoài, phím Escape |
| Ẩn/hiện menu theo `data-open` (`group-data-open:*`) | Bật/tắt thuộc tính `data-open` trên thẻ |
| Nâng thẻ đang mở (`data-open:z-10`) | Đóng các menu khác trước khi mở menu mới |
| Hiệu ứng mờ và trượt, tắt khi `motion-reduce` | Cập nhật `aria-expanded`, chuyển focus |

JS KHÔNG nên: thêm/gỡ từng class Tailwind như `invisible`, `opacity-0` (đổi giao diện thì phải sửa cả JS), đặt `style.zIndex`, hay tính toạ độ menu. JS chỉ ghi **một** trạng thái là `data-open`.

## Ôn lại

- Bài 001 (`bai-001-the-phu-dinh-vi`): `relative` làm điểm neo cho `absolute`, `z-index` để xếp lớp, `visibility` để ẩn khỏi phím Tab, `aria-expanded`, `focus()`, phím Escape.
- `classList.toggle('show', isOpen)` ở bài 001 có tham số thứ hai `force`. Bài này gặp lại đúng ý đó ở `toggleAttribute('data-open', isOpen)`.
- Lỗi focus do `visibility` có transition ở bài 001 được xử lý ở đây bằng `transition-[opacity,translate]`.

## Gợi ý từng bước

1. **Bố cục trang.** Cho `body`: `grid min-h-screen place-items-center bg-stone-100 p-6 font-sans text-stone-800`. Cho `main`: `w-80`. Cho `h1`: `mb-4 text-lg font-semibold`. Cho `ul`: `space-y-3` (cách đều các `li` 12px). Kiểm tra: ba thẻ nằm giữa màn hình, cách nhau đều.
2. **Thẻ.** Cho mỗi `article`: `relative rounded-2xl bg-white p-4 shadow-md`. `h2`: `font-medium`. `p`: `text-sm text-stone-500`. Kiểm tra: ba khối trắng bo góc có bóng.
3. **Nút `⋯`.** `absolute top-3 right-3 grid size-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100`. `size-8` đặt cả rộng lẫn cao 32px. Thêm viền focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600`. Kiểm tra: nút tròn nằm góc trên phải mỗi thẻ, Tab tới thấy viền xanh.
4. **Menu, tạm để hiện.** `div[data-menu]`: `absolute top-12 right-3 z-50 w-40 rounded-xl bg-white py-1 shadow-xl ring-1 ring-stone-200`. Mỗi nút trong menu: `block w-full px-3 py-2 text-left text-sm hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none`; mục "Xoá" đổi thành `text-red-600 hover:bg-red-50`. Kiểm tra: menu thẻ 1 đè lên thẻ 2 (cả ba menu đang hiện cùng lúc, chưa sao).
5. **Nhấc thẻ và gặp bẫy.** Thêm cho `article`: `transition-transform duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5`. `focus-within` nghĩa là "khi có phần tử con đang được focus". Rê chuột vào thẻ 1: **menu bị thẻ 2 che**. Dừng lại, mở DevTools, xem tab Computed của thẻ 1 có `translate` gì, rồi đọc lại mục "Tư duy".
6. **Ẩn menu theo trạng thái.** Thêm `group` và `data-open:z-10` cho `article`. Thêm cho menu: `invisible translate-y-1 opacity-0 transition-[opacity,translate] duration-150 group-data-open:visible group-data-open:translate-y-0 group-data-open:opacity-100 motion-reduce:transition-none`. Thêm `motion-reduce:transition-none` cho cả `article`. Kiểm tra: trong DevTools (Elements), tự thêm thuộc tính `data-open` vào `article` đầu tiên, menu phải hiện và đè được thẻ 2 kể cả khi đang rê chuột.
7. **JS: mở/đóng.** `document.querySelectorAll('[data-card]')` lấy **tất cả** thẻ, trả về danh sách (NodeList). Duyệt bằng `.forEach(function (card) { ... })` để gắn sự kiện click cho nút `⋯` của từng thẻ. Viết một hàm `setMenu(card, isOpen)` dùng `card.toggleAttribute('data-open', isOpen)`: giống `classList.toggle` hai tham số nhưng cho **thuộc tính**, `true` thì thêm, `false` thì gỡ. Trong hàm cũng cập nhật `aria-expanded` và focus mục đầu khi mở. `card.hasAttribute('data-open')` trả về `true`/`false` cho biết thẻ đang mở hay không. Kiểm tra: bấm `⋯` mở, bấm lại đóng.
8. **Chỉ một menu, click ngoài, Escape.** Trước khi mở menu mới, đóng mọi thẻ khác đang có `data-open`. Gắn `click` lên `document`: `event.target` là phần tử vừa bị click, `event.target.closest('[data-open]')` đi ngược lên các tổ tiên để tìm thẻ đang mở; không tìm thấy (`null`) nghĩa là click ra ngoài, đóng hết. Gắn `keydown` lên `document`, gặp `event.key === 'Escape'` thì đóng thẻ đang mở và `focus()` về nút `⋯` của nó.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `relative` / `absolute` | `position: relative` / `position: absolute` |
| `top-3 right-3` | `top: 12px; right: 12px` (1 đơn vị = 4px) |
| `z-10`, `z-50` | `z-index: 10`, `z-index: 50` |
| `size-8` | `width: 32px; height: 32px` |
| `space-y-3` | khoảng cách dọc 12px giữa các con |
| `ring-1 ring-stone-200` | viền 1px vẽ bằng `box-shadow`, không chiếm chỗ |
| `invisible` / `visible` | `visibility: hidden` / `visibility: visible` |
| `-translate-y-0.5` | `translate: 0 -2px` |
| `transition-[opacity,translate]` | `transition-property: opacity, translate` |
| `duration-150` | `transition-duration: 150ms` |
| `hover:`, `focus-visible:`, `focus-within:` | `:hover`, `:focus-visible`, `:focus-within` |
| `data-open:z-10` | `[data-open] { z-index: 10 }` |
| `group-data-open:visible` | `.group[data-open] .menu { visibility: visible }` |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Rê chuột vào thẻ 1 rồi mở menu: menu đè lên thẻ 2, mục "Xoá" bấm được.
- [ ] Trong DevTools, xoá class `data-open:z-10` khỏi thẻ 1 rồi mở menu: menu bị thẻ 2 che. Thêm lại: hết che.
- [ ] Đổi `z-50` của menu thành `z-[9999]` (khi đã bỏ `data-open:z-10`): vẫn bị che. Giải thích được vì sao.
- [ ] Mở menu thẻ 1 rồi mở menu thẻ 3: menu thẻ 1 tự đóng.
- [ ] Click vào khoảng trống ngoài thẻ: menu đóng.
- [ ] Dùng bàn phím: Tab tới `⋯`, Enter mở, focus vào "Đổi tên"; Escape đóng, focus về `⋯`.
- [ ] Khi menu đóng, bấm Tab không bao giờ đi vào "Đổi tên", "Nhân bản", "Xoá".
- [ ] Trong Elements, thuộc tính `data-open` và `aria-expanded` đổi đúng khi mở/đóng.
- [ ] Bật giả lập `prefers-reduced-motion: reduce`: thẻ không nhấc, menu không trượt.
- [ ] Tự hỏi: nếu bỏ `hover:-translate-y-0.5` và `focus-within:-translate-y-0.5` thì có cần `data-open:z-10` nữa không? Thử để kiểm chứng.
- [ ] Tự hỏi: vì sao đặt `z-10` lên **thẻ** mà không phải lên `li`? Nếu `li` cũng có `translate` thì sao?

## Thử thách thêm

1. Với thẻ cuối cùng, cho menu mở **lên trên** nút thay vì xuống dưới. Gợi ý: thêm một thuộc tính riêng cho thẻ cuối, ví dụ `data-up`, rồi trên menu dùng `group-data-up:top-auto group-data-up:bottom-12`.
2. Cho menu mờ dần cả lúc đóng mà vẫn giữ được focus lúc mở: `visibility` phải bật ngay khi mở nhưng tắt trễ 150ms khi đóng. Gợi ý: cần delay riêng cho `visibility`, dùng class tuỳ ý `[transition:opacity_150ms,translate_150ms,visibility_0s_150ms]` cho lúc đóng và `group-data-open:[transition:opacity_150ms,translate_150ms,visibility_0s]` cho lúc mở (dấu `_` trong ngoặc vuông là dấu cách).

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
		<title>Bài 002 - Menu ba chấm</title>
		<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
	</head>
	<body class="grid min-h-screen place-items-center bg-stone-100 p-6 font-sans text-stone-800">
		<main class="w-80">
			<h1 class="mb-4 text-lg font-semibold">Dự án của tôi</h1>
			<ul class="space-y-3">
				<li>
					<article
						data-card
						class="group relative rounded-2xl bg-white p-4 shadow-md transition-transform duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5 data-open:z-10 motion-reduce:transition-none"
					>
						<h2 class="font-medium">Website quán cà phê</h2>
						<p class="text-sm text-stone-500">Cập nhật 2 giờ trước</p>
						<button
							data-menu-button
							type="button"
							aria-expanded="false"
							aria-label="Menu dự án Website quán cà phê"
							class="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
						>
							⋯
						</button>
						<div
							data-menu
							class="invisible absolute top-12 right-3 z-50 w-40 translate-y-1 rounded-xl bg-white py-1 opacity-0 shadow-xl ring-1 ring-stone-200 transition-[opacity,translate] duration-150 group-data-open:visible group-data-open:translate-y-0 group-data-open:opacity-100 motion-reduce:transition-none"
						>
							<button type="button" class="block w-full px-3 py-2 text-left text-sm hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none">Đổi tên</button>
							<button type="button" class="block w-full px-3 py-2 text-left text-sm hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none">Nhân bản</button>
							<button type="button" class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none">Xoá</button>
						</div>
					</article>
				</li>
				<li>
					<article
						data-card
						class="group relative rounded-2xl bg-white p-4 shadow-md transition-transform duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5 data-open:z-10 motion-reduce:transition-none"
					>
						<h2 class="font-medium">App ghi chú</h2>
						<p class="text-sm text-stone-500">Cập nhật hôm qua</p>
						<button
							data-menu-button
							type="button"
							aria-expanded="false"
							aria-label="Menu dự án App ghi chú"
							class="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
						>
							⋯
						</button>
						<div
							data-menu
							class="invisible absolute top-12 right-3 z-50 w-40 translate-y-1 rounded-xl bg-white py-1 opacity-0 shadow-xl ring-1 ring-stone-200 transition-[opacity,translate] duration-150 group-data-open:visible group-data-open:translate-y-0 group-data-open:opacity-100 motion-reduce:transition-none"
						>
							<button type="button" class="block w-full px-3 py-2 text-left text-sm hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none">Đổi tên</button>
							<button type="button" class="block w-full px-3 py-2 text-left text-sm hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none">Nhân bản</button>
							<button type="button" class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none">Xoá</button>
						</div>
					</article>
				</li>
				<li>
					<article
						data-card
						class="group relative rounded-2xl bg-white p-4 shadow-md transition-transform duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5 data-open:z-10 motion-reduce:transition-none"
					>
						<h2 class="font-medium">Landing page khoá học</h2>
						<p class="text-sm text-stone-500">Cập nhật 3 ngày trước</p>
						<button
							data-menu-button
							type="button"
							aria-expanded="false"
							aria-label="Menu dự án Landing page khoá học"
							class="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
						>
							⋯
						</button>
						<div
							data-menu
							class="invisible absolute top-12 right-3 z-50 w-40 translate-y-1 rounded-xl bg-white py-1 opacity-0 shadow-xl ring-1 ring-stone-200 transition-[opacity,translate] duration-150 group-data-open:visible group-data-open:translate-y-0 group-data-open:opacity-100 motion-reduce:transition-none"
						>
							<button type="button" class="block w-full px-3 py-2 text-left text-sm hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none">Đổi tên</button>
							<button type="button" class="block w-full px-3 py-2 text-left text-sm hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none">Nhân bản</button>
							<button type="button" class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none">Xoá</button>
						</div>
					</article>
				</li>
			</ul>
		</main>
		<script src="script.js"></script>
	</body>
</html>
```

`solution/script.js`

```js
const cards = document.querySelectorAll('[data-card]');

function setMenu(card, isOpen) {
	const button = card.querySelector('[data-menu-button]');
	card.toggleAttribute('data-open', isOpen);
	button.setAttribute('aria-expanded', String(isOpen));
	if (isOpen) {
		card.querySelector('[data-menu] button').focus();
	}
}

function closeOthers(keepCard) {
	cards.forEach(function (card) {
		if (card !== keepCard && card.hasAttribute('data-open')) {
			setMenu(card, false);
		}
	});
}

cards.forEach(function (card) {
	const button = card.querySelector('[data-menu-button]');
	button.addEventListener('click', function () {
		const willOpen = !card.hasAttribute('data-open');
		closeOthers(card);
		setMenu(card, willOpen);
	});
});

document.addEventListener('click', function (event) {
	if (!event.target.closest('[data-open]')) {
		closeOthers(null);
	}
});

document.addEventListener('keydown', function (event) {
	if (event.key !== 'Escape') {
		return;
	}
	const openCard = document.querySelector('[data-card][data-open]');
	if (openCard) {
		setMenu(openCard, false);
		openCard.querySelector('[data-menu-button]').focus();
	}
});
```

</details>

### Giải thích từng hàm

- `document.querySelectorAll('[data-card]')`: tìm **tất cả** phần tử có thuộc tính `data-card`, trả về một NodeList (giống mảng). Khác `querySelector` chỉ trả về phần tử **đầu tiên**.
- `cards.forEach(function (card) { ... })`: chạy hàm bên trong một lần cho mỗi thẻ, `card` là thẻ đang xét. Nhờ vậy ba thẻ dùng chung một đoạn code.
- `setMenu(card, isOpen)`: hàm tự đặt. Nhận thẻ cần xử lý và `true`/`false`. Nó bật/tắt `data-open`, cập nhật `aria-expanded` của nút `⋯`, và khi mở thì focus mục đầu tiên. Gom vào một hàm vì có bốn chỗ cần mở/đóng: nút `⋯`, đóng menu khác, click ra ngoài, Escape.
- `card.querySelector('[data-menu-button]')`: gọi `querySelector` **trên thẻ** thay vì trên `document` nghĩa là chỉ tìm bên trong thẻ đó. Ba thẻ đều có nút `⋯`, cách này lấy đúng nút của thẻ đang xét.
- `card.toggleAttribute('data-open', isOpen)`: bật/tắt một **thuộc tính HTML** (không phải class). Một tham số thì đảo ngược như `classList.toggle('show')`. Hai tham số thì tham số thứ hai là `force`: `true` luôn thêm `data-open`, `false` luôn gỡ. Đây là cùng ý với `classList.toggle('show', isOpen)` ở bài 001.
- `button.setAttribute('aria-expanded', String(isOpen))`: ghi `"true"`/`"false"` vào thuộc tính để trình đọc màn hình biết menu đang mở hay đóng. `String()` đổi boolean thành chữ vì thuộc tính HTML luôn là chuỗi.
- `card.querySelector('[data-menu] button').focus()`: selector `[data-menu] button` nghĩa là "nút nằm bên trong `data-menu`", `querySelector` lấy nút đầu tiên là "Đổi tên". `focus()` đưa con trỏ bàn phím tới đó.
- `closeOthers(keepCard)`: hàm tự đặt. Duyệt mọi thẻ, thẻ nào **không phải** `keepCard` (`!==` là "khác") mà đang mở thì đóng. Truyền `null` nghĩa là không giữ thẻ nào, đóng hết.
- `card.hasAttribute('data-open')`: hỏi thẻ có thuộc tính `data-open` không, trả về `true`/`false`, không thay đổi gì.
- `const willOpen = !card.hasAttribute('data-open')`: tính trước trạng thái **muốn chuyển tới**. Phải tính trước `closeOthers` cho chắc chắn đọc đúng trạng thái hiện tại của thẻ.
- `document.addEventListener('click', function (event) { ... })`: nghe mọi cú click trên trang. Click trên nút `⋯` cũng "nổi bọt" (bubble) lên tới `document`, chạy sau handler của nút.
- `event.target`: phần tử thật sự bị click (có thể là một nút trong menu, một đoạn chữ...).
- `event.target.closest('[data-open]')`: đi từ chính phần tử đó ngược lên cha, ông... tìm phần tử đầu tiên khớp selector. Gặp thì trả về phần tử, hết đường thì trả về `null`. Ở đây: click nằm trong thẻ đang mở thì giữ nguyên, nằm ngoài thì `null`, `!null` là `true`, đóng hết.
- `event.key !== 'Escape'` rồi `return`: không phải phím Escape thì thoát hàm luôn ("return sớm"), đỡ phải lồng thêm một tầng `if`.
- `document.querySelector('[data-card][data-open]')`: hai ngoặc vuông viết liền nhau nghĩa là phần tử phải có **cả hai** thuộc tính. Tìm thẻ đang mở, không có thì `null`.

Các class Tailwind then chốt:

- `group` trên thẻ và `group-data-open:*` trên menu: menu đổi giao diện theo trạng thái của thẻ cha mà JS không phải đụng vào menu.
- `data-open:z-10` trên thẻ: thoát bẫy stacking context bằng cách nâng cả thẻ đang mở lên trên các thẻ anh em.
- `invisible` cùng `opacity-0`: `opacity-0` làm trong suốt nhưng vẫn bấm và Tab vào được, `invisible` mới thật sự loại menu khỏi tương tác.
- `transition-[opacity,translate]`: chỉ chuyển động hai thuộc tính này, `visibility` đổi ngay nên `focus()` lúc mở luôn thành công.
- `focus-within:-translate-y-0.5`: người dùng bàn phím cũng thấy thẻ nhấc lên như khi rê chuột, và cũng gặp đúng bẫy stacking context, nên cách sửa phải chạy cho cả hai.
