# Bài 004: Bảng điểm cuộn hai chiều với tiêu đề và cột đầu dính

Tuần 1, ngày 4/7, vòng 1, độ khó ★★★★☆, thời gian ước tính 45 phút.

> Trước khi làm, mở PowerShell ở thư mục `daily-css-js` và chạy `npm run dev` (cách cài lần đầu xem `daily-css-js/README.md`). `starter/index.html` đã nối sẵn `<link rel="stylesheet" href="../../build/tailwind.css" />`.
>
> Bạn làm bằng Tailwind, còn lời giải (`solution/`) viết bằng **CSS thuần** trong `solution/style.css` để bạn đối chiếu mỗi class ra thuộc tính CSS nào.

## Mục tiêu

- Một bảng điểm 10 học sinh × 7 cột, đặt trong **khung cuộn** cao 288px: cuộn dọc thì hàng tiêu đề đứng yên ở trên (`sticky top-0`).
- Bấm nút "Ghim cột tên": cột tên học sinh đứng yên bên trái khi cuộn ngang (`sticky left-0`). Bấm lần nữa thì thả ra. Ô góc trên-trái (giao của hàng tiêu đề và cột tên) luôn nằm trên cả hai, không bị ô nào trượt đè lên.
- Khi cột tên đang ghim và bảng đã cuộn ngang, cạnh phải cột tên có bóng đổ nhẹ để thấy rõ nó đang nổi lên trên.
- Bấm tên một học sinh: cả hàng được tô nền, kể cả ô tên đang ghim; bấm lại thì bỏ chọn. Dòng trạng thái ghi đúng tên người đang chọn.
- Dùng được bằng bàn phím: Tab tới khung cuộn rồi cuộn bằng phím mũi tên, Tab tới từng tên để chọn bằng Enter/Space.

## Kết quả mong đợi

Nền xanh bạc hà rất nhạt, cột giữa rộng khoảng 576px. Trên cùng là tiêu đề "Bảng điểm lớp 12A", một dòng phụ, rồi một hàng có nút "Ghim cột tên" bên trái và dòng trạng thái bên phải. Bên dưới là khung bảng bo góc, viền xám nhạt, hàng tiêu đề xanh lục đậm chữ trắng. Bảng rộng hơn khung nên có thanh cuộn ngang, và dài hơn khung nên có thanh cuộn dọc. Bấm "Ghim cột tên": nút đổi sang nền xanh đậm. Cuộn sang phải, cột "Học sinh" vẫn ở đó, bên phải nó có một vệt bóng mờ, còn các cột điểm trượt qua phía sau. Bấm "Phạm Quốc Dũng": cả hàng ngả nền xanh nhạt, dòng trạng thái ghi "Đang chọn: Phạm Quốc Dũng".

## Tư duy

**`sticky` bám theo khung cuộn gần nhất.** `position: sticky` hoạt động như "cuộn bình thường, cho tới khi chạm mép thì dính lại". Mép ở đây là mép của **tổ tiên cuộn được gần nhất** (phần tử có `overflow: auto/scroll`), không phải mép màn hình. Vì vậy `top-0` trong bài này nghĩa là "dính vào mép trên của khung cuộn", còn `left-0` là "dính vào mép trái của khung cuộn". Giống tấm bảng tên gắn trên cửa sổ trượt: tấm bảng chỉ dính trong khung cửa sổ đó.

**Bẫy 1: ô góc cần `z-index` cao nhất.** Có ba nhóm ô dính: ô tiêu đề cột điểm (dính ở trên), ô tên học sinh (dính ở trái, chỉ khi ghim), và ô góc "Học sinh" (dính cả hai). Khi cuộn chéo, ô góc phải đứng trên ô tiêu đề (đang trượt ngang qua nó) và đứng trên ô tên (đang trượt dọc qua nó). Nếu các ô dính cùng `z-index`, ô nào đứng **sau** trong HTML được vẽ đè lên. Ô tên nằm trong `tbody`, sau ô góc trong `thead`, nên khi cuộn dọc ô tên sẽ chui đè lên ô góc. Phải xếp tầng: ô tên `z-10` < ô tiêu đề `z-20` < ô góc `z-30`. Bài 002 và 003 đã dạy z-index và thứ tự vẽ, bài này là lần đầu bạn phải xếp **ba** tầng.

**Bẫy 2: ô dính phải có nền đặc, và nền đó phải "theo hàng".** Ô dính đứng trên các ô đang trượt qua, nên nếu nền trong suốt thì chữ phía sau lộ ra xuyên qua, rất rối. Cách vội là cho ô tên `bg-white`. Nhưng khi tô nền hàng được chọn (`bg-emerald-100` đặt trên `tr`), ô tên vẫn trắng vì nền riêng của ô đè lên nền của hàng. Cách đúng là `bg-inherit`: ô lấy lại đúng màu nền của `tr`, hàng đổi màu thì ô đổi theo. Hàng thường là `bg-white`, hàng chọn là `bg-emerald-100`, ô tên chỉ cần `bg-inherit`.

