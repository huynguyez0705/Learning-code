# Bài 008: Kệ đĩa nhạc, bóng đổ màu và hai cái bẫy

Ngày học 4, bài 2/3, cấp 1, chủ đề CSS: Đổ bóng (ứng dụng nghe nhạc), độ khó ★★★☆☆, thời gian ước tính 40 phút.

> Trước khi làm, mở PowerShell ở thư mục `daily-css-js` và chạy `npm run dev`. `starter/index.html` đã nối sẵn `<link rel="stylesheet" href="../../build/tailwind.css" />`; `starter/script.js` đang rỗng.
>
> Bạn làm bằng **Tailwind CSS v4**, còn lời giải (`solution/`) viết bằng **CSS thuần** trong `solution/style.css` để bạn đối chiếu mỗi class ra thuộc tính CSS nào.
>
> **Lưu dữ liệu:** bài này chưa dùng `localStorage`, cookie hay server. Tải lại trang là kệ đĩa về thứ tự và trạng thái ban đầu. Đây là hành vi đúng của bài.

## Mục tiêu

- Kệ năm đĩa nằm trên một dải **cuộn ngang**; bóng của đĩa không được bị cắt cụt ở mép trên, dưới và hai bên dải (cái bẫy CSS).
- Bấm "Phát" ở một đĩa: đĩa đó sáng lên với **bóng màu chàm**, nút đổi thành "Dừng", dòng trạng thái ghi "Đang phát: <tên đĩa>". Chỉ một đĩa phát tại một thời điểm.
- Đĩa tự dừng sau 8 giây (`setTimeout`). Phát đĩa A rồi chuyển sang đĩa B giữa chừng thì bộ đếm của A **không** được dừng nhầm B (cái bẫy JS).
- Ba nút sắp xếp "Theo tên", "Theo năm", "Theo thời lượng" xếp lại đĩa đúng thứ tự: tên theo bảng chữ cái tiếng Việt, thời lượng theo **số** (9 phút đứng trước 30 phút, không phải sau 105).
- Nút sắp xếp đang chọn trông như bị **lún** xuống (bóng trong); nút "Dừng tất cả" chỉ bấm được khi có đĩa đang phát.

## Kết quả mong đợi

Trang nền xám nhạt, tiêu đề "Kệ đĩa nhạc", dòng "Chưa phát đĩa nào". Hàng nút sắp xếp bo nhẹ, nút đang chọn nền chàm nhạt và lún; nút "Dừng tất cả" ở mép phải, mờ đi. Bên dưới là năm thẻ trắng, mỗi thẻ có ô bìa gradient, tên, "năm · số phút" và nút "Phát". Rê chuột vào thẻ: thẻ nhích lên 2px, bóng to hơn. Phát một đĩa: bóng quanh thẻ chuyển sang sắc chàm, nút chuyển nền chàm đậm chữ trắng. Sau 8 giây mọi thứ về trạng thái nghỉ.

## Tư duy

**Bóng là phần "tràn" ra ngoài hộp.** `box-shadow` được vẽ bên ngoài khung của phần tử nhưng không chiếm chỗ trong bố cục. Giống ánh đèn hắt quanh một cái hộp: hộp thì nằm gọn trong ô của nó, ánh sáng thì loang ra ngoài. Vì vậy `shadow-xl` (bóng đổ xuống dưới khoảng 25px) cần có khoảng trống quanh thẻ để loang vào.

**Bẫy CSS: `overflow` cắt cả bóng.** Dải cuộn ngang cần `overflow-x-auto`. Khi một trục là `auto`, trục kia không còn là `visible` nữa mà cũng thành `auto`; phần tử con nào tràn ra ngoài khung dải (kể cả bóng) bị cắt hoặc sinh thanh cuộn. Kết quả: bóng thẻ bị cắt phẳng ngay tại mép dưới thẻ, trông như thẻ bị dao cắt. Sửa bằng cách chừa chỗ ngay *trong* dải: `px-6 pt-4 pb-10` (đệm trái-phải 24px, đệm trên 16px, đệm dưới 40px). Bóng loang vào vùng đệm đó nên không còn bị cắt.

