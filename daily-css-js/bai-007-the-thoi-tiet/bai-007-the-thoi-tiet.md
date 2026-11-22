# Bài 007: Thẻ thời tiết đổi màu nền theo thành phố

Ngày học 4, bài 1/3, cấp 1, chủ đề CSS: Gradient (ứng dụng thời tiết), độ khó ★★☆☆☆, thời gian ước tính 35 phút.

> Trước khi làm, mở PowerShell ở thư mục `daily-css-js` và chạy `npm run dev` (cách cài lần đầu xem `daily-css-js/README.md`). `starter/index.html` đã nối sẵn `<link rel="stylesheet" href="../../build/tailwind.css" />`; `starter/script.js` đang rỗng.
>
> Bạn làm bằng **Tailwind CSS v4**, còn lời giải (`solution/`) viết bằng **CSS thuần** trong `solution/style.css` để bạn đối chiếu mỗi class ra thuộc tính CSS nào.
>
> **Lưu dữ liệu:** bài này chưa dùng `localStorage`, cookie hay server. Dữ liệu thời tiết nằm trong mảng ở `script.js`; tải lại trang là về thành phố đầu tiên. Đây là hành vi đúng của bài.

## Mục tiêu

- Bốn nút thành phố: bấm một nút thì thẻ bên dưới hiện đúng tên, nhiệt độ, mô tả, độ ẩm, tốc độ gió của thành phố đó; đúng một nút ở trạng thái `aria-pressed="true"`.
- Nền thẻ là **gradient chéo** đổi màu theo thời tiết: nhiều mây (xám xanh), nắng (vàng cam), mưa (xanh đậm). JS chỉ ghi `data-weather` lên thẻ, mọi màu do Tailwind quyết định.
- Số nhiệt độ có chữ **tô gradient** (trắng nhạt dần xuống dưới).
- Bấm phím `1` đến `4` trên bàn phím chọn nhanh thành phố tương ứng, rồi chuyển focus vào nút đó.
- Dùng đúng **một** listener `click` trên khối nút, không gắn listener lên từng nút.

## Kết quả mong đợi

Trang nền xám nhạt, cột giữa rộng khoảng 384px. Dòng "Thời tiết hôm nay", bốn nút bo tròn; nút đang chọn nền đen chữ trắng. Thẻ bo góc lớn có nền gradient: Hà Nội xám xanh, Đà Nẵng và Sài Gòn vàng cam, Huế xanh lam chuyển sang chàm. Số nhiệt độ rất lớn, trắng ở trên và mờ dần ở dưới, bên dưới là hai ô mờ "Độ ẩm" và "Gió". Đổi thành phố thì màu nền đổi ngay (gradient không chuyển mềm được, xem phần Tư duy).

## Tư duy

**Gradient là ảnh, không phải màu.** `bg-linear-to-br` tạo một *ảnh nền* chuyển màu theo hướng "xuống dưới bên phải" (to bottom right). Hai class `from-*` và `to-*` chỉ khai báo màu đầu và màu cuối. Giống tô một tờ giấy bằng hai cây bút: một đầu tờ giấy là màu này, đầu kia là màu kia, ở giữa hoà vào nhau.

**Đổi màu theo trạng thái bằng `data-[...]:`.** JS không biết "vàng cam" là gì. JS chỉ ghi sự thật: `data-weather="sunny"`. Tailwind đọc sự thật đó qua variant `data-[weather=sunny]:` và đặt màu `from-*`/`to-*` khác đi. Nhờ vậy muốn đổi màu chỉ sửa HTML, không đụng JS.

**Gradient không chạy transition.** Màu nền thường (`background-color`) chuyển mềm được vì trình duyệt tính được các giá trị ở giữa. Gradient là *ảnh nền* (`background-image`), không có giá trị ở giữa, nên đổi là nhảy ngay dù bạn thêm `transition-colors`. Muốn mượt phải dùng mẹo khác (xếp hai lớp rồi đổi độ mờ), để dành cho bài sau.

