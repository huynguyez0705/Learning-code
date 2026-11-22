# Bài 009: Quiz trên thẻ kính mờ và bẫy lớp nền ẩn

Ngày học 4, bài 3/3, cấp 1, chủ đề CSS: Glassmorphism (ứng dụng quiz), độ khó ★★★★☆, thời gian ước tính 45 phút.

> Trước khi làm, mở PowerShell ở thư mục `daily-css-js` và chạy `npm run dev`. `starter/index.html` đã nối sẵn `<link rel="stylesheet" href="../../build/tailwind.css" />`; `starter/script.js` đang rỗng.
>
> Bạn làm bằng **Tailwind CSS v4**, còn lời giải (`solution/`) viết bằng **CSS thuần** trong `solution/style.css` để bạn đối chiếu mỗi class ra thuộc tính CSS nào.
>
> **Lưu dữ liệu:** bài này chưa dùng `localStorage`, cookie hay server. Điểm và câu hỏi hiện tại nằm trong biến JS; tải lại trang là làm lại từ câu 1. Đây là hành vi đúng của bài.

## Mục tiêu

- Bộ quiz 4 câu hiện **một câu mỗi lần**. Các đáp án được dựng từ **một** thẻ `<template>` bằng JS, không viết tay bốn lần trong HTML.
- Bấm "Trả lời" mà chưa chọn đáp án thì hiện "Hãy chọn một đáp án trước."; chọn rồi thì đáp án đúng tô xanh lá, đáp án bạn chọn sai tô đỏ hồng, các ô bị khoá, nút đổi thành "Câu tiếp" (câu cuối là "Xem kết quả").
- Sau câu cuối hiện màn hình kết quả "Bạn đúng x/4 câu" và nút "Làm lại" đưa mọi thứ về câu 1.
- Focus luôn nằm ở nơi hợp lý: sau khi khoá ô thì về nút bấm, sang câu mới thì vào câu hỏi, sang màn kết quả thì vào tiêu đề kết quả.
- Thẻ quiz là **kính mờ** thật sự: nhìn thấy hai khối màu phía sau bị làm nhoè qua thẻ. Tự gặp và sửa cái bẫy khiến hai khối màu biến mất.

## Kết quả mong đợi

Nền toàn trang xanh đen. Hai hình tròn gradient (hồng cam ở góc trên trái, xanh lam chàm ở dưới phải) nằm sau, một phần bị thẻ che. Thẻ quiz bo góc ở giữa, nền trắng mờ 15%, viền trắng nhạt, ánh sáng viền trong ở cạnh trên; phần hình tròn nằm sau thẻ bị nhoè mềm còn phần ngoài thẻ sắc nét. Bên trong là "Câu 1/4", câu hỏi to, bốn ô đáp án mờ có nút tròn hồng. Chọn đáp án đúng: ô đó xanh lá nhạt; chọn sai: ô bạn chọn đỏ hồng, ô đúng xanh lá.

## Tư duy

**Kính mờ là hai thứ ghép lại.** (1) Một lớp nền **trong suốt một phần** (`bg-white/15`), để màu phía sau lọt qua. (2) Một bộ lọc **chỉ tác động lên thứ nằm phía sau** phần tử (`backdrop-blur-md`). Khác `blur-md` làm nhoè chính phần tử và cả chữ trong nó: `backdrop-blur-md` giữ chữ nét, chỉ làm nhoè cái nhìn xuyên qua tấm kính. Giống kính phòng tắm mờ: bạn vẫn thấy rõ vết bẩn trên kính, còn người đứng sau kính thì nhoè.

**Kính mờ cần có thứ để làm mờ.** Nếu phía sau chỉ là một màu phẳng thì blur không thấy khác gì. Vì vậy bài dựng hai hình tròn gradient (kỹ thuật bài 007) làm "phông" phía sau.