**Bẫy JS 1: hẹn giờ cũ vẫn chạy.** `setTimeout(hàm, 8000)` đặt một hẹn giờ và trả về một số định danh. Nó **không tự huỷ** khi bạn phát đĩa khác. Phát A lúc 0 giây, phát B lúc 6 giây: hẹn giờ của A vẫn nổ lúc 8 giây và dừng B (đã phát được 2 giây). Giống đặt báo thức ngủ trưa rồi đổi ý ngủ tiếp: nếu không tắt báo thức cũ, nó vẫn reo. Lời giải: lưu định danh vào biến `timerId`, và gọi `clearTimeout(timerId)` trước khi đặt hẹn giờ mới.

**Bẫy JS 2: `sort()` mặc định so sánh chữ.** `['9','105','30'].sort()` ra `['105','30','9']`, vì so từng ký tự: `'1'` đứng trước `'3'` trước `'9'`. Dữ liệu từ `dataset` luôn là chuỗi, nên phải đổi bằng `Number` rồi trừ nhau. Tên tiếng Việt cũng vậy: so mã ký tự thì `Đ` và `Á` rơi xuống cuối bảng chữ cái; phải dùng `localeCompare(..., 'vi')`.

**Ghi trạng thái một nơi, vẽ một nơi.** Đĩa nào đang phát chỉ được thể hiện bằng một thuộc tính `data-playing` trên thẻ. Hàm `renderState` đọc thuộc tính đó rồi cập nhật nút, dòng trạng thái và nút "Dừng tất cả". Nhờ vậy không có chỗ nào phải nhớ "đĩa nào đang phát" ở hai nơi khác nhau.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Bố cục, bìa gradient, bóng nền `shadow-md`, hover nâng thẻ, nút `aria-pressed:` đã dựng sẵn | Giữ trạng thái phát bằng `data-playing`, `aria-pressed`, `disabled` |
| Bạn thêm: dải cuộn ngang và khoảng đệm cho bóng | Sắp xếp lại các thẻ bằng `sort` và `append` |
| Bạn thêm: bóng màu chàm khi đang phát (`data-playing:`) | Đặt và huỷ hẹn giờ 8 giây |
| Bạn thêm: bóng trong cho nút sắp xếp đang chọn | Đổi chữ nút và dòng trạng thái bằng `textContent` |

JS không thêm/gỡ class giao diện, không đặt `style.boxShadow`, không tìm phần tử bằng class, không đọc dữ liệu sắp xếp từ chữ hiển thị (đọc từ `data-*`).

## Ôn lại

- Bài 004 (`bai-004-bang-diem-cot-dinh`): `aria-pressed:`, uỷ quyền sự kiện bằng `closest`.
- Bài 003 (`bai-003-hop-thoai-xac-nhan`): `toggleAttribute`, `data-*` làm trạng thái, `hover:shadow-xl`.
- Bài 006 (`bai-006-gio-hang`): `Number`, `disabled:`, `Array.from`.
- Bài 007 (`bai-007-the-thoi-tiet`): `bg-linear-to-br from-* to-*` (bìa đĩa), `Array.find`, `setAttribute('aria-pressed', ...)`.

## Gợi ý từng bước

> Starter đã điền sẵn: nền, chữ, khoảng cách, bố cục `flex`, năm thẻ đĩa (kích thước, bo góc, bóng nền `shadow-md`, hover nâng thẻ và `shadow-xl`, chuyển động có `motion-reduce:`, bìa gradient), nút "Phát" (kể cả `aria-pressed:`), ba nút sắp xếp (nền, viền, `aria-pressed:` đổi màu), nút "Dừng tất cả" (`disabled:`). Thẻ ở vị trí 1–3 đã có sẵn `data-playing:shadow-xl data-playing:shadow-indigo-500/40`; nút "Theo tên" và "Theo năm" đã có sẵn bóng trong khi chọn. Chữ trạng thái, chữ nút "Dừng" do JS vẽ.