**Chữ tô gradient gồm ba việc.** Tô gradient lên nền của phần tử (`bg-linear-to-b from-white to-white/50`), cắt nền theo hình các nét chữ (`bg-clip-text`), rồi làm màu chữ gốc trong suốt (`text-transparent`) để nền lộ ra. Thiếu `text-transparent` thì chữ gốc đè lên, không thấy gradient; thiếu `bg-clip-text` thì thấy cả khối chữ nhật gradient.

**Dữ liệu và việc vẽ tách nhau.** Mảng `cities` là dữ liệu; hàm `showCity` vẽ dữ liệu ra màn hình. Mọi cách chọn (bấm chuột, phím số) đều chỉ gọi `showCity(id)`, không ai tự sửa chữ trên màn hình.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Bố cục, màu chữ, bo góc, bóng, trạng thái `aria-pressed:` của nút đã dựng sẵn | Giữ mảng dữ liệu thành phố, tìm thành phố theo `id` |
| Bạn thêm: nền gradient chéo và đổi màu theo `data-weather` | Ghi `data-weather` lên thẻ |
| Bạn thêm: chữ nhiệt độ tô gradient | Ghi chữ bằng `textContent` và chuỗi mẫu |
| Nút đang chọn đổi màu theo `aria-pressed` | Ghi `aria-pressed` cho bốn nút, nghe phím `1`–`4` |

JS không thêm/gỡ class giao diện, không đặt `style.background`, không tự chọn màu, không tìm phần tử bằng class.

## Ôn lại

- Bài 004 (`bai-004-bang-diem-cot-dinh`): variant theo thuộc tính `aria-pressed:`, `closest` để uỷ quyền sự kiện.
- Bài 003 (`bai-003-hop-thoai-xac-nhan`): `dataset` và `data-*` làm cầu nối JS và CSS, variant `data-open:`.
- Bài 005 (`bai-005-binh-luan-dong`): `textContent`, một listener cho cả danh sách.
- Bài 006 (`bai-006-gio-hang`): `Number`, chuỗi mẫu.

## Gợi ý từng bước

> Starter đã điền sẵn: màu nền trang, cỡ chữ, khoảng cách, bốn nút thành phố (kể cả trạng thái `aria-pressed:`, hover, viền focus, `motion-reduce:`), bố cục `grid` hai ô thống kê, bóng và bo góc của thẻ, màu chữ trắng trong thẻ. Thẻ chưa có nền nên chữ trắng đang "tàng hình" trên nền xám nhạt. Không có ô nào hiện chữ, vì chúng do JS vẽ.

1. **Đọc HTML và hiểu các `data-*`.** **Bạn làm:** không có, bước này đã điền sẵn hết. Mỗi nút có `data-city-id` (mã thành phố) và `aria-pressed`. Thẻ có `data-card` và `data-weather`. Các ô chữ là `data-city`, `data-temp`, `data-desc`, `data-humidity`, `data-wind`. Kiểm tra: mở DevTools, thấy bốn nút và một thẻ trống (chữ trắng trên nền sáng nên gần như không thấy).

2. **Nền gradient chéo.** **Bạn làm:** thẻ `<article data-card>`: `bg-linear-to-br from-slate-500 to-slate-700`. `bg-linear-to-br` tạo `linear-gradient` theo hướng xuống dưới bên phải; `from-slate-500` là màu đầu, `to-slate-700` là màu cuối. Kiểm tra: thẻ hiện nền xám xanh sậm dần về góc dưới phải, chữ trắng đọc được.

3. **JS: mảng dữ liệu và hàm tìm.** **Bạn làm:** toàn bộ JS từ bước này. Tạo mảng `cities` gồm 4 đối tượng, mỗi đối tượng có `id`, `name`, `temp`, `weather` (`'cloudy'`, `'sunny'` hoặc `'rain'`), `text`, `humidity`, `wind`. `id` phải trùng `data-city-id` của nút. Viết `findCity(id)` dùng `cities.find(hàm)`: `find` duyệt mảng và trả về **phần tử đầu tiên** mà hàm trả `true`, hoặc `undefined` nếu không có. Kiểm tra: gõ `findCity('hue')` trong Console (nhớ rằng hàm khai báo ở phạm vi toàn trang) thấy đối tượng Huế; `findCity('abc')` ra `undefined`.