**Bẫy CSS: lớp có `z-index` âm chui xuống dưới cả nền của cha.** Hai hình tròn được đặt `-z-10` để nằm dưới thẻ. Nhưng `z-index` âm không có nghĩa là "dưới anh em của tôi", mà là "dưới mọi thứ trong **cùng ngữ cảnh xếp chồng** (stacking context)", kể cả nền của chính khối cha. Khối cha `relative bg-slate-900` không tạo ngữ cảnh xếp chồng riêng, nên hai hình tròn chui xuống dưới nền xanh đen của nó và biến mất hoàn toàn: trang chỉ còn nền xanh đen, `backdrop-blur-md` trông như vô hiệu. Sửa bằng `isolate` (`isolation: isolate`): bắt khối cha tạo ngữ cảnh xếp chồng riêng. Từ đó `-z-10` chỉ có nghĩa "dưới nội dung bên trong khối cha, nhưng trên nền của nó". Bạn đã gặp ngữ cảnh xếp chồng ở bài 002 (do `translate`); lần này tự tạo chủ động bằng `isolate`.

**Có phương án dự phòng.** Trình duyệt cũ không hiểu `backdrop-filter` thì thẻ trong suốt 15% trên nền tối sẽ khó đọc. `supports-[backdrop-filter]:` chỉ áp dụng khi trình duyệt có tính năng đó; ta đặt nền đặc `bg-slate-800/90` làm mặc định, và chỉ chuyển sang nền trong `bg-white/15` khi blur dùng được.

**JS: `FormData` bỏ qua trường bị khoá.** `new FormData(form)` gom giá trị các ô của form **đang bật**. Một ô thuộc `<fieldset disabled>` bị bỏ qua. Vì vậy phải đọc đáp án bằng `FormData` **trước** khi khoá `fieldset`, nếu không sẽ luôn nhận `null`. Một bẫy nữa: khi `fieldset` bị khoá, ô radio đang giữ focus mất focus, phím Tab và Enter rơi về `<body>`; ta chuyển focus sang nút bấm ngay.

## Phân chia trách nhiệm CSS và JS

| Tailwind (CSS) | JS |
|---|---|
| Bố cục, viền, bóng, ánh sáng viền trong, hai hình tròn gradient, màu ô đáp án theo `data-state` đã dựng sẵn | Giữ mảng câu hỏi, chỉ số câu, điểm |
| Bạn thêm: nhoè nền phía sau (`backdrop-blur-md`) và nền dự phòng (`supports-[...]:`) | Dựng đáp án từ `<template>`, đọc đáp án bằng `FormData` |
| Bạn thêm: `-z-10` cho hai hình tròn và `isolate` cho khối cha | Ghi `data-state` cho ô đúng/sai, `fieldset.disabled` |
| Chuyển giữa câu hỏi và kết quả theo `group-data-done:` | Bật/tắt `data-done` trên thẻ, chuyển focus |

JS không thêm/gỡ class giao diện, không đặt `style.*`, không tìm phần tử bằng class, không đọc đáp án từ chữ trên màn hình.

## Ôn lại

- Bài 002 (`bai-002-menu-ba-cham`): stacking context, `z-index`.
- Bài 007 (`bai-007-the-thoi-tiet`): gradient `bg-linear-to-br from-* to-*` (hai hình tròn), variant `data-[...]:`.
- Bài 008 (`bai-008-ke-dia-nhac`): `inset-shadow-*` (ánh sáng viền trong), `shadow-*`, `toggleAttribute(tên, true/false)`.
- Bài 005 (`bai-005-binh-luan-dong`): `submit`, `preventDefault`, `template.content.cloneNode(true)`.
- Bài 006 (`bai-006-gio-hang`): `disabled`, trả focus khi phần tử bị khoá, `Number`.

## Gợi ý từng bước

> Starter đã điền sẵn: nền khối cha (`bg-slate-900`), kích thước hai hình tròn và gradient của chúng, bố cục, bo góc, viền trắng mờ, bóng, ánh sáng viền trong của thẻ, nền dự phòng `bg-slate-800/90`, màu chữ, ô đáp án (kể cả màu theo `data-[state=...]:`), nút, viền focus, chuyển giữa câu hỏi và kết quả bằng `group-data-done:`. Thẻ chưa có kính mờ, và hai hình tròn chưa có `z-index`. Câu hỏi, đáp án và điểm do JS vẽ.