1. **Đọc HTML và các `data-*`.** **Bạn làm:** không có, bước này đã điền sẵn hết. Mỗi `<li data-album>` có `data-title`, `data-year`, `data-minutes` (đều là chuỗi) và một nút `data-play`. Khối nút có `data-sorter`, mỗi nút có `data-sort` bằng `title`, `year` hoặc `minutes`; còn nút `data-stop-all` đang `disabled`. Dòng trạng thái là `data-now`, dải đĩa là `data-shelf`. Kiểm tra: mở DevTools, thấy năm thẻ xếp thành hàng ngang tràn ra khỏi khung.

2. **Dải cuộn ngang và cái bẫy bóng.** **Bạn làm:** thẻ `<ul data-shelf>`: thêm `overflow-x-auto`, nhìn kết quả, **rồi** thêm `px-6 pt-4 pb-10`. Bước đầu: dải cuộn ngang được nhưng bóng `shadow-md` quanh thẻ bị cắt phẳng ở mép dưới (rê chuột vào thẻ để `shadow-xl` làm lộ rõ hơn). Sau khi thêm khoảng đệm: bóng loang tự nhiên. Kiểm tra: rê chuột lên từng thẻ, bóng không bị cắt ở trên, dưới, hai bên; thử gỡ `pb-10` trong DevTools để thấy bóng bị cắt lại.

3. **JS: lấy phần tử, hàm phụ và `renderState`.** **Bạn làm:** toàn bộ JS từ bước này trở đi. Chọn `shelf`, `sorter`, `now`, `stopAllButton` bằng `data-*`. Viết `getAlbums()` trả `Array.from(shelf.querySelectorAll('[data-album]'))` và `isPlaying(album)` trả `album.hasAttribute('data-playing')`: `hasAttribute(tên)` trả `true` nếu phần tử có thuộc tính đó, bất kể giá trị. Viết `renderState()`: với mỗi đĩa, ghi `aria-pressed` và `textContent` cho nút `[data-play]` (toán tử ba ngôi `điều kiện ? a : b` chọn `'Dừng'` hoặc `'Phát'`); `albums.find(isPlaying)` tìm đĩa đang phát để ghi `data-now`; `albums.some(isPlaying)` trả `true` nếu **có ít nhất một** phần tử thoả hàm, dùng để đặt `stopAllButton.disabled`. Kiểm tra: gọi `renderState()` khi tải trang; dòng trạng thái "Chưa phát đĩa nào", nút "Dừng tất cả" mờ.

4. **JS: phát, dừng và hẹn giờ.** Khai báo `let timerId = 0` và hằng `PREVIEW_MS = 8000`. Viết `stopAll()`: `clearTimeout(timerId)` rồi gỡ `data-playing` của mọi đĩa bằng `toggleAttribute('data-playing', false)`, rồi `renderState()`. Viết `playAlbum(album)`: **gọi `stopAll()` trước**, bật `toggleAttribute('data-playing', true)`, rồi `timerId = setTimeout(stopAll, PREVIEW_MS)`. `setTimeout(hàm, ms)` chạy `hàm` sau `ms` mili giây và trả số định danh; `clearTimeout(số)` huỷ hẹn giờ đó. Gắn **một** `click` lên `shelf`: `closest('[data-play]')` rồi `closest('[data-album]')`; đang phát thì `stopAll()`, ngược lại `playAlbum(album)`. **Cái bẫy:** lần đầu hãy cố ý bỏ `clearTimeout(timerId)`, phát đĩa 1, đợi 6 giây, phát đĩa 2, đợi thêm 3 giây: đĩa 2 bị dừng sau mới 2 giây phát. Thêm `clearTimeout` vào và thử lại. Kiểm tra: phát đĩa, đúng 8 giây sau nó tự dừng; bấm "Dừng" dừng ngay; chuyển đĩa không bị dừng nhầm.