**Bẫy phụ: `border-collapse`.** Mặc định Preflight của Tailwind cho `table` là `border-collapse: collapse`: viền thuộc về bảng chứ không thuộc từng ô, nên viền của ô dính không đi theo ô khi cuộn. Dùng `border-separate border-spacing-0` để mỗi ô tự mang viền của nó, trông vẫn liền nhau mà ô dính dính cả viền.

**Trạng thái:**
- Ghim hay không: thuộc tính `data-pinned` trên khung `[data-table]`. Các ô tên đọc bằng `group-data-pinned:`, nên JS không phải đi sửa từng ô.
- Đã cuộn ngang hay chưa: thuộc tính `data-scrolled` trên `[data-table]`, bật khi `scrollLeft > 0`. Dùng để chỉ hiện bóng khi cột tên thật sự đang đè lên nội dung.
- Hàng đang chọn: `data-selected` trên `tr`. Nút ghim và nút tên có `aria-pressed` để trình đọc màn hình biết trạng thái; Tailwind đọc `aria-pressed:` trực tiếp, không cần thêm `data-*`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Khung cuộn, bảng rộng hơn khung, hàng tiêu đề dính | Bắt click nút ghim, click tên học sinh, sự kiện `scroll` |
| Cột tên dính và bóng đổ theo `group-data-pinned:` / `group-data-scrolled:` | Bật/tắt `data-pinned` và `aria-pressed` của nút ghim |
| Màu nền hàng thường, hover, chọn (`data-selected:`); nút ghim đổi màu (`aria-pressed:`) | Bật/tắt `data-selected` và `aria-pressed` ở hàng; bật/tắt `data-scrolled` |
| Xếp tầng `z-10`/`z-20`/`z-30`, `bg-inherit` | Ghi dòng trạng thái bằng `textContent` |
| Tắt chuyển động khi `motion-reduce` | Giới hạn tần suất xử lý `scroll` bằng `requestAnimationFrame` |

JS KHÔNG nên: đặt `style.left`/`style.top` cho ô để "giả" dính, thêm/gỡ class `sticky`/`bg-emerald-100`, hay tự tính vị trí bóng đổ theo `scrollLeft`. JS chỉ ghi ba trạng thái (`data-pinned`, `data-scrolled`, `data-selected`) cùng `aria-pressed` và một dòng chữ.

## Ôn lại

- Bài 001 (`bai-001-the-phu-dinh-vi`): `position` và `inset`, viền focus rõ ràng.
- Bài 002 (`bai-002-menu-ba-cham`): stacking context và `z-index`, `group-data-*:`, `toggleAttribute(name, force)`, `closest`.
- Bài 003 (`bai-003-hop-thoai-xac-nhan`): `sticky top-0 z-10`, `textContent`, nền cho phần tử dính, `motion-reduce:`.
- Mới ở bài này: `sticky` trong khung cuộn (cả `top` và `left`), xếp ba tầng `z-index`, `bg-inherit`, `border-separate`, variant `aria-pressed:`, hai variant `group-data-*` ghép nhau, `scrollLeft` + sự kiện `scroll` + `requestAnimationFrame`, uỷ quyền sự kiện (một listener cho cả bảng).

## Gợi ý từng bước

Mẹo: cột tên và ô số lặp lại ở mọi hàng. Trong VS Code, bôi một chữ rồi bấm `Ctrl+D` để chọn các chỗ giống nhau và gõ class một lần cho tất cả.

