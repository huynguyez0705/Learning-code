# Bài 019: Xúc xắc 3D lăn thật và hai cái bẫy dựng khối lập phương

Ngày học 7, bài 3/3, cấp 1, chủ đề CSS: 3D nâng cao (ứng dụng trò chơi xúc xắc có thống kê), độ khó ★★★★★, thời gian ước tính 45 phút.

> Chạy `npm run dev` trong `D:\VSCODE\Learning-code\daily-css-js` rồi mở `starter/index.html` bằng server như các bài trước. Bạn làm bằng **Tailwind CSS v4**; `starter/script.js` đang rỗng. Lời giải trong `solution/` dùng CSS thuần với `style.css`, mở thẳng file là chạy.
>
> **Lưu dữ liệu:** bài này không dùng `localStorage`, cookie hay server. Tải lại trang thì thống kê về 0 và xúc xắc về mặt số 1. Đây là hành vi đúng của bài.

## Mục tiêu

- Dựng một **khối lập phương 3D** từ sáu tấm phẳng: bốn mặt đã có sẵn, bạn tự làm **mặt trên và mặt dưới** (xoay `rotate-x-90`) và thấy cả hai cái bẫy của kỹ thuật này.
- Nhìn khối từ trên xuống một chút (`perspective-origin-top`) để lộ mặt trên.
- Bấm `Lắc`: khối quay nhiều vòng trong 1 giây rồi **dừng đúng mặt có số vừa random** hướng về người xem.
- Kết quả, tổng điểm, trung bình, tám lần gần nhất và sáu thanh thống kê cập nhật **sau khi khối dừng**, không phải lúc vừa bấm.
- Hoạt động đúng cả khi người dùng bật `prefers-reduced-motion` (không kẹt nút), và khi ra cùng một mặt hai lần liên tiếp.

## Kết quả mong đợi

Một khối trắng chữ số lớn đứng giữa khung tối. Bấm `Lắc`: khối xoay mấy vòng theo hai trục rồi dừng, dòng "Kết quả: 5" hiện ra dưới khối, dòng "Gần đây: 3, 5, 5, 1. Tổng 14, trung bình 3.50." nằm bên dưới, và thanh ngang của mặt vừa ra dài thêm. Trong lúc khối đang xoay, hai nút mờ đi và bấm `Lắc` lần nữa không làm gì.

## Tư duy

**Dựng khối bằng hai tầng.** Mỗi mặt là một tấm phẳng. Để đặt tấm lên "bức tường" của khối cần hai việc **theo thứ tự**: (1) xoay tấm cho **mặt nó hướng đúng phía** (mặt trên: `rotate-x-90`), (2) đẩy tấm ra khỏi tâm theo hướng **nó vừa quay tới**, bằng nửa cạnh khối (`translate-z-16` = 64px, khối rộng 128px). Việc (2) chỉ đúng khi "phía trước của tấm" đã xoay theo tấm. Vì vậy cần hai phần tử lồng nhau: lớp ngoài xoay (`rotate-*`), lớp trong đẩy (`translate-z-16`), giống ngôi nhà bài 011.

**Bẫy 1: dồn xoay và đẩy vào một phần tử.** Tailwind v4 ghi `rotate-x-90` vào thuộc tính `transform`, còn `translate-z-16` vào thuộc tính riêng `translate` (mở DevTools, bảng Styles của phần tử để tự kiểm chứng). Theo quy định CSS, thuộc tính `translate` luôn được áp dụng **sau cùng, theo hệ trục của phần tử cha** (không theo hệ trục đã xoay). Nghĩa là tấm xoay xong thì bị đẩy dọc trục `z` của khối, không phải dọc "phía trước của chính nó". Kết quả: các tấm nằm ngang ló ra ở **mặt trước** khối, cắt ngang chữ số. Muốn "xoay rồi đẩy theo hướng đã xoay" thì phải tách hai lớp như trên.

**Bẫy 2: lớp giữa quên `transform-3d`.** Nếu lớp ngoài (xoay) không có `transform-3d`, nó **ép phẳng** mọi thứ bên trong: lớp trong không còn nằm trong không gian 3D chung, mặt trên hiện ra méo hoặc lật ngược như soi gương. Đây là cái bẫy bạn đã gặp ở bài 010 và 011, ở một tầng khác.