4. **JS: hàm `showCity(id)`.** Tìm thành phố, nếu không có thì `return` sớm. Ghi chữ bằng `textContent` và chuỗi mẫu, ví dụ `` `${city.temp}°` ``. Ghi `card.dataset.weather = city.weather`. Với mỗi nút (`querySelectorAll('[data-city-id]').forEach(...)`) ghi `aria-pressed` bằng `setAttribute('aria-pressed', String(button.dataset.cityId === id))`: `setAttribute(tên, giá trị)` ghi thuộc tính HTML và giá trị luôn là chuỗi `"true"` hoặc `"false"`. Gọi `showCity('ha-noi')` ở cuối file. Kiểm tra: tải trang thấy ngay Hà Nội 24°; nút Hà Nội nền đen.

5. **JS: một listener `click` trên khối nút.** `picker.addEventListener('click', handlePickerClick)`. Trong hàm, `event.target.closest('[data-city-id]')` tìm nút bị bấm; không có thì `return`. Gọi `showCity(button.dataset.cityId)`. Kiểm tra: bấm bốn nút lần lượt, chữ và nút nền đen đổi theo; trong DevTools thuộc tính `data-weather` của thẻ đổi `cloudy` / `sunny` / `rain`.

6. **Gradient đổi theo thời tiết.** **Bạn làm:** thẻ `<article data-card>`: thêm `data-[weather=sunny]:from-amber-400 data-[weather=sunny]:to-orange-500 data-[weather=rain]:from-sky-700 data-[weather=rain]:to-indigo-900`. Variant `data-[weather=sunny]:` chỉ áp dụng khi thẻ có đúng `data-weather="sunny"`. Kiểm tra: Đà Nẵng và Sài Gòn vàng cam, Huế xanh lam sang chàm, Hà Nội xám xanh. Thử sửa `data-weather` bằng tay trong DevTools để thấy màu đổi.

7. **Chữ nhiệt độ tô gradient.** **Bạn làm:** thẻ `<p data-temp>`: `bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent`. Kiểm tra: số nhiệt độ trắng ở trên, mờ dần ở dưới. Thử gỡ `text-transparent`, rồi gỡ `bg-clip-text` để thấy từng class làm gì.

8. **JS: phím 1–4.** `document.addEventListener('keydown', handleKeydown)`. `event.key` là chuỗi tên phím (`'1'`, `'Enter'`...). Đổi `Number(event.key) - 1` ra chỉ số mảng; phím không phải số cho `NaN`, nên kiểm tra bằng `Number.isInteger(index)` rồi so với `0` và `cities.length`; sai thì `return`. Bỏ qua khi đang giữ Ctrl/Meta/Alt (`event.ctrlKey`...) để không chặn phím tắt của trình duyệt. Chọn thành phố rồi `focus()` vào nút tương ứng; tìm nút bằng chuỗi mẫu `` `[data-city-id="${city.id}"]` ``. Kiểm tra: nhấn `3` thì Huế hiện ra, nền xanh, focus nằm ở nút Huế (có viền focus xanh); nhấn `9` hoặc `a` không có gì xảy ra.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `bg-linear-to-br` | `background-image: linear-gradient(to bottom right, ...)` |
| `from-slate-500 to-slate-700` | màu đầu `#64748b`, màu cuối `#334155` trong `linear-gradient` |
| `data-[weather=sunny]:from-amber-400` | `.card[data-weather="sunny"] { ... #fbbf24 ... }` |
| `bg-linear-to-b from-white to-white/50` | `linear-gradient(to bottom, #fff, rgb(255 255 255 / 0.5))` |
| `bg-clip-text` | `background-clip: text` |
| `text-transparent` | `color: transparent` |

## Tự kiểm tra