1. **Bố cục trang.** `body`: `bg-emerald-50 font-sans leading-normal text-emerald-950`. `main`: `mx-auto max-w-xl px-6 pt-8 pb-24`. `h1`: `text-2xl font-bold`. Dòng phụ dưới `h1`: `mt-1 text-sm text-emerald-800`. Khối chứa nút và dòng trạng thái (`div` đầu tiên): `mt-6 flex items-center justify-between gap-4`. Dòng trạng thái `[data-status]`: `text-sm text-emerald-800`. Nút `[data-pin]`: `cursor-pointer rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-800 transition-colors duration-150 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 motion-reduce:transition-none`. Kiểm tra: tiêu đề, một hàng nút + dòng chữ, Tab tới nút thấy viền.
2. **Khung cuộn và bảng.** `[data-table]` (khung ngoài): `group mt-4`. `[data-scroll]`: `max-h-72 overflow-auto rounded-xl border border-slate-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700`. `max-h-72` là chiều cao tối đa 288px, `overflow-auto` hiện thanh cuộn khi nội dung vượt khung. `table`: `w-max min-w-full border-separate border-spacing-0 text-sm` (`w-max` cho bảng rộng đúng bằng nội dung thay vì co lại cho vừa khung). Ô tiêu đề cột điểm `th`: `min-w-24 bg-emerald-700 px-4 py-2 text-center font-semibold text-white`. Ô góc "Học sinh": `min-w-40 bg-emerald-800 px-4 py-2 text-left font-semibold text-white`. `tr` trong `tbody`: `bg-white transition-colors duration-150 hover:bg-emerald-50 motion-reduce:transition-none`. Ô điểm `td`: `border-b border-slate-200 px-4 py-2 text-center tabular-nums` (`tabular-nums` cho các chữ số cùng bề rộng nên cột thẳng hàng); riêng ô cuối "Trung bình" thêm `font-semibold`. Ô tên `th` trong `tbody`: `border-b border-slate-200 text-left font-medium`, nút `[data-select]` bên trong: `block w-full cursor-pointer px-4 py-2 text-left whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-700`. Kiểm tra: bảng có thanh cuộn ngang và dọc; cuộn thì mọi thứ trôi bình thường, chưa gì dính.
3. **Hàng tiêu đề dính.** Thêm `sticky top-0` cho mọi `th` trong `thead` (cả ô góc). Cuộn dọc: hàng tiêu đề đứng yên, các hàng trượt qua dưới nó. Các ô dính là phần tử đã được định vị nên mặc định đã nằm trên các ô thường, chưa cần `z-index` ở bước này. Thí nghiệm bẫy phụ: tạm bỏ `border-separate border-spacing-0` khỏi `table`, cuộn và để ý viền các ô quanh hàng tiêu đề; rồi thêm lại. Đọc "Bẫy phụ" trong mục Tư duy.
4. **Cột tên dính khi ghim và bẫy z-index.** Thêm cho mỗi ô tên `th` trong `tbody`: `bg-white group-data-pinned:sticky group-data-pinned:left-0` (chưa thêm `z-*`). Thêm cho ô góc: `group-data-pinned:left-0`. `group-data-pinned:` nghĩa là "chỉ khi tổ tiên có class `group` đang có thuộc tính `data-pinned`". Trong DevTools, tự thêm thuộc tính `data-pinned` vào `[data-table]` rồi cuộn **cả hai chiều**: ô tên chui đè lên ô góc, và tiêu đề cột trượt dưới/đè ô góc. Đó là bẫy 1. Sửa: thêm `z-10` cho ô tên, `z-20` cho ô tiêu đề cột điểm, `z-30` cho ô góc. Kiểm tra lại cuộn chéo: ô góc luôn trên cùng. (`z-10` trên ô tên khi chưa ghim không có tác dụng vì ô chưa được định vị, đó là bình thường.)
5. **Chọn hàng và bẫy nền.** Thêm cho `tr` trong `tbody`: `data-selected:bg-emerald-100 data-selected:hover:bg-emerald-100`. Trong DevTools thêm `data-selected` vào một `tr`: hàng ngả xanh, **trừ** ô tên đang ghim vẫn trắng vì nó có `bg-white` riêng. Đổi `bg-white` trên ô tên thành `bg-inherit`: ô tên theo màu hàng. Kiểm tra: bật `data-pinned`, thêm `data-selected`, cả hàng một màu liền.
6. **Bóng cạnh cột ghim.** Thêm cho ô tên và ô góc: `group-data-pinned:group-data-scrolled:shadow-[4px_0_6px_-4px_rgb(0_0_0/0.3)]`. Hai variant ghép nhau nghĩa là phải có **cả** `data-pinned` và `data-scrolled` trên khung. Dấu `_` trong giá trị tuỳ ý thay cho dấu cách. Kiểm tra: thêm cả hai thuộc tính bằng tay vào `[data-table]` thì xuất hiện bóng ở cạnh phải cột tên.
7. **Nút ghim đổi màu.** Thêm cho nút `[data-pin]`: `aria-pressed:border-emerald-700 aria-pressed:bg-emerald-700 aria-pressed:text-white aria-pressed:hover:bg-emerald-800`. Kiểm tra: tự đổi `aria-pressed="true"` trong DevTools thì nút đậm lên.
8. **JS.** Lấy `[data-table]`, `[data-scroll]`, `[data-pin]`, `[data-status]` bằng `querySelector`. Viết `setPinned(isPinned)` bật/tắt `data-pinned` trên khung bằng `toggleAttribute('data-pinned', isPinned)` và ghi `aria-pressed` cho nút bằng `setAttribute('aria-pressed', String(isPinned))` (`aria-pressed` cần chuỗi `"true"`/`"false"`, không phải boolean). Gắn click cho nút ghim: đảo trạng thái hiện tại bằng `!wrap.hasAttribute('data-pinned')`. Viết `setRow(row, isSelected)` và `toggleRow(row)`: bỏ chọn hàng cũ (nếu có), chọn hàng mới (trừ khi bấm lại đúng hàng đó thì chỉ bỏ chọn), ghi dòng trạng thái bằng `textContent`. Gắn **một** listener `click` lên `[data-table]` thay vì 10 listener: dùng `event.target.closest('[data-select]')` để biết có bấm vào nút tên không (kỹ thuật này gọi là uỷ quyền sự kiện). Cuối cùng gắn `scroll` lên `[data-scroll]`: mỗi lần cuộn gọi `requestAnimationFrame` để cập nhật `data-scrolled` theo `scrollLeft > 0`, dùng một biến `let` để không xếp nhiều lần trong cùng một khung hình. `scroll` bắn rất dày khi cuộn, nên giới hạn như vậy cho nhẹ. Kiểm tra: ghim, cuộn ngang thấy bóng, cuộn về trái hết thì bóng mất; chọn hàng thì dòng trạng thái đổi.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `sticky top-0` | `position: sticky; top: 0` (dính vào mép trên khung cuộn) |
| `group-data-pinned:sticky group-data-pinned:left-0` | `.table-wrap[data-pinned] .row-head { position: sticky; left: 0 }` |
| `z-10`, `z-20`, `z-30` | `z-index: 10`, `z-index: 20`, `z-index: 30` |
| `max-h-72` | `max-height: 288px` |
| `overflow-auto` | `overflow: auto` |
| `w-max min-w-full` | `width: max-content; min-width: 100%` |
| `border-separate border-spacing-0` | `border-collapse: separate; border-spacing: 0` |
| `min-w-24`, `min-w-40` | `min-width: 96px`, `min-width: 160px` |
| `px-4 py-2` | `padding: 8px 16px` |
| `tabular-nums` | `font-variant-numeric: tabular-nums` |
| `whitespace-nowrap` | `white-space: nowrap` |
| `bg-inherit` | `background-color: inherit` |
| `data-selected:bg-emerald-100` | `.row[data-selected] { background: #d1fae5 }` |
| `aria-pressed:bg-emerald-700` | `.pin-button[aria-pressed="true"] { background: #047857 }` |
| `group-data-pinned:group-data-scrolled:shadow-[...]` | `.table-wrap[data-pinned][data-scrolled] .row-head { box-shadow: ... }` |
| `focus-visible:-outline-offset-2` | `:focus-visible { outline-offset: -2px }` (viền thụt vào trong) |
| `motion-reduce:transition-none` | `@media (prefers-reduced-motion: reduce) { transition: none }` |