**Quay đến một mặt: đừng đưa góc đích thẳng vào.** Để thấy mặt số 2 (mặt trên) hướng về phía mình cần quay khối `rotateX(-90deg)`; mặt 3 (bên phải) cần `rotateY(-90deg)`. Bảng `faceAngles` ghi góc cho từng mặt. Nhưng nếu mỗi lần lắc chỉ ghi `--rx` và `--ry` đúng bằng góc đích, hai lần liên tiếp ra cùng một mặt thì **giá trị không đổi** nên không có chuyển động, và `transitionend` không bao giờ bắn: nút bị khoá mãi. Cách chữa: cộng thêm `spins * 720` độ (hai vòng đầy, mỗi lần lắc tăng `spins`). Quay thêm trọn vòng không đổi mặt cuối cùng mà luôn khác giá trị cũ, nên luôn có chuyển động và khối xoay trọn vài vòng cho đẹp.

**Biết khi nào xoay xong.** Trình duyệt bắn sự kiện `transitionend` khi một `transition` kết thúc. Nó **nổi bọt** từ phần tử con lên và bắn **cho từng thuộc tính** đổi, nên phải lọc: chỉ nhận khi `event.target === cube` và `event.propertyName === 'transform'`.

**Bẫy JS: `prefers-reduced-motion`.** Người bật chế độ giảm chuyển động thì `motion-reduce:transition-none` làm khối nhảy thẳng tới mặt đích, **không có transition nên không có `transitionend`**. Nếu chỉ chờ sự kiện, nút `Lắc` bị khoá mãi. Cách chữa: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` cho biết người dùng có đang bật chế độ này không; nếu có, gọi luôn hàm kết thúc thay vì chờ.

**Không khoá nút bằng `disabled`.** Giống bài 016: nút bị `disabled` mất focus, người dùng bàn phím bị văng ra đầu trang. Ta giữ nút bình thường, dùng biến `rolling` bỏ qua click, và chỉ làm nút **mờ đi** bằng `data-rolling`.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Sáu mặt, khối 3D (`transform-3d`, `rotate-*`, `translate-z-16`), nhìn từ trên (`perspective-origin-top`) | Chọn mặt ngẫu nhiên, ghi `--rx` và `--ry` bằng `style.setProperty` |
| Khối quay theo biến (`rotate-x-(--rx) rotate-y-(--ry)`, `transition-transform duration-1000`) | Chờ `transitionend`, rồi ghi kết quả |
| Thanh thống kê dài theo biến (`w-(--pct)`) | Tính phần trăm, ghi `--pct` cho từng thanh |
| Nút mờ khi đang lắc (`group-data-rolling:opacity-50`) | Bật/tắt `data-rolling` bằng `toggleAttribute` |

JS không thêm hoặc gỡ class, không đặt `style.transform`, chỉ ghi **biến CSS**. JS chỉ tìm phần tử bằng `data-*`.

## Ôn lại

- Bài 011 (`bai-011-xem-can-ho-3d`): hai tầng xoay và đẩy, `style.setProperty` ghi `--angle`, `rotate-y-(--x)`.
- Bài 010 (`bai-010-the-tu-vung-lat`): `transform-3d`, `backface-hidden`, bẫy thiếu `preserve-3d`.
- Bài 015 (`bai-015-theo-doi-uong-nuoc`): `reduce`, `toFixed`, `slice(-5)`, `--pct`, `toggleAttribute(tên, force)`.
- Bài 016 (`bai-016-bang-viec-the-dan`): tránh mất focus khi khoá nút.
- Bài 012: `Object.entries` và `forEach` trên đối tượng; bài 006: `Array.from`.
- Bài 018 (`bai-018-ket-sat-ma-pin`): chuỗi mẫu trong selector, bản lề `origin-*`.

## Gợi ý từng bước

> Starter đã điền sẵn: nền, tiêu đề, khung cảnh (`flex h-64 perspective-distant`), khối (`relative size-32 transform-3d rotate-x-(--rx) rotate-y-(--ry) transition-transform duration-1000 motion-reduce:transition-none` kèm `style="--rx: 0deg; --ry: 0deg"`), **bốn mặt đầu** (trước 1, sau 6, phải 3, trái 4) đã có đủ lớp xoay và lớp đẩy, vẻ ngoài của sáu mặt (nền trắng, bo góc, chữ số lớn), kết quả, hai nút (`group-data-rolling:opacity-50`), dòng lịch sử và sáu thanh thống kê (`w-(--pct)`). **Hai mặt cuối** (mặt 2 là mặt trên, mặt 5 là mặt dưới) chỉ có `absolute inset-0` ở lớp ngoài và vẻ ngoài ở lớp trong; chưa có xoay, đẩy và `transform-3d`.

1. **Làm quen HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Đọc các thuộc tính: `data-app` (thẻ `<main>`, sẽ nhận `data-rolling`), `data-cube` (có `style="--rx: 0deg; --ry: 0deg"` làm giá trị đầu cho biến), sáu `data-face="1"`..`"6"` (mỗi mặt là một lớp ngoài `absolute inset-0` bọc một lớp trong), `data-result` (có `role="status"`), `data-roll`, `data-clear`, `data-history`, `data-stats` với sáu `data-row="1"`..`"6"` mỗi hàng có `data-fill` (kèm `style="--pct: 0%"`) và `data-count`. Kiểm tra: thấy khối phẳng, chữ số 1; mặt 2 và 5 chưa hiện đúng chỗ.

2. **CSS: nhìn từ trên xuống.** **Bạn làm:** trên `<div>` khung cảnh (thẻ có `perspective-distant`, cha trực tiếp của `data-cube`) thêm `perspective-origin-top`. `perspective-distant` đặt "mắt" cách khối 1200px; `perspective-origin-top` đặt **vị trí mắt** ở giữa mép trên khung cảnh thay vì chính giữa, nên bạn nhìn khối từ phía trên. Kiểm tra: chưa thấy gì khác biệt lớn vì mặt trên chưa dựng; sang bước 3 sẽ thấy một dải mỏng của mặt trên ở cạnh trên của khối.

3. **CSS: dựng mặt trên và mặt dưới, qua hai cái bẫy.** **Bạn làm:** trên **2 mặt cuối** (mặt 2 rồi mặt 5), chép theo bốn mặt đầu. Làm **theo đúng thứ tự** để gặp cả hai bẫy ở mặt 2 (mặt trên): (a) thêm `rotate-x-90 translate-z-16` vào **lớp ngoài** (`<div class="absolute inset-0">`): các tấm nằm ngang ló ra ở mặt trước và cắt ngang chữ số 1: đó là bẫy 1. (b) Chuyển `translate-z-16` xuống **lớp trong** (`<div data-face="2">`) nhưng chưa thêm `transform-3d`: vào DevTools, ở thẻ `data-cube` sửa `--rx` thành `-90deg`; mặt 2 hiện ra **lật ngược như soi gương**: bẫy 2. (c) Thêm `transform-3d` vào lớp ngoài: mặt 2 hiện đúng chiều. Mặt 5 (mặt dưới) làm giống hệt nhưng góc là `-rotate-x-90`. Kiểm tra: ở trạng thái đầu thấy một dải mỏng mặt trên ở cạnh trên của khối; đặt `--rx` lần lượt `-90deg`, `90deg` thì thấy số 2, số 5 đúng chiều ngay giữa; đặt `--ry` `-90deg`, `90deg`, `180deg` (với `--rx: 0deg`) thì ra 3, 4, 6.

4. **JS: lấy phần tử, bảng góc và số ngẫu nhiên.** **Bạn làm:** toàn bộ JS. Lấy `app`, `cube`, `rollButton`, `clearButton`, `result`, `historyText`, `stats` bằng `querySelector` theo `data-*` (đặt tên `historyText` để không trùng `window.history`). Khai báo `faceAngles` là **đối tượng** có khoá `1` đến `6`, mỗi giá trị là `{ x, y }` ghi góc xoay khối để mặt đó hướng về người xem: `1:{0,0}`, `2:{-90,0}`, `3:{0,-90}`, `4:{0,90}`, `5:{90,0}`, `6:{0,180}` (bạn đã tự kiểm chứng bảng này ở bước 3). Khai báo `const rolls = []`, `let rolling = false`, `let pendingValue = 0`, `let spins = 0`. Số ngẫu nhiên từ 1 đến 6: `Math.floor(Math.random() * 6) + 1`. **`Math.random()`** trả số thập phân ngẫu nhiên **từ 0 tới dưới 1** (không bao giờ bằng 1); nhân 6 được `[0, 6)`, `Math.floor` cắt phần thập phân thành 0–5, cộng 1 thành 1–6. Thử trong Console gọi biểu thức đó nhiều lần. Kiểm tra: `faceAngles[3].y` ra `-90`.

5. **JS: ghi góc quay bằng biến CSS.** **Bạn làm:** toàn bộ JS. Viết `roll()`: nếu `rolling` thì `return`. Đặt `rolling = true`, `app.toggleAttribute('data-rolling', true)`, `pendingValue` là số ngẫu nhiên, `spins += 1`, `angle = faceAngles[pendingValue]`, rồi ``cube.style.setProperty('--rx', `${angle.x + spins * 720}deg`)`` và tương tự cho `--ry` (`setProperty(tên, giá trị)` ghi một biến CSS vào thuộc tính `style` của phần tử; tên phải bắt đầu bằng `--`). Ghi `result.textContent = 'Đang lắc...'`. Gắn `click` cho `rollButton`. **Thử bẫy:** tạm bỏ phần `+ spins * 720`: bấm `Lắc` liên tiếp, khối quay thẳng tới góc đích, không xoay nhiều vòng, và khi ra cùng mặt hai lần liên tiếp thì đứng yên (sẽ gây kẹt ở bước 6). Trả lại `spins * 720`. Kiểm tra: bấm `Lắc` thì khối xoay mấy vòng rồi dừng đúng mặt; dòng "Đang lắc..." chưa đổi (bước sau mới làm).

6. **JS: chờ xoay xong bằng `transitionend`, và chữa bẫy giảm chuyển động.** **Bạn làm:** toàn bộ JS. Viết `finishRoll()`: `rolling = false`, `app.toggleAttribute('data-rolling', false)`, `rolls.push(pendingValue)`, ghi ``result.textContent = `Kết quả: ${pendingValue}` ``. Gắn `transitionend` cho `cube`; trong hàm xử lý, `return` sớm nếu `!rolling || event.target !== cube || event.propertyName !== 'transform'`, không thì gọi `finishRoll()`. (`event.propertyName` là tên thuộc tính CSS vừa kết thúc chuyển động; `||` đúng khi một trong các vế đúng.) Để chữa bẫy giảm chuyển động: khai báo `const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')`; **`matchMedia(truy vấn)`** trả một đối tượng, thuộc tính `.matches` là `true` nếu truy vấn đang đúng. Cuối `roll()` thêm: nếu `reduceMotion.matches` thì `finishRoll()`. Kiểm tra: lắc thì sau 1 giây dòng "Kết quả: N" hiện đúng số mặt đang hướng về bạn; bật `prefers-reduced-motion: reduce` trong DevTools (Rendering) thì kết quả hiện ngay và nút không kẹt; thử bỏ nhánh `reduceMotion` để thấy nút kẹt thế nào.