1. **Đọc HTML.** **Bạn làm:** không có, bước này đã điền sẵn hết. Ghi nhớ các `data-*`: `data-card`, `data-counter`, `data-question`, `data-form`, `data-fieldset`, `data-feedback`, `data-submit`, `data-score`, `data-done-title`, `data-restart`, và `<template data-option-template>` chứa một ô đáp án (`data-option`, `data-option-input`, `data-option-text`). Nhận ra: `fieldset` đang rỗng, đáp án sẽ do JS nhân bản từ template. Kiểm tra: mở trang chỉ thấy khung thẻ gần như trống; hai hình tròn chưa hiện rõ.

2. **JS: dữ liệu và dựng một câu hỏi.** **Bạn làm:** toàn bộ JS ở các bước 2, 3, 4, 8. Tạo mảng `questions` gồm 4 đối tượng `{ text, options, answer, note }` (`answer` là chỉ số đáp án đúng trong `options`, `note` là lời giải thích câu trả lời sai). Khai báo ba biến trạng thái `index`, `score`, `answered`. Viết `renderQuestion()`: ghi "Câu x/y" và nội dung câu hỏi bằng `textContent` và chuỗi mẫu, đặt `fieldset.disabled = false`, xoá đáp án cũ bằng `fieldset.replaceChildren()`, rồi với mỗi đáp án nhân bản template bằng `template.content.cloneNode(true)`, ghi `value` cho ô radio (`String(chỉ số)`) và chữ cho `[data-option-text]`, rồi `fieldset.append(...)`. `replaceChildren()` không đối số là xoá sạch mọi con của phần tử. `template.content.cloneNode(true)` trả một `DocumentFragment` là bản sao sâu (tham số `true` nghĩa là sao chép cả phần tử con); khi `append`, các phần tử trong mảnh đó được chuyển sang `fieldset`. Gọi `renderQuestion()` ở cuối file. Kiểm tra: tải trang thấy "Câu 1/4", câu hỏi và bốn ô đáp án; Tab và phím mũi tên chọn được radio; mỗi lần gọi lại `renderQuestion()` không bị nhân đôi đáp án.

3. **JS: kiểm tra đáp án bằng `FormData`.** Gắn `submit` lên `form` (`addEventListener('submit', handleSubmit)`), trong hàm gọi `event.preventDefault()` để trang không tải lại. Nếu `answered` đúng thì gọi `nextQuestion()` (bước 4), ngược lại gọi `checkAnswer()`. `checkAnswer()`: đọc `new FormData(form).get('answer')`: `get(tên)` trả chuỗi `value` của radio đang chọn, hoặc `null` nếu chưa chọn. Nếu `null`: ghi nhắc vào `feedback` rồi `return`. Còn lại: đổi bằng `Number`, so với `answer`; đúng thì tăng `score`; ghi `data-state="correct"` cho ô đúng và `"wrong"` cho ô sai bạn chọn (lấy các ô bằng `Array.from(fieldset.querySelectorAll('[data-option]'))` rồi truy theo chỉ số); **sau đó** mới `fieldset.disabled = true`, đặt `answered = true`, ghi nhận xét, đổi chữ nút ("Câu tiếp" hoặc "Xem kết quả" ở câu cuối), và `submit.focus()`. **Cái bẫy:** thử đổi thứ tự, khoá `fieldset` trước rồi mới đọc `FormData`: nhận `null` mãi. Thử bỏ `submit.focus()` rồi dùng bàn phím: sau khi khoá, focus rơi về đầu trang. Kiểm tra: bấm "Trả lời" khi chưa chọn thì có lời nhắc và không có ô nào bị tô; chọn đúng thì ô đó xanh, chọn sai thì ô sai đỏ hồng và ô đúng xanh; ô bị khoá không chọn lại được.