5. **Bóng màu khi đang phát.** **Bạn làm:** 2 thẻ `<li data-album>` cuối (Đêm Sài Gòn, Mưa tháng Ba): thêm `data-playing:shadow-xl data-playing:shadow-indigo-500/40`, chép theo ba thẻ đầu. `data-playing:` chỉ áp dụng khi thẻ có thuộc tính `data-playing`; `shadow-xl` đổi cỡ bóng, `shadow-indigo-500/40` đổi **màu** bóng (chàm 40% độ đặc). Kiểm tra: phát từng đĩa, thẻ nào cũng toả bóng chàm, không chỉ ba thẻ đầu; đĩa nào không phát thì bóng đen xám bình thường.

6. **JS: sắp xếp kệ.** Viết `compareAlbums(a, b, key)`: nếu `key === 'title'` trả `a.dataset.title.localeCompare(b.dataset.title, 'vi')`, ngược lại trả `Number(a.dataset[key]) - Number(b.dataset[key])`. Viết `sortShelf(key)`: `getAlbums()`, `albums.sort(function (a, b) { return compareAlbums(a, b, key); })`, rồi `albums.forEach(function (album) { shelf.append(album); })`; cuối cùng ghi `aria-pressed` cho các nút `[data-sort]`. `append` với phần tử **đã có sẵn trong trang** thì *di chuyển* nó về cuối chứ không nhân bản, nên gọi lần lượt theo thứ tự mới là xếp xong. Gắn một `click` lên `sorter` dùng `closest('[data-sort]')`. **Cái bẫy:** lần đầu viết `albums.sort()` không có hàm so sánh, hoặc so sánh chuỗi bằng `<`, bấm "Theo thời lượng" và xem thứ tự sai (105 đứng trước 9). Kiểm tra: "Theo thời lượng" ra Đêm Sài Gòn (9), Mưa tháng Ba (30), Ánh trăng (42), Cà phê sáng (61), Biển nhớ (105); "Theo tên" ra Ánh, Biển, Cà, Đêm, Mưa, kể cả chữ có dấu.

7. **Bóng trong cho nút sắp xếp.** **Bạn làm:** nút "Theo thời lượng" (nút `data-sort` cuối): thêm `aria-pressed:inset-shadow-sm aria-pressed:inset-shadow-black/30`, chép theo hai nút đầu. `inset-shadow-*` vẽ bóng **bên trong** khung phần tử, tạo cảm giác nút lún xuống; khác `shadow-*` ở chỗ bóng nằm trong, nên không bao giờ bị `overflow` cắt. Kiểm tra: bấm từng nút sắp xếp, nút nào đang chọn đều lún nhẹ như nhau.

8. **JS: nút "Dừng tất cả".** `stopAllButton.addEventListener('click', stopAll)`: truyền tên hàm không có `()`. `renderState` đã lo việc bật/tắt `disabled`. Kiểm tra: chưa phát thì nút mờ và không bấm được; phát thì nút sáng lên; bấm thì mọi đĩa dừng, nút mờ trở lại. Dùng Tab tới nút rồi nhấn Enter: vẫn hoạt động.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `overflow-x-auto` | `overflow-x: auto` |
| `px-6 pt-4 pb-10` | `padding: 1rem 1.5rem 2.5rem` |
| `shadow-xl` | `box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` |
| `shadow-indigo-500/40` | đổi màu trong `box-shadow` thành `rgb(99 102 241 / 0.4)` |
| `data-playing:shadow-xl` | `.album[data-playing] { box-shadow: ... }` |
| `aria-pressed:inset-shadow-sm` | `[aria-pressed="true"] { box-shadow: inset 0 2px 4px ... }` |
| `inset-shadow-black/30` | màu bóng trong `rgb(0 0 0 / 0.3)` |

## Tự kiểm tra