7. **JS: thống kê.** **Bạn làm:** toàn bộ JS. Khai báo `const counts = Array.from({ length: 6 }, ...)`: `Array.from` có **tham số thứ hai** là hàm biến đổi, nhận từng phần tử rồi trả giá trị mới; ở đây hàm luôn trả `0`, nên ra mảng sáu số `0` (đối tượng `{ length: 6 }` giả làm một "danh sách có 6 chỗ"). Trong `finishRoll` thêm `counts[pendingValue - 1] += 1` rồi gọi `renderStats()`. Viết `renderStats()`: `total = rolls.length`, `sum` bằng `rolls.reduce(hàm, 0)` (bài 015). Với mỗi phần tử của `counts` (`forEach` kèm vị trí `index`), tìm hàng ``stats.querySelector(`[data-row="${index + 1}"]`)``, ghi `[data-count]`, tính `percent = total === 0 ? 0 : Math.round((count / total) * 100)` và `[data-fill]` bằng ``style.setProperty('--pct', `${percent}%`)``. Nếu `total === 0` thì xoá chữ ở `historyText` rồi `return`; không thì ghi `Gần đây: ${rolls.slice(-8).join(', ')}. Tổng ${sum}, trung bình ${(sum / total).toFixed(2)}.` (`slice(-8)` lấy tối đa 8 phần tử cuối mảng; `join(', ')` nối các phần tử thành chuỗi với dấu phân cách; `toFixed(2)` làm tròn thành chuỗi hai chữ số thập phân). Gọi `renderStats()` cuối file. Kiểm tra: lắc nhiều lần, các thanh dài ra theo tỉ lệ, số bên phải đúng, dòng "Gần đây" chỉ giữ 8 lần cuối.