4. **JS: câu tiếp, kết quả, làm lại.** `nextQuestion()`: tăng `index`; nếu `index === questions.length` thì gọi `showDone()` rồi `return`; không thì `renderQuestion()` và `questionText.focus()` (tiêu đề câu hỏi có `tabindex="-1"` nên nhận focus bằng JS mà không nằm trong thứ tự Tab). `showDone()`: ghi điểm vào `[data-score]` bằng chuỗi mẫu, `card.toggleAttribute('data-done', true)` rồi focus vào `[data-done-title]`. `restart()`: đặt lại `index`, `score`, gỡ `data-done` bằng `toggleAttribute('data-done', false)`, `renderQuestion()`, focus câu hỏi; gắn `click` cho nút `[data-restart]`. Kiểm tra: đi hết 4 câu, thấy "Bạn đúng x/4 câu" và khối câu hỏi biến mất; bấm "Làm lại" về "Câu 1/4" và điểm bắt đầu lại từ 0.

5. **Hai hình tròn và cái bẫy `z-index` âm.** **Bạn làm:** cả hai thẻ `<div aria-hidden="true">` hình tròn: thêm `-z-10`. Chưa làm gì khác. Kiểm tra: **cả hai hình tròn biến mất**, trang chỉ còn nền xanh đen. Mở DevTools, chọn một hình tròn, bỏ tick `z-index: -10` thì nó hiện lại (nằm trên nền xanh đen); tick lại thì mất. Chưa sửa vội: đọc lại phần "Bẫy CSS" trong **Tư duy**.

6. **Sửa bẫy bằng `isolate`.** **Bạn làm:** thẻ `<div>` khối cha ngoài cùng (có `bg-slate-900`): thêm `isolate`. `isolate` đặt `isolation: isolate`, ép khối cha thành ngữ cảnh xếp chồng riêng, nên `-z-10` của con chỉ còn xuống dưới *nội dung* của khối cha, vẫn nằm trên *nền* của khối cha. Kiểm tra: hai hình tròn hiện lại, một phần nằm sau thẻ quiz; trong DevTools gỡ `isolate` thì chúng lại mất.

7. **Kính mờ.** **Bạn làm:** thẻ `<section data-card>`: thêm `backdrop-blur-md supports-[backdrop-filter]:bg-white/15`. `backdrop-blur-md` làm nhoè mọi thứ nằm phía sau thẻ bằng bán kính 12px; `supports-[backdrop-filter]:bg-white/15` đổi nền từ `bg-slate-800/90` sang trắng trong 15% chỉ khi trình duyệt hỗ trợ `backdrop-filter`. Kiểm tra: phần hình tròn nằm sau thẻ nhoè mềm, phần ngoài thẻ sắc nét; chữ trong thẻ vẫn nét. Thử gỡ `backdrop-blur-md` trong DevTools để so sánh; thử gỡ `supports-[...]` để thấy thẻ quay lại nền đặc xám xanh.

8. **JS: trải nghiệm bàn phím.** Dùng bàn phím làm hết bài: Tab vào nhóm đáp án, mũi tên chọn, Enter (gửi form) để trả lời, focus chuyển sang nút, Enter để sang câu tiếp, câu mới có focus ở câu hỏi. Kiểm tra: không lúc nào focus rơi về đầu trang; ở màn kết quả Enter trên nút "Làm lại" làm lại được; người dùng đọc màn hình nghe được nhận xét nhờ `aria-live="polite"` trên `[data-feedback]` và `[data-score]`.

### Bảng tra nhanh Tailwind và CSS

| Tailwind | CSS tương đương |
|---|---|
| `-z-10` | `z-index: -10` |
| `isolate` | `isolation: isolate` |
| `backdrop-blur-md` | `backdrop-filter: blur(12px)` |
| `bg-white/15` | `background: rgb(255 255 255 / 0.15)` |
| `supports-[backdrop-filter]:bg-white/15` | `@supports (backdrop-filter: blur(1px)) { .card { background: rgb(255 255 255 / 0.15) } }` |
| `inset-shadow-sm inset-shadow-white/40` | `box-shadow: inset 0 2px 4px rgb(255 255 255 / 0.4)` |

## Tự kiểm tra