- [ ] Bốn nút đều đổi được thẻ; đúng một nút có `aria-pressed="true"` (xem trong DevTools).
- [ ] Hà Nội xám xanh, Đà Nẵng và Sài Gòn vàng cam, Huế xanh sang chàm; góc sáng ở trên trái, tối ở dưới phải.
- [ ] Số nhiệt độ có gradient chữ; gỡ `bg-clip-text` trong DevTools thì thấy khối chữ nhật.
- [ ] Bàn phím: Tab tới từng nút, Enter/Space chọn; phím `1`–`4` chọn nhanh và có viền focus ở nút tương ứng.
- [ ] Bật `prefers-reduced-motion: reduce` trong DevTools: đổi màu nút tức thì (nền thẻ vốn không chuyển mềm).
- [ ] Chỉ có một `addEventListener('click', ...)` cho bốn nút.
- [ ] Tự hỏi: vì sao `transition-colors` không làm gradient chuyển mềm? Vì sao JS ghi `data-weather` thay vì tự đặt màu? `find` khác `filter` ở đâu?

## Thử thách thêm

1. Thêm thời tiết `night` (đêm) với gradient ba màu `from-indigo-900 via-purple-900 to-slate-900` và một thành phố mới. Gợi ý class: `via-*` đặt màu giữa gradient.
2. Thêm lớp sáng mờ ở góc trên phải bằng nhiều lớp nền: `bg-[radial-gradient(circle_at_top_right,rgb(255_255_255/0.35),transparent_50%),linear-gradient(...)]`. Thử tách thành thẻ con `absolute inset-0` để đọc dễ hơn.

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
		<title>Bài 007 - Thẻ thời tiết</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<h1 class="title">Thời tiết hôm nay</h1>
			<div data-picker class="picker" role="group" aria-label="Chọn thành phố">
				<button data-city-id="ha-noi" type="button" aria-pressed="true" class="city-button">Hà Nội</button>
				<button data-city-id="da-nang" type="button" aria-pressed="false" class="city-button">Đà Nẵng</button>
				<button data-city-id="hue" type="button" aria-pressed="false" class="city-button">Huế</button>
				<button data-city-id="sai-gon" type="button" aria-pressed="false" class="city-button">Sài Gòn</button>
			</div>
			<article data-card data-weather="cloudy" aria-live="polite" class="card">
				<h2 data-city class="city"></h2>
				<p data-temp class="temp"></p>
				<p data-desc class="desc"></p>
				<dl class="stats">
					<div class="stat">
						<dt class="stat-label">Độ ẩm</dt>
						<dd data-humidity class="stat-value"></dd>
					</div>
					<div class="stat">
						<dt class="stat-label">Gió</dt>
						<dd data-wind class="stat-value"></dd>
					</div>
				</dl>
			</article>
			<p class="hint">Bấm phím 1 đến 4 để chọn nhanh thành phố.</p>
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
	border: 0;
	background: none;
	font: inherit;
	color: inherit;
	cursor: pointer;
}

h1,
h2 {
	font-size: inherit;
	font-weight: inherit;
}

.site {
	min-height: 100vh;
	background: #f1f5f9;
	color: #1e293b;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	max-width: 24rem;
	margin: 0 auto;
	padding: 2rem 1rem;
}

.title {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 700;
}

.picker {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 1rem;
}

.city-button {
	padding: 0.5rem 1rem;
	border: 1px solid #cbd5e1;
	border-radius: 9999px;
	background: #fff;
	color: #334155;
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 500;
	transition: background-color 150ms, border-color 150ms, color 150ms;
}

.city-button:hover {
	background: #f1f5f9;
}

.city-button[aria-pressed="true"] {
	border-color: #0f172a;
	background: #0f172a;
	color: #fff;
}

.city-button[aria-pressed="true"]:hover {
	background: #1e293b;
}

.city-button:focus-visible {
	outline: 2px solid #0284c7;
	outline-offset: 2px;
}

.card {
	margin-top: 1.5rem;
	padding: 1.5rem;
	border-radius: 1rem;
	color: #fff;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	background-image: linear-gradient(to bottom right, #64748b, #334155);
}