## Tự kiểm tra

- [ ] Cuộn dọc: hàng tiêu đề đứng yên ở trên, các hàng trượt qua dưới nó, không có chữ nào lộ ra xuyên qua tiêu đề.
- [ ] Chưa ghim, cuộn ngang: cột tên trượt đi cùng các cột khác. Ghim rồi: cột tên đứng yên.
- [ ] Ghim, cuộn chéo (cả ngang lẫn dọc): ô "Học sinh" ở góc luôn nằm trên cùng, không bị ô nào đè.
- [ ] Trong DevTools, xoá `z-30` khỏi ô góc rồi cuộn chéo: ô góc bị đè. Thêm lại: hết bị đè.
- [ ] Trong DevTools, đổi `bg-inherit` thành `bg-white` ở một ô tên rồi chọn hàng đó: ô tên không đổi màu theo hàng. Đổi lại.
- [ ] Bóng ở cạnh cột tên chỉ hiện khi **vừa ghim vừa đã cuộn ngang**; cuộn về mép trái hết thì mất.
- [ ] Bấm một tên: hàng đổi màu và dòng trạng thái ghi đúng tên; bấm tên khác: hàng cũ bỏ chọn; bấm lại đúng hàng: bỏ chọn, dòng trạng thái về "Chưa chọn học sinh nào".
- [ ] Trong Elements: `data-pinned`, `data-scrolled`, `data-selected` và `aria-pressed` đổi đúng lúc.
- [ ] Bàn phím: Tab tới khung bảng (viền focus), cuộn bằng phím mũi tên; Tab tới từng tên, Enter hoặc Space để chọn; viền focus của tên nằm gọn trong ô.
- [ ] Bật giả lập `prefers-reduced-motion: reduce`: hàng và nút đổi màu ngay, không mờ dần.
- [ ] Tự hỏi: vì sao `top-0` ở đây không dính vào mép trên của màn hình mà vào mép trên của khung bảng?
- [ ] Tự hỏi: vì sao chỉ cần một listener `click` trên `[data-table]` mà vẫn bắt được click ở cả 10 tên? Thử in `event.target` ra console khi bấm.
- [ ] Tự hỏi: nếu bỏ biến `waiting` và gọi thẳng `updateScrolled()` trong sự kiện `scroll`, giao diện có sai không, và điều gì khác đi?

## Thử thách thêm