8. **JS: xoá thống kê.** **Bạn làm:** toàn bộ JS. Viết `clearStats()`: nếu `rolling` thì `return` (không xoá lúc đang lắc); `rolls.length = 0` (gán `length` bằng 0 **cắt cụt** mảng thành rỗng, giữ nguyên chính mảng đó vì nó khai báo bằng `const`); `counts.fill(0)` (`fill(giá trị)` ghi cùng một giá trị vào mọi vị trí, sửa trực tiếp mảng); đặt lại `result.textContent = 'Hãy lắc xúc xắc.'`; gọi `renderStats()`. Gắn `click` cho `clearButton`. Kiểm tra: xoá thì mọi thanh về 0, dòng lịch sử trống; xoá trong lúc đang xoay thì không có gì xảy ra; lắc tiếp sau khi xoá vẫn đếm đúng từ 1.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương (gần đúng) |
|---|---|
| `perspective-distant` | `perspective: 1200px` (đặt ở phần tử cha) |
| `perspective-origin-top` | `perspective-origin: top` (vị trí mắt ở giữa mép trên) |
| `transform-3d` | `transform-style: preserve-3d` |
| `rotate-x-(--rx) rotate-y-(--ry)` | `transform: rotateX(var(--rx)) rotateY(var(--ry))` |
| `rotate-x-90`, `-rotate-x-90` | `transform: rotateX(90deg)`, `rotateX(-90deg)` |
| `translate-z-16` | `translate: 0 0 64px` (thuộc tính `translate` riêng, không nằm trong `transform`) |
| `size-32` | `width: 128px; height: 128px` |
| `transition-transform duration-1000` | `transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1)` |
| `w-(--pct)` | `width: var(--pct)` |
| `group-data-rolling:opacity-50` | `[data-app][data-rolling] .button { opacity: 0.5 }` |