.card[data-weather="sunny"] {
	background-image: linear-gradient(to bottom right, #fbbf24, #f97316);
}

.card[data-weather="rain"] {
	background-image: linear-gradient(to bottom right, #0369a1, #312e81);
}

.city {
	font-size: 1.125rem;
	line-height: 1.75rem;
	font-weight: 600;
}

.temp {
	margin-top: 0.5rem;
	font-size: 4.5rem;
	line-height: 1;
	font-weight: 700;
	background-image: linear-gradient(to bottom, #fff, rgb(255 255 255 / 0.5));
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.desc {
	margin-top: 0.5rem;
	color: rgb(255 255 255 / 0.8);
}

.stats {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.75rem;
	margin-top: 1.5rem;
}

.stat {
	padding: 0.75rem;
	border-radius: 0.75rem;
	background: rgb(255 255 255 / 0.2);
}

.stat-label {
	font-size: 0.75rem;
	line-height: 1rem;
	color: rgb(255 255 255 / 0.7);
}

.stat-value {
	font-size: 1.125rem;
	line-height: 1.75rem;
	font-weight: 600;
}

.hint {
	margin-top: 1rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
	color: #64748b;
}

@media (prefers-reduced-motion: reduce) {
	.city-button {
		transition: none;
	}
}
```

`solution/script.js`

```js
const cities = [
	{ id: 'ha-noi', name: 'Hà Nội', temp: 24, weather: 'cloudy', text: 'Nhiều mây, se lạnh', humidity: 78, wind: 12 },
	{ id: 'da-nang', name: 'Đà Nẵng', temp: 31, weather: 'sunny', text: 'Nắng đẹp, trời trong', humidity: 62, wind: 18 },
	{ id: 'hue', name: 'Huế', temp: 26, weather: 'rain', text: 'Mưa rào kéo dài', humidity: 91, wind: 9 },
	{ id: 'sai-gon', name: 'Sài Gòn', temp: 34, weather: 'sunny', text: 'Nắng gắt, oi nóng', humidity: 55, wind: 7 },
];

const picker = document.querySelector('[data-picker]');
const card = document.querySelector('[data-card]');
const cityName = document.querySelector('[data-city]');
const temp = document.querySelector('[data-temp]');
const desc = document.querySelector('[data-desc]');
const humidity = document.querySelector('[data-humidity]');
const wind = document.querySelector('[data-wind]');

function findCity(id) {
	return cities.find(function (city) {
		return city.id === id;
	});
}

function showCity(id) {
	const city = findCity(id);
	if (!city) return;
	cityName.textContent = city.name;
	temp.textContent = `${city.temp}°`;
	desc.textContent = city.text;
	humidity.textContent = `${city.humidity}%`;
	wind.textContent = `${city.wind} km/h`;
	card.dataset.weather = city.weather;
	picker.querySelectorAll('[data-city-id]').forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.cityId === id));
	});
}

function handlePickerClick(event) {
	const button = event.target.closest('[data-city-id]');
	if (!button) return;
	showCity(button.dataset.cityId);
}

function handleKeydown(event) {
	if (event.ctrlKey || event.metaKey || event.altKey) return;
	const index = Number(event.key) - 1;
	if (!Number.isInteger(index) || index < 0 || index >= cities.length) return;
	const city = cities[index];
	showCity(city.id);
	picker.querySelector(`[data-city-id="${city.id}"]`).focus();
}