1. Thêm cột "Xếp loại" cũng dính, nhưng ở **bên phải** (`sticky right-0`), có bóng ở cạnh trái chỉ khi bảng còn chỗ để cuộn sang phải. Gợi ý: JS ghi thêm `data-scroll-end` khi `scrollLeft + clientWidth >= scrollWidth`, class `group-not-data-scroll-end:shadow-[-4px_0_6px_-4px_rgb(0_0_0/0.3)]`.
2. Cho hàng đang chọn dính luôn ở dưới đáy khung cuộn khi cuộn ra khỏi tầm nhìn. Gợi ý: `data-selected:sticky data-selected:bottom-0 data-selected:z-10` trên `tr` (thử xem `sticky` trên `tr` chạy thế nào so với trên `th`), và nhớ ô tên đã có `z-10`: hàng chọn phải đứng ở tầng nào cho khỏi đè lên ô góc?

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
		<title>Bài 004 - Bảng điểm cột dính</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body>
		<main data-page class="page">
			<h1 class="title">Bảng điểm lớp 12A</h1>
			<p class="subtitle">Cuộn bảng theo cả hai chiều, bấm nút Ghim để giữ cột tên đứng yên</p>
			<div class="toolbar">
				<button data-pin type="button" aria-pressed="false" class="pin-button">Ghim cột tên</button>
				<p data-status aria-live="polite" class="status">Chưa chọn học sinh nào</p>
			</div>
			<div data-table class="table-wrap">
				<div data-scroll tabindex="0" role="region" aria-label="Bảng điểm, dùng phím mũi tên để cuộn" class="scroller">
					<table class="grid-table">
						<thead>
							<tr>
								<th scope="col" class="corner">Học sinh</th>
								<th scope="col" class="col-head">Toán</th>
								<th scope="col" class="col-head">Văn</th>
								<th scope="col" class="col-head">Anh</th>
								<th scope="col" class="col-head">Lý</th>
								<th scope="col" class="col-head">Hoá</th>
								<th scope="col" class="col-head">Sinh</th>
								<th scope="col" class="col-head">Trung bình</th>
							</tr>
						</thead>
						<tbody>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Nguyễn Văn An</button></th>
								<td class="cell">8.5</td>
								<td class="cell">7.0</td>
								<td class="cell">9.0</td>
								<td class="cell">8.0</td>
								<td class="cell">7.5</td>
								<td class="cell">8.0</td>
								<td class="cell average">8.0</td>
							</tr>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Trần Thị Bình</button></th>
								<td class="cell">9.0</td>
								<td class="cell">8.5</td>
								<td class="cell">8.0</td>
								<td class="cell">9.5</td>
								<td class="cell">9.0</td>
								<td class="cell">8.5</td>
								<td class="cell average">8.8</td>
							</tr>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Lê Minh Châu</button></th>
								<td class="cell">6.5</td>
								<td class="cell">7.5</td>
								<td class="cell">7.0</td>
								<td class="cell">6.0</td>
								<td class="cell">6.5</td>
								<td class="cell">7.0</td>
								<td class="cell average">6.8</td>
							</tr>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Phạm Quốc Dũng</button></th>
								<td class="cell">7.0</td>
								<td class="cell">6.5</td>
								<td class="cell">8.5</td>
								<td class="cell">7.5</td>
								<td class="cell">8.0</td>
								<td class="cell">7.0</td>
								<td class="cell average">7.4</td>
							</tr>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Hoàng Thu Hà</button></th>
								<td class="cell">9.5</td>
								<td class="cell">9.0</td>
								<td class="cell">9.5</td>
								<td class="cell">9.0</td>
								<td class="cell">8.5</td>
								<td class="cell">9.0</td>
								<td class="cell average">9.1</td>
							</tr>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Vũ Đăng Khoa</button></th>
								<td class="cell">5.5</td>
								<td class="cell">6.0</td>
								<td class="cell">6.5</td>
								<td class="cell">5.0</td>
								<td class="cell">6.0</td>
								<td class="cell">5.5</td>
								<td class="cell average">5.8</td>
							</tr>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Đặng Mai Lan</button></th>
								<td class="cell">8.0</td>
								<td class="cell">9.0</td>
								<td class="cell">7.5</td>
								<td class="cell">8.5</td>
								<td class="cell">8.0</td>
								<td class="cell">9.0</td>
								<td class="cell average">8.3</td>
							</tr>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Bùi Hoàng Minh</button></th>
								<td class="cell">7.5</td>
								<td class="cell">7.0</td>
								<td class="cell">7.0</td>
								<td class="cell">8.0</td>
								<td class="cell">7.5</td>
								<td class="cell">6.5</td>
								<td class="cell average">7.2</td>
							</tr>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Ngô Bảo Ngọc</button></th>
								<td class="cell">8.5</td>
								<td class="cell">8.0</td>
								<td class="cell">9.0</td>
								<td class="cell">7.5</td>
								<td class="cell">8.0</td>
								<td class="cell">8.5</td>
								<td class="cell average">8.2</td>
							</tr>
							<tr data-row class="row">
								<th scope="row" class="row-head"><button data-select type="button" aria-pressed="false" class="row-select">Đỗ Gia Phúc</button></th>
								<td class="cell">6.0</td>
								<td class="cell">7.0</td>
								<td class="cell">6.5</td>
								<td class="cell">7.0</td>
								<td class="cell">6.5</td>
								<td class="cell">7.5</td>
								<td class="cell average">6.8</td>
							</tr>
						</tbody>
					</table>
				</div>
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