## Tự kiểm tra

- [ ] Sáu mặt nằm đúng chỗ: đặt tay `--rx`/`--ry` trong DevTools như bước 3 thấy 2 và 5 đúng chiều, 3, 4, 6 đúng; không có mặt nào lật ngược hay ló ra.
- [ ] Lắc 20 lần: mặt hiện ở giữa luôn trùng với "Kết quả"; thanh thống kê tỉ lệ đúng; số cột phải cộng bằng số lần lắc.
- [ ] Lắc đúng hai lần liên tiếp ra cùng một mặt: khối vẫn xoay và kết quả vẫn ghi (không kẹt).
- [ ] Trong lúc xoay bấm `Lắc` thêm hoặc `Xoá thống kê`: không có gì thay đổi; hai nút mờ đi rồi sáng lại; focus vẫn nằm ở nút vừa bấm (nhấn Space/Enter lắc nhiều lần liên tục bằng bàn phím).
- [ ] DevTools: tắt `transform-3d` ở một lớp ngoài thì mặt tương ứng lật; thay `translate-z-16` về lớp ngoài thì tấm ló ra mặt trước; bỏ `perspective-origin-top` thì mất dải mặt trên.
- [ ] Bật `prefers-reduced-motion: reduce`: khối nhảy tức thì, kết quả hiện ngay, nút không kẹt.
- [ ] Tự hỏi: vì sao phải tách lớp xoay và lớp đẩy? Vì sao cộng `spins * 720` mà mặt cuối không đổi? Vì sao nếu chỉ chờ `transitionend` thì người bật giảm chuyển động bị kẹt? Vì sao phải lọc `event.target !== cube`?

## Thử thách thêm

1. **Chấm tròn thật.** Thay chữ số bằng chấm: mỗi mặt là lưới `grid-cols-3 grid-rows-3`, mỗi chấm `size-4 rounded-full bg-slate-800` đặt ô bằng `col-start-*`/`row-start-*`. Gợi ý: nhớ giữ nguyên `data-face` để JS không đổi.
2. **Hai viên xúc xắc.** Nhân đôi khối (mỗi khối một biến `--rx`/`--ry` riêng) và tính tổng hai viên. Gợi ý: đổi `cube` thành mảng `[data-cube]` bằng `querySelectorAll`, chờ **cả hai** `transitionend` rồi mới `finishRoll()` (đếm số khối đã xong).

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
		<title>Bài 019 - Xúc xắc 3D</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<main data-app class="page">
			<h1 class="title">Xúc xắc 3D</h1>
			<div class="scene">
				<div data-cube style="--rx: 0deg; --ry: 0deg" class="cube">
					<div class="turn turn-front">
						<div data-face="1" class="face">1</div>
					</div>
					<div class="turn turn-back">
						<div data-face="6" class="face">6</div>
					</div>
					<div class="turn turn-right">
						<div data-face="3" class="face">3</div>
					</div>
					<div class="turn turn-left">
						<div data-face="4" class="face">4</div>
					</div>
					<div class="turn turn-top">
						<div data-face="2" class="face">2</div>
					</div>
					<div class="turn turn-bottom">
						<div data-face="5" class="face">5</div>
					</div>
				</div>
			</div>
			<p data-result role="status" class="result">Hãy lắc xúc xắc.</p>
			<div class="actions">
				<button type="button" data-roll class="button button-main">Lắc</button>
				<button type="button" data-clear class="button">Xoá thống kê</button>
			</div>
			<p data-history class="history"></p>
			<ul data-stats class="stats">
				<li data-row="1" class="row">
					<span class="row-label">Mặt 1</span>
					<span class="bar"><span data-fill style="--pct: 0%" class="bar-fill"></span></span>
					<span data-count class="row-count">0</span>
				</li>
				<li data-row="2" class="row">
					<span class="row-label">Mặt 2</span>
					<span class="bar"><span data-fill style="--pct: 0%" class="bar-fill"></span></span>
					<span data-count class="row-count">0</span>
				</li>
				<li data-row="3" class="row">
					<span class="row-label">Mặt 3</span>
					<span class="bar"><span data-fill style="--pct: 0%" class="bar-fill"></span></span>
					<span data-count class="row-count">0</span>
				</li>
				<li data-row="4" class="row">
					<span class="row-label">Mặt 4</span>
					<span class="bar"><span data-fill style="--pct: 0%" class="bar-fill"></span></span>
					<span data-count class="row-count">0</span>
				</li>
				<li data-row="5" class="row">
					<span class="row-label">Mặt 5</span>
					<span class="bar"><span data-fill style="--pct: 0%" class="bar-fill"></span></span>
					<span data-count class="row-count">0</span>
				</li>
				<li data-row="6" class="row">
					<span class="row-label">Mặt 6</span>
					<span class="bar"><span data-fill style="--pct: 0%" class="bar-fill"></span></span>
					<span data-count class="row-count">0</span>
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
	font-size: inherit;
	font-weight: inherit;
}