- [ ] Hai hình tròn hiện sau thẻ; phần sau thẻ nhoè, phần ngoài sắc nét; chữ trong thẻ không nhoè.
- [ ] Gỡ `isolate` trong DevTools: hai hình tròn biến mất; gỡ `-z-10`: chúng đè lên thẻ (chữ bị che).
- [ ] Gỡ `backdrop-blur-md`: thẻ vẫn trong nhưng không nhoè.
- [ ] Chưa chọn đáp án mà bấm "Trả lời" thì có lời nhắc, `score` và `answered` không đổi.
- [ ] Trả lời đúng và sai đều tô màu đúng; ô bị khoá không chọn lại được; điểm cuối cùng khớp số câu đúng.
- [ ] Bàn phím: toàn bộ bài làm được không cần chuột; focus không rơi về `<body>` sau khi khoá ô.
- [ ] Bật `prefers-reduced-motion: reduce`: bài này không có chuyển động nên trang không đổi; xác nhận bằng cách tìm trong code không có `transition`/`animation`.
- [ ] Tự hỏi: vì sao `-z-10` làm hình tròn chui xuống dưới nền khối cha? Vì sao phải đọc `FormData` trước khi khoá `fieldset`? `backdrop-blur-md` khác `blur-md` ở đâu?

## Thử thách thêm

1. Thêm một thẻ kính nhỏ "Điểm hiện tại" ở góc phải trên cùng cột, dùng `backdrop-blur-sm bg-white/10 border border-white/20`; so sánh độ nhoè giữa `backdrop-blur-sm` và `backdrop-blur-xl`. Gợi ý class: `backdrop-saturate-150` làm màu phía sau rực hơn.
2. Xáo trộn thứ tự đáp án mỗi lần hiện câu hỏi, nhưng vẫn chấm đúng. Gợi ý: gắn `answer` theo văn bản đáp án thay vì chỉ số, hoặc xáo trộn mảng `{ text, correct }` rồi tìm lại chỉ số đúng bằng `findIndex`. Thêm `ring-2 ring-white/60` cho ô đang được chọn (variant `has-checked:`).

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
		<title>Bài 009 - Quiz kính mờ</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body class="site">
		<div class="stage">
			<div aria-hidden="true" class="blob blob-pink"></div>
			<div aria-hidden="true" class="blob blob-blue"></div>
			<main class="page">
				<section data-card class="card">
					<div class="quiz">
						<p data-counter class="counter"></p>
						<h1 data-question id="question" tabindex="-1" class="question"></h1>
						<form data-form novalidate class="form">
							<fieldset data-fieldset aria-labelledby="question" class="options"></fieldset>
							<p data-feedback aria-live="polite" class="feedback"></p>
							<button data-submit type="submit" class="action">Trả lời</button>
						</form>
					</div>
					<div class="done">
						<h2 data-done-title tabindex="-1" class="done-title">Hoàn thành!</h2>
						<p data-score aria-live="polite" class="score"></p>
						<button data-restart type="button" class="action">Làm lại</button>
					</div>
				</section>
			</main>
		</div>
		<template data-option-template>
			<label data-option class="option">
				<input data-option-input type="radio" name="answer" class="radio" />
				<span data-option-text></span>
			</label>
		</template>
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

fieldset {
	border: 0;
	min-width: 0;
}

h1,
h2 {
	font-size: inherit;
	font-weight: inherit;
}

.site {
	font-family: ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}

.stage {
	position: relative;
	isolation: isolate;
	min-height: 100vh;
	padding: 2.5rem 1rem;
	overflow: hidden;
	background: #0f172a;
}

.blob {
	position: absolute;
	z-index: -10;
	border-radius: 9999px;
}