picker.addEventListener('click', handlePickerClick);
document.addEventListener('keydown', handleKeydown);
showCity('ha-noi');
```

</details>

### Giải thích từng hàm

- `const cities = [ {...}, ... ]`: mảng các đối tượng (object). Mỗi đối tượng là một nhóm cặp `tên: giá trị`; đọc bằng `city.name`.
- `document.querySelector(selector)`: trả phần tử đầu tiên khớp selector hoặc `null`. Bài chỉ dùng selector `data-*`.
- `findCity(id)`: hàm tự đặt, trả thành phố có `id` khớp hoặc `undefined`. `cities.find(hàm)` duyệt từng phần tử, trả phần tử đầu tiên mà hàm trả `true`; khác `filter` ở chỗ chỉ trả một phần tử chứ không phải mảng. `function (city) { return city.id === id; }` là hàm không tên truyền thẳng vào `find`.
- `===`: so sánh bằng nghiêm ngặt cả giá trị lẫn kiểu, trả `true` hoặc `false`.
- `showCity(id)`: hàm tự đặt, vẽ thẻ theo thành phố có `id` và cập nhật `aria-pressed` của các nút. `if (!city) return;` là return sớm: `!` đảo giá trị, `undefined` thành `true`, nên không tìm thấy thì dừng.
- `` `${city.temp}°` ``: chuỗi mẫu (template literal) dùng dấu huyền; `${...}` chèn giá trị biểu thức vào chuỗi.
- `element.textContent = chuỗi`: ghi chữ thuần, không bao giờ bị hiểu là HTML.
- `card.dataset.weather = city.weather`: `dataset` là đối tượng ánh xạ các thuộc tính `data-*`; gán vào là ghi thuộc tính `data-weather`. Giá trị luôn thành chuỗi.
- `element.querySelectorAll(selector)`: trả `NodeList` mọi phần tử con khớp. `.forEach(hàm)` gọi hàm cho từng phần tử.
- `button.setAttribute('aria-pressed', String(...))`: `setAttribute(tên, giá trị)` ghi thuộc tính HTML, không trả gì. `String(true)` ra chuỗi `"true"`, vì thuộc tính HTML luôn là chuỗi và `aria-pressed` cần đúng `"true"`/`"false"`.
- `handlePickerClick(event)`: hàm tự đặt, nhận sự kiện click nổi bọt từ nút lên khối nút. `event.target` là phần tử thực sự bị bấm; `closest(selector)` đi từ đó lên các cha và trả phần tử đầu tiên khớp hoặc `null`.
- `handleKeydown(event)`: hàm tự đặt chạy mỗi khi nhấn phím. `event.key` là tên phím dạng chuỗi. `event.ctrlKey`, `event.metaKey`, `event.altKey` là `true` khi phím đó đang được giữ; `||` trả `true` nếu có ít nhất một vế đúng.
- `Number(event.key) - 1`: `Number(chuỗi)` đổi chuỗi sang số, thành `NaN` nếu không phải số (như `'Enter'`). Trừ 1 để phím `1` ứng với chỉ số `0`.
- `Number.isInteger(x)`: trả `true` nếu `x` là số nguyên; `NaN` cho `false`. Dùng `Number.isInteger` thay vì `isNaN` vì còn loại được số lẻ.
- `index < 0 || index >= cities.length`: kiểm tra chỉ số ngoài mảng. `>=` là "lớn hơn hoặc bằng".
- `` picker.querySelector(`[data-city-id="${city.id}"]`) ``: ghép selector bằng chuỗi mẫu để tìm đúng nút. `element.focus()` chuyển focus bàn phím vào phần tử.
- `element.addEventListener('click', hàm)`: đăng ký hàm chạy mỗi khi có sự kiện; truyền tên hàm không có `()`, vì có `()` là gọi ngay chứ không phải đưa hàm cho trình duyệt gọi sau.
- `document.addEventListener('keydown', hàm)`: nghe phím ở toàn trang (sự kiện nổi bọt lên `document`).

### Đối chiếu Tailwind của bạn với CSS trong lời giải

- `bg-linear-to-br from-slate-500 to-slate-700` trên thẻ ↔ `.card { background-image: linear-gradient(to bottom right, #64748b, #334155) }`.
- `data-[weather=sunny]:from-amber-400 data-[weather=sunny]:to-orange-500` ↔ `.card[data-weather="sunny"] { background-image: linear-gradient(to bottom right, #fbbf24, #f97316) }`.
- `data-[weather=rain]:from-sky-700 data-[weather=rain]:to-indigo-900` ↔ `.card[data-weather="rain"] { ... #0369a1, #312e81 ... }`.
- `bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent` trên số nhiệt độ ↔ `.temp { background-image: linear-gradient(to bottom, #fff, rgb(255 255 255 / 0.5)); background-clip: text; color: transparent }`.
- `aria-pressed:bg-slate-900` ↔ `.city-button[aria-pressed="true"] { background: #0f172a }`.
- `motion-reduce:transition-none` ↔ `@media (prefers-reduced-motion: reduce) { .city-button { transition: none } }`.