.site {
	min-height: 100vh;
	background: #1e1b4b;
	color: #ffffff;
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.page {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	max-width: 448px;
	margin: 0 auto;
	padding: 32px 16px;
}

.title {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 700;
}

.scene {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 256px;
	perspective: 1200px;
	perspective-origin: top;
}

.cube {
	position: relative;
	width: 128px;
	height: 128px;
	transform-style: preserve-3d;
	transform: rotateX(var(--rx)) rotateY(var(--ry));
	transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}

.turn {
	position: absolute;
	inset: 0;
	transform-style: preserve-3d;
}

.turn-back {
	transform: rotateY(180deg);
}

.turn-right {
	transform: rotateY(90deg);
}

.turn-left {
	transform: rotateY(-90deg);
}

.turn-top {
	transform: rotateX(90deg);
}

.turn-bottom {
	transform: rotateX(-90deg);
}

.face {
	translate: 0 0 64px;
	display: grid;
	place-items: center;
	width: 100%;
	height: 100%;
	border: 2px solid #cbd5e1;
	border-radius: 12px;
	background: #ffffff;
	font-size: 3.75rem;
	line-height: 1;
	font-weight: 800;
	color: #1e293b;
}

.result {
	min-height: 28px;
	font-size: 1.125rem;
	line-height: 1.75rem;
	font-weight: 600;
	color: #fcd34d;
}

.actions {
	display: flex;
	gap: 12px;
}

.button {
	padding: 12px 16px;
	border-radius: 12px;
	background: rgb(255 255 255 / 0.15);
	font-weight: 600;
}

.button:hover {
	background: rgb(255 255 255 / 0.25);
}

.button-main {
	padding: 12px 24px;
	background: #fbbf24;
	color: #1e1b4b;
	font-weight: 700;
}

.button-main:hover {
	background: #fcd34d;
}

.button:focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}

[data-app][data-rolling] .button {
	opacity: 0.5;
}

.history {
	min-height: 24px;
	font-size: 0.875rem;
	line-height: 1.25rem;
	color: rgb(255 255 255 / 0.7);
}

.stats {
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
}

.row {
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 0.875rem;
	line-height: 1.25rem;
}

.row-label {
	width: 48px;
	flex-shrink: 0;
	color: rgb(255 255 255 / 0.7);
}

.bar {
	flex: 1;
	height: 8px;
	border-radius: 9999px;
	background: rgb(255 255 255 / 0.15);
}