.blob-pink {
	top: -4rem;
	left: -4rem;
	width: 18rem;
	height: 18rem;
	background-image: linear-gradient(to bottom right, #ec4899, #fb923c);
}

.blob-blue {
	right: -5rem;
	bottom: 2.5rem;
	width: 20rem;
	height: 20rem;
	background-image: linear-gradient(to bottom right, #38bdf8, #4f46e5);
}

.page {
	max-width: 28rem;
	margin: 0 auto;
}

.card {
	padding: 1.5rem;
	border: 1px solid rgb(255 255 255 / 0.3);
	border-radius: 1rem;
	background: rgb(30 41 59 / 0.9);
	color: #fff;
	box-shadow: inset 0 2px 4px rgb(255 255 255 / 0.4), 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

@supports (backdrop-filter: blur(1px)) {
	.card {
		background: rgb(255 255 255 / 0.15);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
	}
}

.counter {
	font-size: 0.875rem;
	line-height: 1.25rem;
	color: rgb(255 255 255 / 0.7);
	font-variant-numeric: tabular-nums;
}

.question {
	margin-top: 0.5rem;
	font-size: 1.25rem;
	line-height: 1.75rem;
	font-weight: 600;
}

.question:focus {
	outline: none;
}

.form {
	margin-top: 1rem;
}

.options {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.option {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
	border: 1px solid rgb(255 255 255 / 0.3);
	border-radius: 0.75rem;
	background: rgb(255 255 255 / 0.1);
	cursor: pointer;
}

.option:hover {
	background: rgb(255 255 255 / 0.2);
}

.option[data-state="correct"] {
	border-color: #6ee7b7;
	background: rgb(52 211 153 / 0.4);
}

.option[data-state="wrong"] {
	border-color: #fda4af;
	background: rgb(251 113 133 / 0.4);
}

.radio {
	width: 1.25rem;
	height: 1.25rem;
	accent-color: #ec4899;
}

.radio:focus-visible {
	outline: 2px solid #fff;
	outline-offset: 2px;
}

.feedback {
	min-height: 1.25rem;
	margin-top: 0.75rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
}

.action {
	width: 100%;
	margin-top: 1rem;
	padding: 0.625rem 0;
	border-radius: 0.75rem;
	background: #fff;
	color: #0f172a;
	font-weight: 600;
}

.action:hover {
	background: #f1f5f9;
}

.action:focus-visible {
	outline: 2px solid #fff;
	outline-offset: 2px;
}

.done {
	display: none;
	text-align: center;
}

.card[data-done] .quiz {
	display: none;
}

.card[data-done] .done {
	display: block;
}

.done-title {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 700;
}

.done-title:focus {
	outline: none;
}

.score {
	margin-top: 0.5rem;
	font-size: 1.125rem;
	line-height: 1.75rem;
}
```

`solution/script.js`

```js
const questions = [
	{
		text: 'Thẻ HTML nào tạo liên kết sang trang khác?',
		options: ['<a>', '<link>', '<nav>', '<href>'],
		answer: 0,
		note: '<a href="..."> là thẻ liên kết; <link> dùng nạp tài nguyên như CSS.',
	},
	{
		text: 'Khai báo nào cho phép gán lại giá trị sau này?',
		options: ['const', 'let', 'function', 'import'],
		answer: 1,
		note: 'let cho gán lại; const thì không.',
	},
	{
		text: 'Thuộc tính CSS nào quyết định phần tử nào nằm trên khi chồng nhau?',
		options: ['order', 'float', 'z-index', 'inset'],
		answer: 2,
		note: 'z-index quyết định thứ tự xếp chồng của phần tử được định vị.',
	},
	{
		text: 'new FormData(form).get("answer") trả gì khi chưa chọn ô nào?',
		options: ['chuỗi rỗng', '0', 'undefined', 'null'],
		answer: 3,
		note: 'FormData.get trả null khi không có trường nào mang tên đó.',
	},
];

const card = document.querySelector('[data-card]');
const counter = document.querySelector('[data-counter]');
const questionText = document.querySelector('[data-question]');
const form = document.querySelector('[data-form]');
const fieldset = document.querySelector('[data-fieldset]');
const feedback = document.querySelector('[data-feedback]');
const submit = document.querySelector('[data-submit]');
const scoreText = document.querySelector('[data-score]');
const doneTitle = document.querySelector('[data-done-title]');
const restartButton = document.querySelector('[data-restart]');
const template = document.querySelector('[data-option-template]');

let index = 0;
let score = 0;
let answered = false;

function renderQuestion() {
	const current = questions[index];
	answered = false;
	counter.textContent = `Câu ${index + 1}/${questions.length}`;
	questionText.textContent = current.text;
	feedback.textContent = '';
	submit.textContent = 'Trả lời';
	fieldset.disabled = false;
	fieldset.replaceChildren();
	current.options.forEach(function (text, optionIndex) {
		const option = template.content.cloneNode(true);
		option.querySelector('[data-option-input]').value = String(optionIndex);
		option.querySelector('[data-option-text]').textContent = text;
		fieldset.append(option);
	});
}

function markOptions(chosen, correct) {
	const options = Array.from(fieldset.querySelectorAll('[data-option]'));
	options[correct].dataset.state = 'correct';
	if (chosen !== correct) {
		options[chosen].dataset.state = 'wrong';
	}
}

function checkAnswer() {
	const value = new FormData(form).get('answer');
	if (value === null) {
		feedback.textContent = 'Hãy chọn một đáp án trước.';
		return;
	}
	const chosen = Number(value);
	const current = questions[index];
	const isCorrect = chosen === current.answer;
	if (isCorrect) {
		score += 1;
	}
	markOptions(chosen, current.answer);
	fieldset.disabled = true;
	answered = true;
	feedback.textContent = isCorrect ? 'Chính xác!' : `Chưa đúng. ${current.note}`;
	submit.textContent = index === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp';
	submit.focus();
}

function showDone() {
	scoreText.textContent = `Bạn đúng ${score}/${questions.length} câu`;
	card.toggleAttribute('data-done', true);
	doneTitle.focus();
}

function nextQuestion() {
	index += 1;
	if (index === questions.length) {
		showDone();
		return;
	}
	renderQuestion();
	questionText.focus();
}

function handleSubmit(event) {
	event.preventDefault();
	if (answered) {
		nextQuestion();
	} else {
		checkAnswer();
	}
}

function restart() {
	index = 0;
	score = 0;
	card.toggleAttribute('data-done', false);
	renderQuestion();
	questionText.focus();
}

form.addEventListener('submit', handleSubmit);
restartButton.addEventListener('click', restart);
renderQuestion();
```

</details>

### Giải thích từng hàm

- `const questions = [ {...}, ... ]`: mảng các đối tượng; mỗi đối tượng gồm `text` (câu hỏi), `options` (mảng đáp án), `answer` (chỉ số đáp án đúng, đếm từ 0), `note` (lời giải thích).
- `document.querySelector(selector)`: trả phần tử đầu tiên khớp selector hoặc `null`. Bài chỉ dùng selector `data-*`.
- `let index`, `let score`, `let answered`: ba biến trạng thái; dùng `let` vì giá trị được gán lại.
- `renderQuestion()`: hàm tự đặt, vẽ câu hỏi hiện tại. `` `Câu ${index + 1}/${questions.length}` `` là chuỗi mẫu: dấu huyền, `${...}` chèn giá trị biểu thức. `textContent` ghi chữ thuần, không hiểu HTML (nên đáp án như `<a>` hiện đúng chữ).
- `fieldset.disabled = false`: thuộc tính `disabled` của `fieldset` khoá hoặc mở mọi ô bên trong.
- `fieldset.replaceChildren()`: thay toàn bộ con của phần tử bằng các nút được truyền vào; không truyền gì thì chỉ xoá sạch. Không trả gì.
- `current.options.forEach(function (text, optionIndex) {...})`: `forEach` gọi hàm cho từng phần tử và truyền **hai** giá trị: phần tử và chỉ số của nó (tham số thứ hai).
- `template.content.cloneNode(true)`: `template.content` là mảnh `DocumentFragment` chứa nội dung template (không hiển thị). `cloneNode(true)` sao chép sâu, gồm cả con; `cloneNode(false)` chỉ sao chép đúng phần tử, không con. Trả về bản sao để chèn vào trang.
- `fragment.querySelector(selector)`: tìm phần tử con trong mảnh vừa nhân bản; trả `null` nếu không có.
- `input.value = String(optionIndex)`: ghi thuộc tính `value`; `String(số)` đổi số sang chuỗi, vì `value` của form luôn là chuỗi.
- `fieldset.append(option)`: thêm vào cuối `fieldset`; với `DocumentFragment` thì chuyển toàn bộ con của mảnh sang `fieldset`.
- `markOptions(chosen, correct)`: hàm tự đặt. `Array.from(nodeList)` đổi `NodeList` thành mảng thật để truy cập theo chỉ số. `options[correct].dataset.state = 'correct'`: `dataset` ánh xạ `data-*`; gán là ghi `data-state`. `!==` là so sánh khác nghiêm ngặt, trả `true` nếu khác giá trị hoặc khác kiểu.
- `checkAnswer()`: hàm tự đặt. `new FormData(form)` gom giá trị các trường **đang bật** của form thành một đối tượng; `.get('answer')` trả chuỗi `value` của ô radio tên `answer` đang chọn, hoặc `null` nếu chưa chọn hay trường bị khoá. `value === null` so sánh nghiêm ngặt với `null`. `return` sớm khi chưa chọn.
- `Number(value)`: đổi chuỗi `'2'` thành số `2` để so với `current.answer`.
- `score += 1`: cộng 1 vào `score` (viết gọn của `score = score + 1`).
- `isCorrect ? 'Chính xác!' : \`Chưa đúng. ${current.note}\``: toán tử ba ngôi chọn một trong hai vế theo `isCorrect`.
- `index === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp'`: so sánh với chỉ số câu cuối để chọn chữ nút.
- `submit.focus()`: chuyển focus bàn phím vào nút. Cần thiết vì `fieldset.disabled = true` làm ô đang giữ focus mất focus.
- `showDone()`: hàm tự đặt. `card.toggleAttribute('data-done', true)`: tham số thứ hai `true` luôn **thêm** thuộc tính; `false` luôn **gỡ**; khác `toggleAttribute(tên)` chỉ đảo trạng thái.
- `nextQuestion()`: hàm tự đặt, tăng `index` (`index += 1`), kết thúc thì gọi `showDone()` và `return` sớm.
- `handleSubmit(event)`: hàm tự đặt chạy khi form gửi. `event.preventDefault()` chặn hành vi mặc định (tải lại trang). Khối `if (answered) {...} else {...}` chọn việc tuỳ trạng thái.
- `restart()`: hàm tự đặt, đưa trạng thái về ban đầu.
- `element.addEventListener('submit', hàm)`: đăng ký hàm chạy khi có sự kiện. Truyền tên hàm không có `()`: có `()` là gọi ngay chứ không phải đưa hàm cho trình duyệt gọi sau. Nhấn Enter trong ô radio hoặc bấm nút `type="submit"` đều gửi form.

### Đối chiếu Tailwind của bạn với CSS trong lời giải

- `-z-10` trên hai hình tròn ↔ `.blob { z-index: -10 }`.
- `isolate` trên khối cha ↔ `.stage { isolation: isolate }`.
- `backdrop-blur-md supports-[backdrop-filter]:bg-white/15` trên thẻ ↔ `@supports (backdrop-filter: blur(1px)) { .card { background: rgb(255 255 255 / 0.15); backdrop-filter: blur(12px) } }` (nền mặc định `rgb(30 41 59 / 0.9)` ứng với `bg-slate-800/90`).
- `inset-shadow-sm inset-shadow-white/40 shadow-2xl` ↔ `.card { box-shadow: inset 0 2px 4px rgb(255 255 255 / 0.4), 0 25px 50px -12px rgb(0 0 0 / 0.25) }`.
- `data-[state=correct]:bg-emerald-400/40` ↔ `.option[data-state="correct"] { background: rgb(52 211 153 / 0.4) }`.
- `group-data-done:hidden` / `hidden group-data-done:block` ↔ `.card[data-done] .quiz { display: none }` và `.card[data-done] .done { display: block }`.