- [ ] Bóng của thẻ không bị cắt ở bất kỳ cạnh nào của dải cuộn; gỡ `pb-10` trong DevTools thì thấy bóng dưới bị cắt.
- [ ] Phát đĩa 1, đợi 6 giây, phát đĩa 2: đĩa 2 phát đủ 8 giây (không bị dừng sau 2 giây).
- [ ] Ba cách sắp xếp ra đúng thứ tự; tên có dấu (`Á`, `Đ`) xếp đúng chỗ.
- [ ] Thẻ ở cả năm vị trí đều có bóng chàm khi phát; ba nút sắp xếp đều lún khi chọn.
- [ ] Nút "Dừng tất cả" mờ khi không có đĩa phát (thuộc tính `disabled` trong DevTools).
- [ ] Bàn phím: Tab qua từng nút, Enter/Space hoạt động, viền focus rõ.
- [ ] Bật `prefers-reduced-motion: reduce`: thẻ không còn nhích hay chuyển bóng mềm khi rê chuột.
- [ ] Tự hỏi: vì sao bóng bị cắt khi thêm `overflow-x-auto` mà không bị cắt khi chỉ dùng `flex`? Vì sao `clearTimeout` phải gọi trước khi `setTimeout` lại? Vì sao `append` không tạo thêm thẻ?

## Thử thách thêm

1. Thêm nút sắp xếp thứ tư "Ngẫu nhiên" bằng cách đảo mảng: dùng `sort(function () { return Math.random() - 0.5; })`; giải thích vì sao cách này không công bằng tuyệt đối. Gợi ý class: chép nút sắp xếp.
2. Thêm bóng chữ cho dòng "Đang phát: ..." bằng `text-shadow-sm` và `text-shadow-indigo-400/50`, hoặc bóng nổi cho ảnh bìa bằng `drop-shadow-lg`. Quan sát `drop-shadow` bám theo hình dạng thật còn `shadow` bám theo khung chữ nhật.

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
		<title>Bài 008 - Kệ đĩa nhạc</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main class="page">
			<header>
				<h1 class="title">Kệ đĩa nhạc</h1>
				<p data-now aria-live="polite" class="now">Chưa phát đĩa nào</p>
			</header>
			<div data-sorter role="group" aria-label="Sắp xếp đĩa" class="sorter">
				<button data-sort="title" type="button" aria-pressed="true" class="sort-button">Theo tên</button>
				<button data-sort="year" type="button" aria-pressed="false" class="sort-button">Theo năm</button>
				<button data-sort="minutes" type="button" aria-pressed="false" class="sort-button">Theo thời lượng</button>
				<button data-stop-all type="button" disabled class="sort-button stop">Dừng tất cả</button>
			</div>
			<ul data-shelf class="shelf">
				<li data-album data-title="Ánh trăng" data-year="2019" data-minutes="42" class="album">
					<div class="cover cover-a"></div>
					<h2 class="album-title">Ánh trăng</h2>
					<p class="album-meta">2019 · 42 phút</p>
					<button data-play type="button" aria-pressed="false" class="play">Phát</button>
				</li>
				<li data-album data-title="Biển nhớ" data-year="2016" data-minutes="105" class="album">
					<div class="cover cover-c"></div>
					<h2 class="album-title">Biển nhớ</h2>
					<p class="album-meta">2016 · 105 phút</p>
					<button data-play type="button" aria-pressed="false" class="play">Phát</button>
				</li>
				<li data-album data-title="Cà phê sáng" data-year="2023" data-minutes="61" class="album">
					<div class="cover cover-d"></div>
					<h2 class="album-title">Cà phê sáng</h2>
					<p class="album-meta">2023 · 61 phút</p>
					<button data-play type="button" aria-pressed="false" class="play">Phát</button>
				</li>
				<li data-album data-title="Đêm Sài Gòn" data-year="2021" data-minutes="9" class="album">
					<div class="cover cover-b"></div>
					<h2 class="album-title">Đêm Sài Gòn</h2>
					<p class="album-meta">2021 · 9 phút</p>
					<button data-play type="button" aria-pressed="false" class="play">Phát</button>
				</li>
				<li data-album data-title="Mưa tháng Ba" data-year="2018" data-minutes="30" class="album">
					<div class="cover cover-e"></div>
					<h2 class="album-title">Mưa tháng Ba</h2>
					<p class="album-meta">2018 · 30 phút</p>
					<button data-play type="button" aria-pressed="false" class="play">Phát</button>
				</li>
			</ul>
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
	background: #f1f5f9;
	color: #1e293b;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	max-width: 42rem;
	margin: 0 auto;
	padding: 2rem 1rem;
}