.bar-fill {
	display: block;
	width: var(--pct);
	height: 100%;
	border-radius: 9999px;
	background: #fbbf24;
	transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.row-count {
	width: 24px;
	text-align: right;
	font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
	.cube,
	.bar-fill {
		transition: none;
	}
}
```

`solution/script.js`

```js
const app = document.querySelector('[data-app]');
const cube = document.querySelector('[data-cube]');
const rollButton = document.querySelector('[data-roll]');
const clearButton = document.querySelector('[data-clear]');
const result = document.querySelector('[data-result]');
const historyText = document.querySelector('[data-history]');
const stats = document.querySelector('[data-stats]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const faceAngles = {
	1: { x: 0, y: 0 },
	2: { x: -90, y: 0 },
	3: { x: 0, y: -90 },
	4: { x: 0, y: 90 },
	5: { x: 90, y: 0 },
	6: { x: 0, y: 180 },
};
const rolls = [];
const counts = Array.from({ length: 6 }, function () {
	return 0;
});
let rolling = false;
let pendingValue = 0;
let spins = 0;

function renderStats() {
	const total = rolls.length;
	const sum = rolls.reduce(function (acc, value) {
		return acc + value;
	}, 0);
	counts.forEach(function (count, index) {
		const row = stats.querySelector(`[data-row="${index + 1}"]`);
		const percent = total === 0 ? 0 : Math.round((count / total) * 100);
		row.querySelector('[data-count]').textContent = count;
		row.querySelector('[data-fill]').style.setProperty('--pct', `${percent}%`);
	});
	if (total === 0) {
		historyText.textContent = '';
		return;
	}
	historyText.textContent = `Gần đây: ${rolls.slice(-8).join(', ')}. Tổng ${sum}, trung bình ${(sum / total).toFixed(2)}.`;
}

function finishRoll() {
	rolling = false;
	app.toggleAttribute('data-rolling', false);
	rolls.push(pendingValue);
	counts[pendingValue - 1] += 1;
	result.textContent = `Kết quả: ${pendingValue}`;
	renderStats();
}

function roll() {
	if (rolling) {
		return;
	}
	rolling = true;
	app.toggleAttribute('data-rolling', true);
	pendingValue = Math.floor(Math.random() * 6) + 1;
	spins += 1;
	const angle = faceAngles[pendingValue];
	cube.style.setProperty('--rx', `${angle.x + spins * 720}deg`);
	cube.style.setProperty('--ry', `${angle.y + spins * 720}deg`);
	result.textContent = 'Đang lắc...';
	if (reduceMotion.matches) {
		finishRoll();
	}
}

function clearStats() {
	if (rolling) {
		return;
	}
	rolls.length = 0;
	counts.fill(0);
	result.textContent = 'Hãy lắc xúc xắc.';
	renderStats();
}

cube.addEventListener('transitionend', function (event) {
	if (!rolling || event.target !== cube || event.propertyName !== 'transform') {
		return;
	}
	finishRoll();
});

rollButton.addEventListener('click', roll);
clearButton.addEventListener('click', clearStats);

renderStats();
```

</details>

### Giải thích từng hàm

- `renderStats()`: hàm tự đặt, ghi số lần, độ dài thanh và dòng lịch sử từ mảng `rolls` và `counts`.
- `finishRoll()`: hàm tự đặt, kết thúc một lần lắc: mở lại `rolling`, ghi kết quả vào `rolls` và `counts`, vẽ lại thống kê.
- `roll()`: hàm tự đặt, chọn mặt ngẫu nhiên và ghi góc quay mới vào `--rx`, `--ry`; nếu bật giảm chuyển động thì kết thúc ngay.
- `clearStats()`: hàm tự đặt, đưa thống kê về 0 (không làm gì khi đang lắc).
- `window.matchMedia('(prefers-reduced-motion: reduce)')`: nhận một truy vấn media, trả đối tượng có `.matches` là `true`/`false` cho biết truy vấn đó đang đúng không; giá trị đọc được mỗi lần dùng nên theo kịp khi người dùng đổi cài đặt.
- `faceAngles[pendingValue]`: đối tượng dùng như bảng tra; `faceAngles[3]` ra `{ x: 0, y: -90 }`. `angle.x`: đọc thuộc tính `x`.
- `Math.floor(Math.random() * 6) + 1`: `Math.random()` trả số thập phân từ 0 tới dưới 1; nhân 6 rồi `Math.floor` làm tròn xuống ra 0–5; `+ 1` thành 1–6.
- `cube.style.setProperty('--rx', `${...}deg`)`: ghi một biến CSS vào thuộc tính `style` của phần tử. Tham số thứ nhất là tên biến (bắt đầu bằng `--`), thứ hai là giá trị chuỗi.
- Chuỗi mẫu `` `${angle.x + spins * 720}deg` ``: dấu huyền; `${...}` chèn kết quả biểu thức; `spins * 720` là số độ quay thêm (hai vòng đầy mỗi lần lắc).
- `cube.addEventListener('transitionend', hàm)`: lắng nghe sự kiện báo một `transition` đã kết thúc; sự kiện nổi bọt từ phần tử con. `event.target`: phần tử gây ra sự kiện. `event.propertyName`: tên thuộc tính CSS vừa chuyển xong (ở đây là `'transform'`).
- `!rolling || event.target !== cube || event.propertyName !== 'transform'`: `||` đúng khi **một** trong các vế đúng; `!==` là khác chặt; `!` đảo đúng sai. Cả điều kiện đúng thì `return` bỏ qua sự kiện.
- `app.toggleAttribute('data-rolling', true)`: `toggleAttribute(tên, force)`: `force` đúng thì thêm thuộc tính, sai thì gỡ; bỏ `force` thì đảo trạng thái.
- `rolls.push(pendingValue)`: thêm một phần tử vào **cuối** mảng. `counts[pendingValue - 1] += 1`: tăng phần tử tại vị trí đó lên 1 (mảng đếm từ 0 nên mặt 1 ở vị trí 0).
- `Array.from({ length: 6 }, function () { return 0; })`: tạo mảng 6 phần tử; tham số thứ hai là hàm biến đổi, ở đây luôn trả `0`. Khác `Array.from(danhSách)` ở chỗ không cần danh sách có sẵn, chỉ cần một đối tượng có `length`.
- `rolls.reduce(function (acc, value) { return acc + value; }, 0)`: gộp mảng thành một giá trị: `acc` là kết quả đang cộng dồn, bắt đầu từ `0` (tham số thứ hai).
- `counts.forEach(function (count, index) { ... })`: chạy hàm cho từng phần tử, tham số thứ hai là vị trí.
- ```stats.querySelector(`[data-row="${index + 1}"]`)```: chuỗi mẫu dựng selector thuộc tính có giá trị biến, trả hàng tương ứng.
- `total === 0 ? 0 : Math.round((count / total) * 100)`: toán tử ba ngôi; tránh chia cho 0. `Math.round(x)` làm tròn tới số nguyên gần nhất.
- `rolls.slice(-8).join(', ')`: `slice(-8)` trả mảng mới gồm tối đa 8 phần tử cuối; `join(', ')` nối thành chuỗi, phần tử cách nhau bằng dấu phân cách.
- `(sum / total).toFixed(2)`: `toFixed(n)` trả **chuỗi** số làm tròn với `n` chữ số thập phân.
- `rolls.length = 0`: gán `length` bằng 0 cắt cụt mảng thành rỗng nhưng giữ nguyên chính mảng đó (vì `const`, ta không gán mảng mới được). `counts.fill(0)`: ghi `0` vào mọi vị trí của mảng và sửa trực tiếp mảng.
- `if (rolling) { return; }`: return sớm: đang lắc thì thoát hàm ngay, bỏ qua click.
- `addEventListener('click', roll)`: truyền tên hàm **không có `()`** để trình duyệt tự gọi khi có click.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

| Class Tailwind | CSS trong `style.css` |
|---|---|
| `perspective-distant perspective-origin-top` trên khung cảnh | `.scene { perspective: 1200px; perspective-origin: top }` |
| `relative size-32 transform-3d rotate-x-(--rx) rotate-y-(--ry)` trên khối | `.cube { position: relative; width: 128px; height: 128px; transform-style: preserve-3d; transform: rotateX(var(--rx)) rotateY(var(--ry)) }` |
| `absolute inset-0 transform-3d rotate-y-90` trên lớp ngoài | `.turn { position: absolute; inset: 0; transform-style: preserve-3d }` và `.turn-right { transform: rotateY(90deg) }` |
| `translate-z-16` trên lớp trong | `.face { translate: 0 0 64px }` |
| `transition-transform duration-1000 motion-reduce:transition-none` | `.cube { transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1) }` và `@media (prefers-reduced-motion: reduce) { .cube { transition: none } }` |
| `w-(--pct) transition-[width] duration-500` | `.bar-fill { width: var(--pct); transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1) }` |
| `group-data-rolling:opacity-50` | `[data-app][data-rolling] .button { opacity: 0.5 }` |
| `grid size-full place-items-center rounded-xl border-2 border-slate-300 bg-white` | `.face { display: grid; width: 100%; height: 100%; place-items: center; border: 2px solid #cbd5e1; border-radius: 12px; background: #ffffff }` |

Khác biệt nhỏ: Tailwind ghi `rotate-x-*` vào `transform` qua biến `--tw-rotate-x`; lời giải viết thẳng `transform: rotateX(...)`. Cả hai nằm trong `transform` nên cùng cho kết quả. Trong lời giải, nút chính và nút phụ dùng hai class (`button` và `button-main`) thay cho chuỗi class dài ở bản Tailwind.