button {
	font: inherit;
	color: inherit;
	background: none;
	border: 0;
	cursor: pointer;
}

h1 {
	font-size: inherit;
	font-weight: inherit;
}

body {
	background: #ecfdf5;
	color: #022c22;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	max-width: 576px;
	margin: 0 auto;
	padding: 32px 24px 96px;
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
	color: #065f46;
}

.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	margin-top: 24px;
}

.status {
	font-size: 14px;
	line-height: 20px;
	color: #065f46;
}

.pin-button {
	padding: 6px 12px;
	border: 1px solid #6ee7b7;
	border-radius: 8px;
	background: #fff;
	color: #065f46;
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	transition:
		background-color 150ms ease,
		color 150ms ease,
		border-color 150ms ease;
}

.pin-button:hover {
	background: #d1fae5;
}

.pin-button[aria-pressed="true"] {
	border-color: #047857;
	background: #047857;
	color: #fff;
}

.pin-button[aria-pressed="true"]:hover {
	background: #065f46;
}

.pin-button:focus-visible {
	outline: 2px solid #047857;
	outline-offset: 2px;
}

.table-wrap {
	margin-top: 16px;
}

.scroller {
	max-height: 288px;
	overflow: auto;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
	background: #fff;
}

.scroller:focus-visible {
	outline: 2px solid #047857;
	outline-offset: 2px;
}

.grid-table {
	width: max-content;
	min-width: 100%;
	border-collapse: separate;
	border-spacing: 0;
	font-size: 14px;
	line-height: 20px;
}

.corner {
	position: sticky;
	top: 0;
	z-index: 30;
	min-width: 160px;
	padding: 8px 16px;
	background: #065f46;
	color: #fff;
	text-align: left;
	font-weight: 600;
}

.col-head {
	position: sticky;
	top: 0;
	z-index: 20;
	min-width: 96px;
	padding: 8px 16px;
	background: #047857;
	color: #fff;
	text-align: center;
	font-weight: 600;
}

.row {
	background: #fff;
	transition: background-color 150ms ease;
}

.row:hover {
	background: #ecfdf5;
}

.row[data-selected],
.row[data-selected]:hover {
	background: #d1fae5;
}

.row-head {
	z-index: 10;
	border-bottom: 1px solid #e2e8f0;
	background-color: inherit;
	text-align: left;
	font-weight: 500;
}

.row-select {
	display: block;
	width: 100%;
	padding: 8px 16px;
	text-align: left;
	white-space: nowrap;
}

.row-select:focus-visible {
	outline: 2px solid #047857;
	outline-offset: -2px;
}

.cell {
	padding: 8px 16px;
	border-bottom: 1px solid #e2e8f0;
	text-align: center;
	font-variant-numeric: tabular-nums;
}

.average {
	font-weight: 600;
}

.table-wrap[data-pinned] .corner {
	left: 0;
}

.table-wrap[data-pinned] .row-head {
	position: sticky;
	left: 0;
}

.table-wrap[data-pinned][data-scrolled] .corner,
.table-wrap[data-pinned][data-scrolled] .row-head {
	box-shadow: 4px 0 6px -4px rgb(0 0 0 / 0.3);
}

@media (prefers-reduced-motion: reduce) {
	.pin-button,
	.row {
		transition: none;
	}
}
```

`solution/script.js`

```js
const wrap = document.querySelector('[data-table]');
const scroller = wrap.querySelector('[data-scroll]');
const pinButton = document.querySelector('[data-pin]');
const status = document.querySelector('[data-status]');
let waiting = false;

function setPinned(isPinned) {
	wrap.toggleAttribute('data-pinned', isPinned);
	pinButton.setAttribute('aria-pressed', String(isPinned));
}

function updateScrolled() {
	wrap.toggleAttribute('data-scrolled', scroller.scrollLeft > 0);
	waiting = false;
}

function setRow(row, isSelected) {
	row.toggleAttribute('data-selected', isSelected);
	row.querySelector('[data-select]').setAttribute('aria-pressed', String(isSelected));
}