.title {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 700;
}

.now {
	margin-top: 0.25rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
	color: #64748b;
}

.sorter {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 1rem;
}

.sort-button {
	padding: 0.375rem 0.75rem;
	border: 1px solid #cbd5e1;
	border-radius: 0.5rem;
	background: #fff;
	color: #334155;
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 500;
}

.sort-button:hover {
	background: #f1f5f9;
}

.sort-button[aria-pressed="true"] {
	border-color: #a5b4fc;
	background: #e0e7ff;
	color: #3730a3;
	box-shadow: inset 0 2px 4px rgb(0 0 0 / 0.3);
}

.sort-button:focus-visible,
.play:focus-visible {
	outline: 2px solid #4f46e5;
	outline-offset: 2px;
}

.stop {
	margin-left: auto;
}

.stop:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.shelf {
	display: flex;
	gap: 1rem;
	margin-top: 1.5rem;
	padding: 1rem 1.5rem 2.5rem;
	overflow-x: auto;
}

.album {
	width: 10rem;
	min-width: 10rem;
	padding: 0.75rem;
	border-radius: 1rem;
	background: #fff;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	transition: translate 200ms, box-shadow 200ms;
}

.album:hover {
	translate: 0 -0.125rem;
	box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.album[data-playing] {
	box-shadow: 0 20px 25px -5px rgb(99 102 241 / 0.4), 0 8px 10px -6px rgb(99 102 241 / 0.4);
}

.cover {
	height: 8rem;
	border-radius: 0.75rem;
}

.cover-a {
	background-image: linear-gradient(to bottom right, #a78bfa, #4f46e5);
}

.cover-b {
	background-image: linear-gradient(to bottom right, #fb7185, #f97316);
}

.cover-c {
	background-image: linear-gradient(to bottom right, #22d3ee, #2563eb);
}

.cover-d {
	background-image: linear-gradient(to bottom right, #fcd34d, #ef4444);
}

.cover-e {
	background-image: linear-gradient(to bottom right, #34d399, #0f766e);
}

.album-title {
	margin-top: 0.75rem;
	font-weight: 600;
}

.album-meta {
	margin-top: 0.25rem;
	font-size: 0.75rem;
	line-height: 1rem;
	color: #64748b;
	font-variant-numeric: tabular-nums;
}

.play {
	width: 100%;
	margin-top: 0.75rem;
	padding: 0.375rem 0;
	border-radius: 0.5rem;
	background: #f1f5f9;
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 500;
}

.play:hover {
	background: #e2e8f0;
}

.play[aria-pressed="true"] {
	background: #4f46e5;
	color: #fff;
}

.play[aria-pressed="true"]:hover {
	background: #4338ca;
}

@media (prefers-reduced-motion: reduce) {
	.album {
		transition: none;
	}
}
```

`solution/script.js`

```js
const PREVIEW_MS = 8000;

const shelf = document.querySelector('[data-shelf]');
const sorter = document.querySelector('[data-sorter]');
const now = document.querySelector('[data-now]');
const stopAllButton = document.querySelector('[data-stop-all]');

let timerId = 0;

function getAlbums() {
	return Array.from(shelf.querySelectorAll('[data-album]'));
}

function isPlaying(album) {
	return album.hasAttribute('data-playing');
}

function renderState() {
	const albums = getAlbums();
	albums.forEach(function (album) {
		const playing = isPlaying(album);
		const button = album.querySelector('[data-play]');
		button.setAttribute('aria-pressed', String(playing));
		button.textContent = playing ? 'Dừng' : 'Phát';
	});
	const current = albums.find(isPlaying);
	now.textContent = current ? `Đang phát: ${current.dataset.title}` : 'Chưa phát đĩa nào';
	stopAllButton.disabled = !albums.some(isPlaying);
}

function stopAll() {
	clearTimeout(timerId);
	getAlbums().forEach(function (album) {
		album.toggleAttribute('data-playing', false);
	});
	renderState();
}

function playAlbum(album) {
	stopAll();
	album.toggleAttribute('data-playing', true);
	timerId = setTimeout(stopAll, PREVIEW_MS);
	renderState();
}

function compareAlbums(a, b, key) {
	if (key === 'title') {
		return a.dataset.title.localeCompare(b.dataset.title, 'vi');
	}
	return Number(a.dataset[key]) - Number(b.dataset[key]);
}

function sortShelf(key) {
	const albums = getAlbums();
	albums.sort(function (a, b) {
		return compareAlbums(a, b, key);
	});
	albums.forEach(function (album) {
		shelf.append(album);
	});
	sorter.querySelectorAll('[data-sort]').forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.sort === key));
	});
}

function handleShelfClick(event) {
	const button = event.target.closest('[data-play]');
	if (!button) return;
	const album = button.closest('[data-album]');
	if (isPlaying(album)) {
		stopAll();
	} else {
		playAlbum(album);
	}
}

function handleSorterClick(event) {
	const button = event.target.closest('[data-sort]');
	if (!button) return;
	sortShelf(button.dataset.sort);
}

shelf.addEventListener('click', handleShelfClick);
sorter.addEventListener('click', handleSorterClick);
stopAllButton.addEventListener('click', stopAll);
renderState();
```

</details>

### Giải thích từng hàm

- `const PREVIEW_MS = 8000`: hằng số thời gian nghe thử, tính bằng mili giây (8000 ms = 8 giây). Viết hoa tên để dễ nhận ra là hằng.
- `let timerId = 0`: biến giữ số định danh của hẹn giờ hiện tại. Dùng `let` vì giá trị được gán lại mỗi lần phát.
- `document.querySelector(selector)`: trả phần tử đầu tiên khớp selector hoặc `null`.
- `getAlbums()`: hàm tự đặt, trả mảng các thẻ đĩa. `shelf.querySelectorAll(selector)` trả `NodeList` (giống mảng nhưng không có `sort`/`find`); `Array.from(nodeList)` đổi thành mảng thật. Mỗi lần gọi lấy lại theo thứ tự hiện tại trong trang.
- `isPlaying(album)`: hàm tự đặt, trả `true` nếu thẻ có `data-playing`. `element.hasAttribute(tên)` trả `true`/`false` theo việc thuộc tính có tồn tại, không quan tâm giá trị.
- `renderState()`: hàm tự đặt, vẽ lại nút, dòng trạng thái và nút "Dừng tất cả" từ trạng thái hiện có trong DOM.
- `button.setAttribute('aria-pressed', String(playing))`: `setAttribute(tên, giá trị)` ghi thuộc tính HTML; `String(true)` ra `"true"` vì thuộc tính luôn là chuỗi.
- `playing ? 'Dừng' : 'Phát'`: toán tử ba ngôi; nếu `playing` đúng thì lấy vế sau `?`, sai thì lấy vế sau `:`.
- `` `Đang phát: ${current.dataset.title}` ``: chuỗi mẫu dùng dấu huyền; `${...}` chèn giá trị biểu thức vào chuỗi. `dataset` ánh xạ các thuộc tính `data-*` (ở đây là `data-title`).
- `albums.find(isPlaying)`: trả phần tử đầu tiên mà hàm trả `true`, hoặc `undefined`. Truyền tên hàm không có `()`: có `()` là gọi ngay chứ không phải đưa hàm cho `find` gọi. `current ? ... : ...` coi `undefined` là sai.
- `albums.some(isPlaying)`: trả `true` nếu có ít nhất một phần tử thoả hàm, `false` nếu không (mảng rỗng cũng `false`). `!` đảo đúng/sai, nên `disabled = !some(...)` nghĩa là "khoá khi không có đĩa nào phát".
- `stopAll()`: hàm tự đặt. `clearTimeout(số)` huỷ hẹn giờ có định danh đó, không báo lỗi nếu số không còn hiệu lực. `album.toggleAttribute('data-playing', false)`: tham số thứ hai `false` luôn **gỡ** thuộc tính; khác `toggleAttribute(tên)` chỉ đảo trạng thái.
- `playAlbum(album)`: hàm tự đặt. `toggleAttribute('data-playing', true)` luôn **thêm** thuộc tính. `setTimeout(stopAll, PREVIEW_MS)` hẹn giờ gọi `stopAll` sau 8 giây và trả số định danh; gán vào `timerId` để lần sau huỷ được.
- `compareAlbums(a, b, key)`: hàm tự đặt, hàm so sánh cho `sort`: trả số âm nếu `a` đứng trước, dương nếu `a` đứng sau, `0` nếu bằng nhau. `a.dataset.title.localeCompare(b.dataset.title, 'vi')` so hai chuỗi theo quy tắc ngôn ngữ `'vi'` (tiếng Việt), trả số âm/0/dương; tham số thứ hai chọn ngôn ngữ, khác so sánh mặc định theo mã ký tự. `Number(a.dataset[key]) - Number(b.dataset[key])`: `Number` đổi chuỗi sang số; `dataset[key]` là cách đọc thuộc tính với tên nằm trong biến (`key` là `'year'` thì đọc `dataset.year`); hiệu âm/dương/0 đúng ý nghĩa cho `sort`.
- `===`: so sánh bằng nghiêm ngặt cả giá trị lẫn kiểu.
- `sortShelf(key)`: hàm tự đặt. `albums.sort(hàm)` **sắp xếp ngay trên mảng đó** (thay đổi mảng gốc, không trả mảng mới) theo hàm so sánh; không truyền hàm thì so sánh như chuỗi. `shelf.append(album)` thêm phần tử vào cuối `shelf`; nếu phần tử đã có trong trang thì di chuyển, không nhân bản.
- `forEach(hàm)`: gọi hàm cho từng phần tử, không trả về gì.
- `handleShelfClick(event)`: hàm tự đặt, nhận sự kiện click nổi bọt lên dải. `event.target.closest(selector)` đi từ phần tử bị bấm lên các cha và trả phần tử đầu tiên khớp hoặc `null`; `if (!button) return;` là return sớm khi bấm ra ngoài nút.
- `handleSorterClick(event)`: hàm tự đặt, tương tự cho khối nút sắp xếp; `button.dataset.sort` đọc `data-sort`.
- `element.addEventListener('click', hàm)`: đăng ký hàm chạy mỗi khi có sự kiện click; `stopAllButton.addEventListener('click', stopAll)` truyền tên hàm không có `()`.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

- `overflow-x-auto px-6 pt-4 pb-10` trên `ul` ↔ `.shelf { overflow-x: auto; padding: 1rem 1.5rem 2.5rem }`.
- `data-playing:shadow-xl data-playing:shadow-indigo-500/40` trên thẻ ↔ `.album[data-playing] { box-shadow: 0 20px 25px -5px rgb(99 102 241 / 0.4), 0 8px 10px -6px rgb(99 102 241 / 0.4) }`.
- `aria-pressed:inset-shadow-sm aria-pressed:inset-shadow-black/30` ↔ `.sort-button[aria-pressed="true"] { box-shadow: inset 0 2px 4px rgb(0 0 0 / 0.3) }`.
- `hover:-translate-y-0.5 hover:shadow-xl` ↔ `.album:hover { translate: 0 -0.125rem; box-shadow: ... }`.
- `motion-reduce:transition-none` ↔ `@media (prefers-reduced-motion: reduce) { .album { transition: none } }`.
- `disabled:opacity-40 disabled:cursor-not-allowed` ↔ `.stop:disabled { opacity: 0.4; cursor: not-allowed }`.