function toggleRow(row) {
	const previous = wrap.querySelector('[data-row][data-selected]');
	if (previous) {
		setRow(previous, false);
	}
	if (previous === row) {
		status.textContent = 'Chưa chọn học sinh nào';
		return;
	}
	setRow(row, true);
	status.textContent = 'Đang chọn: ' + row.querySelector('[data-select]').textContent;
}

pinButton.addEventListener('click', function () {
	setPinned(!wrap.hasAttribute('data-pinned'));
});

scroller.addEventListener(
	'scroll',
	function () {
		if (waiting) {
			return;
		}
		waiting = true;
		requestAnimationFrame(updateScrolled);
	},
	{ passive: true }
);

wrap.addEventListener('click', function (event) {
	const button = event.target.closest('[data-select]');
	if (button) {
		toggleRow(button.closest('[data-row]'));
	}
});
```

</details>

### Giải thích từng hàm

- `document.querySelector('[data-table]')`: tìm phần tử **đầu tiên** khớp selector, trả về `null` nếu không có. Mỗi phần tử trong bài chỉ có một nên dùng `querySelector`. `wrap.querySelector('[data-scroll]')` gọi trên `wrap` nghĩa là chỉ tìm bên trong khung đó.
- `let waiting = false;`: `let` vì giá trị được gán lại. Biến nhớ "đã hẹn cập nhật `data-scrolled` ở khung hình kế tiếp chưa". `const` dùng cho phần tử vì không bao giờ gán lại.
- `setPinned(isPinned)`: hàm tự đặt, bật/tắt cùng lúc hai nơi (khung và nút) để chúng không lệch nhau.
- `wrap.toggleAttribute('data-pinned', isPinned)`: như bài 002. `toggleAttribute(name)` (một tham số) đảo trạng thái: có thì gỡ, không thì thêm. Có tham số thứ hai `force` thì ép: `true` luôn thêm, `false` luôn gỡ. Ở đây truyền `isPinned` nên thuộc tính luôn khớp với giá trị muốn đặt.
- `pinButton.setAttribute('aria-pressed', String(isPinned))`: `setAttribute(name, value)` ghi giá trị thuộc tính. Giá trị luôn là chuỗi. `String(true)` ra `"true"`, `String(false)` ra `"false"`; trình đọc màn hình và selector `[aria-pressed="true"]` đều đọc chuỗi này.
- `pinButton.addEventListener('click', function () {...})`: chạy hàm mỗi lần bấm nút.
- `!wrap.hasAttribute('data-pinned')`: `hasAttribute(name)` trả về `true` nếu phần tử có thuộc tính đó. Dấu `!` là phủ định: đảo `true` thành `false` và ngược lại. Vậy đang ghim thì truyền `false` (thả ra), chưa ghim thì truyền `true` (ghim).
- `updateScrolled()`: hàm tự đặt, đọc vị trí cuộn và ghi `data-scrolled`, rồi gán `waiting = false` để cho phép hẹn lần tiếp theo.
- `scroller.scrollLeft`: số pixel mà khung đã cuộn sang phải. `0` nghĩa là đang ở mép trái. `scroller.scrollLeft > 0` cho `true` hoặc `false`, truyền thẳng làm `force` của `toggleAttribute`.
- `scroller.addEventListener('scroll', handler, { passive: true })`: tham số thứ ba là object tuỳ chọn. `passive: true` hứa với trình duyệt rằng hàm xử lý sẽ không gọi `preventDefault()`, nên trình duyệt cuộn mượt mà không phải chờ hàm chạy xong. Không có tham số này vẫn chạy, chỉ kém mượt hơn. Hàm được tách thành nhiều dòng chỉ vì trình bày; nội dung giống `addEventListener('scroll', function () {...}, { passive: true })`.
- `if (waiting) { return; }`: "return sớm". Nếu đã hẹn rồi thì thoát khỏi hàm ngay, bỏ qua phần bên dưới. Sự kiện `scroll` bắn rất dày, hàng chục lần mỗi giây, nên chỉ hẹn một lần mỗi khung hình.
- `requestAnimationFrame(updateScrolled)`: xin trình duyệt gọi `updateScrolled` ngay trước lần vẽ khung hình kế tiếp, nhiều nhất một lần mỗi khung hình. Truyền tên hàm, không có `()`: viết `updateScrolled()` thì hàm chạy ngay lúc gắn chứ không phải lúc vẽ.
- `setRow(row, isSelected)`: hàm tự đặt, bật/tắt `data-selected` trên `tr` và `aria-pressed` trên nút tên trong hàng đó.
- `row.querySelector('[data-select]')`: tìm nút tên bên trong hàng.
- `toggleRow(row)`: hàm tự đặt, chạy khi bấm một tên.
- `const previous = wrap.querySelector('[data-row][data-selected]')`: selector `[a][b]` viết liền nghĩa là phần tử phải có **cả hai** thuộc tính. Tìm hàng đang được chọn; không có thì `previous` là `null`.
- `if (previous) {...}`: `null` được coi là "sai", nên chỉ bỏ chọn khi thật sự có hàng cũ.
- `previous === row`: `===` so sánh chặt, đúng khi hai bên là **cùng một phần tử**. Đúng nghĩa là người dùng bấm lại hàng đang chọn: chỉ bỏ chọn, ghi "Chưa chọn học sinh nào" rồi `return` sớm.
- `status.textContent = 'Đang chọn: ' + ...`: ghi chữ thuần, thay toàn bộ chữ cũ; `+` nối hai chuỗi. `row.querySelector('[data-select]').textContent` đọc tên học sinh. Dòng trạng thái có `aria-live="polite"` nên trình đọc màn hình tự đọc khi chữ đổi.
- `wrap.addEventListener('click', function (event) {...})`: một listener trên khung cha bắt click của mọi phần tử con. Click nổi bọt (bubble) từ phần tử bị bấm lên tới các tổ tiên, nên khung cha nhận được.
- `event.target`: phần tử thật sự bị bấm. `event.target.closest('[data-select]')`: đi ngược từ phần tử đó lên tìm nút tên gần nhất, kể cả chính nó; trả `null` nếu bấm ra ngoài nút (ví dụ bấm vào ô điểm), khi đó `if (button)` không chạy.
- `button.closest('[data-row]')`: từ nút đi ngược lên `tr` chứa nó, rồi truyền cho `toggleRow`.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

- `sticky top-0 z-30` trên ô góc tương ứng `.corner { position: sticky; top: 0; z-index: 30; }`. Ô tiêu đề cột điểm là `.col-head` với `z-index: 20`, ô tên là `.row-head` với `z-index: 10`: ba tầng khớp ba class `z-30`, `z-20`, `z-10`.
- `group-data-pinned:sticky group-data-pinned:left-0` trên ô tên thành `.table-wrap[data-pinned] .row-head { position: sticky; left: 0; }`. Giống bài 002: `group` cùng `group-data-*` thành selector con cháu. Ô góc có `group-data-pinned:left-0` thành `.table-wrap[data-pinned] .corner { left: 0; }`.
- `group-data-pinned:group-data-scrolled:shadow-[...]` thành `.table-wrap[data-pinned][data-scrolled] .corner, ... .row-head { box-shadow: ... }`. Hai variant ghép lại thành hai thuộc tính viết liền trên cùng một phần tử `.table-wrap`.
- `bg-inherit` thành `background-color: inherit` trong `.row-head`. Hàng thường `bg-white` là `.row { background: #fff; }`, hàng chọn `data-selected:bg-emerald-100` là `.row[data-selected] { background: #d1fae5; }`; `data-selected:hover:bg-emerald-100` thành dòng `.row[data-selected]:hover`.
- `aria-pressed:bg-emerald-700` thành `.pin-button[aria-pressed="true"] { background: #047857; }`; `aria-pressed:hover:bg-emerald-800` thành `.pin-button[aria-pressed="true"]:hover`.
- `border-separate border-spacing-0` thành `border-collapse: separate; border-spacing: 0;` trong `.grid-table`. Trong CSS thuần không có Preflight nên mặc định của trình duyệt là `separate` với khoảng cách 2px; ta đặt `border-spacing: 0` rõ ràng.
- `w-max min-w-full` thành `width: max-content; min-width: 100%;`. `max-h-72 overflow-auto` thành `max-height: 288px; overflow: auto;` trong `.scroller`.
- `px-4 py-2` thành `padding: 8px 16px`. `focus-visible:-outline-offset-2` thành `.row-select:focus-visible { outline-offset: -2px; }`, còn `focus-visible:outline-2 focus-visible:outline-emerald-700` thành `outline: 2px solid #047857`.
- Cỡ chữ: `text-sm`, `text-2xl` trong Tailwind đã gồm cả `line-height`, nên trong CSS có thêm `line-height: 20px`, `32px`. `transition-colors duration-150` thành `transition: background-color 150ms ease, ...` (Tailwind dùng đường cong `cubic-bezier(0.4, 0, 0.2, 1)`, `ease` là gần đúng).
- `motion-reduce:transition-none` thành khối `@media (prefers-reduced-motion: reduce) { .pin-button, .row { transition: none; } }`.
- Reset đầu `style.css` (`box-sizing`, `margin`, `padding`, `button`, `h1`) làm thay việc Preflight của Tailwind.
- Màu (hex gần đúng, Tailwind v4 thật ra dùng `oklch(...)`): `emerald-50` `#ecfdf5`, `emerald-100` `#d1fae5`, `emerald-300` `#6ee7b7`, `emerald-700` `#047857`, `emerald-800` `#065f46`, `emerald-950` `#022c22`, `slate-200` `#e2e8f0`.
