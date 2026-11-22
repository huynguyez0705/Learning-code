# Hướng dẫn cho agent: thư mục `daily-css-js`

`CLAUDE.md` và `AGENTS.md` trong thư mục này có nội dung giống hệt nhau. Sửa file này thì sửa luôn file kia.

## Thư mục này là gì

Mỗi ngày ba bài tập ngắn (mỗi bài 30–45 phút, khó dần trong ngày) kết hợp giao diện và JavaScript thuần. Bài 001–006 theo lịch cũ một bài mỗi ngày; từ bài 007 là ba bài mỗi ngày. Người học tự làm bài trong `starter/` bằng **Tailwind CSS v4**, sau đó so với lời giải trong `solution/`. Lời giải viết bằng **CSS thuần** để người học thấy mỗi class Tailwind ra thuộc tính CSS nào.

Một routine cloud (Claude Code, chạy 7h sáng giờ Việt Nam) tự tạo bài mới và push thẳng lên `main`. Agent khác tạo bài bằng tay cũng phải theo đúng các quy tắc dưới đây, để bài của routine và bài làm tay giống nhau.

Bài mẫu chuẩn: `bai-003-hop-thoai-xac-nhan/` cho cấu trúc đề và lời giải; `bai-004-bang-diem-cot-dinh/` cho cách điền sẵn class trong starter và dòng **Bạn làm** ở mỗi bước gợi ý. Có thể đọc thêm `bai-002-menu-ba-cham/`. Bài 001 là ngoại lệ (CSS thuần, có `style.css` và `:root` trong starter), đừng lấy làm mẫu.

## Làm việc với người học

- Luôn trả lời và viết tài liệu bằng **tiếng Việt**.
- Người học đang học nền tảng. Mỗi khi đưa code hoặc gợi ý, phải giải thích **từng hàm, phương thức, thuộc tính** xuất hiện trong đó: nó làm gì, trả về gì. Mọi tham số lạ phải nói rõ khác cách dùng cơ bản ở chỗ nào. Ví dụ `toggleAttribute(name, force)` có thêm tham số thứ hai so với `toggleAttribute(name)`.
- **Không tự cài đặt.** Không tự chạy `npm install`, `npm init`, hay thêm gói hoặc công cụ. Gửi từng lệnh PowerShell để người học tự chạy, kèm một câu giải thích mỗi lệnh. Đọc file, chạy thử, kiểm tra thì agent tự làm được.
- Chỉ commit hoặc push khi người học yêu cầu.
- Khi người học nhờ gợi ý, bám theo **code của họ**, đừng đưa code lời giải. Họ không mở lời giải trước khi tự làm xong.
- Người học được dùng arrow function (`=>`) trong bài của họ. Không trừ điểm, không ghi trong đề là họ bị cấm.

## Ưu tiên học từ bài 005

- Người học muốn mở rộng kiến thức JavaScript qua bài tập thực tế, chủ đề do agent tự chọn: blog, streaming, bất động sản, giỏ hàng hoặc ứng dụng khác. Không cố định một chủ đề cho cả lộ trình.
- Mỗi bài tập trung vài API hoặc khái niệm mới, có giải thích tác dụng, tham số, giá trị trả về và cách dùng trong bài. Không nhồi nhiều chủ đề chưa học vào cùng một bài.
- CSS đã học phải dựng sẵn bằng Tailwind trong starter. CSS mới để người học tự làm và đánh dấu rõ. Lời giải luôn dùng CSS thuần trong style.css; starter/script.js vẫn rỗng.
- JS nặng hơn CSS: mỗi bài tối đa 2–3 nhóm class CSS mới, phần lớn bước gợi ý là JS. Độ khó JS đi theo bảng cấp độ bên dưới. Không sửa lại bài cũ.
- Đổi chủ đề liên tục để học nhanh nhiều cái mới: hai bài liền nhau không trùng chủ đề CSS, không trùng loại ứng dụng (blog, giỏ hàng, streaming, bất động sản, đặt lịch, quiz, ghi chú, bảng điều khiển, nhạc, thời tiết...), không trùng API JS trọng tâm.
- Nói rõ bài có lưu dữ liệu hay không. Bài chưa dùng localStorage hoặc cookie thì tải lại trang sẽ khôi phục dữ liệu mẫu. Dạy lưu trữ trong bài riêng khi có đủ kiến thức nền.

## Cấu trúc thư mục

```
daily-css-js/
├── CLAUDE.md, AGENTS.md      hướng dẫn này (giống hệt nhau)
├── README.md                 giới thiệu, cách cài Tailwind, danh sách bài
├── PROGRESS.md               bảng tiến độ, mỗi bài một dòng
├── package.json              do người học tạo; có script "dev"
├── tailwind.css              một dòng: @import "tailwindcss";
├── .gitignore                node_modules/ và build/
├── build/tailwind.css        CSS do Tailwind sinh ra (không lên git)
└── bai-NNN-slug/
    ├── bai-NNN-slug.md       đề bài, tên trùng tên thư mục
    ├── starter/
    │   ├── index.html        Tailwind dựng sẵn, chỉ chừa phần CSS mới được giao
    │   └── script.js         rỗng
    └── solution/
        ├── index.html        class đặt theo ý nghĩa, nạp style.css
        ├── style.css         CSS thuần
        └── script.js         JS thuần
```

Agent không được sửa `package.json`, `package-lock.json`, `tailwind.css`, `.gitignore`, `node_modules/`, `build/`. Cũng không được sửa `starter/` của các bài cũ, vì đó là bài làm của người học.

## Cách người học chạy Tailwind

Chạy trong `D:\VSCODE\Learning-code\daily-css-js`:

```powershell
npm run dev
```

Script `dev` là `tailwindcss -i ./tailwind.css -o ./build/tailwind.css --watch`. Lệnh này quét các file trong thư mục, gặp class nào thì sinh CSS cho class đó vào `build/tailwind.css`, và tự dựng lại khi lưu file. Vì Tailwind chỉ sinh CSS cho class nó đọc thấy trong file, mọi class gợi ý trong đề phải viết **nguyên vẹn**, không ghép chuỗi bằng JS.

Cách cài lần đầu có trong `README.md`. Nếu chưa cài thì gửi lệnh cho người học, không tự chạy.

## Tạo bài mới

### Xác định số bài, ngày học, cấp độ

Áp dụng từ bài 007. Hôm nay tính theo giờ Việt Nam (`TZ=Asia/Ho_Chi_Minh date +%F`).

- **Số bài N** = số dòng dữ liệu trong bảng `PROGRESS.md` + 1. NNN là N viết đủ 3 chữ số.
- **Ngày học K** = số ngày khác nhau ở cột Ngày của `PROGRESS.md`, tính cả hôm nay. Ngày không có bài thì không tính. Ví dụ bài 001–006 nằm ở 3 ngày (19, 20, 21/11), nên ngày 22/11 là K = 4.
- **Bài P/3** = số dòng có Ngày bằng hôm nay + 1. Mỗi ngày học có đúng 3 bài, P = 1, 2, 3.
- **Cấp C** = ceil(K / 7), tối đa 5. Cứ 7 ngày học thì lên một cấp JS; từ K = 29 trở đi giữ cấp 5.
- **Chủ đề CSS** là dòng T = ((N - 6) mod 8) + 1 trong bảng dưới (bài 007 là dòng 2, bài 013 là dòng 8, bài 014 quay lại dòng 1). Chủ đề đã có bài trước thì làm khó hơn rõ rệt, không lặp bài cũ. Nếu dòng T trùng chủ đề CSS của bài ngay trước thì lấy dòng kế tiếp.

| # | Chủ đề CSS | Kỹ thuật trọng tâm | JS gợi ý kèm theo |
|---|---|---|---|
| 1 | Định vị & quản lý layer | relative/absolute/fixed/sticky, inset, z-index, stacking context | click, toggleAttribute, mở/đóng |
| 2 | Gradient | bg-linear-*, bg-radial, bg-conic, from/via/to, nhiều lớp nền | theo dõi chuột, style.setProperty cho --x, --y |
| 3 | Đổ bóng | shadow-*, inset-shadow-*, drop-shadow-*, text-shadow-*, bóng theo nguồn sáng | data-state, pointermove đổi hướng bóng |
| 4 | Glassmorphism | backdrop-blur-*, bg-white/10, viền sáng, lớp nền phía sau, supports-[...] | kéo thả bằng Pointer Events, setPointerCapture |
| 5 | 3D cơ bản | perspective-*, transform-3d, backface-hidden, rotate-x/y-*, translate-z-* | click lật thẻ, Enter/Space |
| 6 | 3D nâng cao | khối lập phương, carousel 3D, perspective-origin-* | kéo để xoay, quán tính bằng requestAnimationFrame |
| 7 | Glass + 3D + ánh sáng | tilt 3D, highlight theo chuột, bóng động | chuẩn hoá toạ độ chuột, pointerleave, throttle bằng rAF |
| 8 | Tổng ôn & mini project | trộn mọi kỹ thuật | máy trạng thái nhỏ gom click + kéo + chuột |

Bảng chủ đề CSS chỉ quyết định phần CSS mới (tối đa 2–3 nhóm class). API JS trọng tâm lấy từ bảng cấp độ dưới đây, cột "JS gợi ý kèm theo" ở trên chỉ dùng khi hợp với cấp hiện tại.

#### Bảng cấp độ JS

| Cấp C | Ngày học K | API và khái niệm JS mới của cấp | Mức gợi ý |
|---|---|---|---|
| 1 | 1–7 | DOM, sự kiện, uỷ quyền sự kiện, `dataset`, `toggleAttribute`, `template`, mảng (`map`, `find`, `some`, `sort`), chuỗi mẫu, `keydown`, `setTimeout`/`clearTimeout`, `FormData` | Chi tiết: mỗi bước nêu API, tham số, thứ tự làm và cách kiểm tra; API mới được kèm khung code ngắn có chỗ trống |
| 2 | 8–14 | object làm state + hàm render, `localStorage` + `JSON.stringify`/`JSON.parse`, `Date` và `Intl.DateTimeFormat`, sự kiện `input`, kiểm tra form (`checkValidity`, `setCustomValidity`), debounce | Vừa: mỗi bước nêu API và thứ tự làm, không có khung code |
| 3 | 15–21 | `fetch` file JSON cục bộ, `async`/`await`, `try`/`catch`, `Promise.all`, `URLSearchParams`, `history.pushState` + `popstate`, `AbortController` | Ít: mỗi bước nêu mục tiêu và tên API cần dùng |
| 4 | 22–28 | Pointer Events nâng cao, `requestAnimationFrame`, `IntersectionObserver`, `ResizeObserver`, `CustomEvent`, `Map`/`Set` | Rất ít: mỗi bước chỉ nêu mục tiêu và cách kiểm tra |
| 5 | 29 trở đi | ES module (`import`/`export`), `class`, máy trạng thái, mini project nhiều file | Tối thiểu: chỉ mô tả yêu cầu, phần Tự kiểm tra kỹ hơn |

- Bài nào cũng được dùng lại API của các cấp dưới. Mỗi bài thêm 1–3 API mới của cấp hiện tại; API mới gặp lần đầu luôn được giải thích dù mức gợi ý ít.
- Bài dùng `fetch` hoặc ES module thì phải chạy qua `python -m http.server`; ghi rõ ở đầu đề, file JSON có trong cả `starter/` lẫn `solution/`.

#### Độ khó theo P

Đọc file `.md` của bài ngay trước và của bài cùng số P ở ngày học trước để so.

- P=1: khởi động, 1–2 API mới, một tương tác chính. Độ khó ★★ đến ★★★.
- P=2: thêm một ràng buộc mới và một "cái bẫy" thật để người học tự gặp rồi hiểu (JS hoặc CSS). Ví dụ: bài 002 là stacking context do `translate`, bài 006 là `1fr` không co được. Độ khó ★★★ đến ★★★★.
- P=3: một component hoàn chỉnh, kết hợp 2–3 API của cấp với ít nhất một kỹ thuật cũ, gợi ý ít hơn một mức so với cột "Mức gợi ý". Độ khó ★★★★ đến ★★★★★. JS có thể tới 150 dòng.
- Bài P=2 và P=3 khó hơn bài ngay trước. Mọi bài không được dễ hơn bài cùng P ở ngày học trước. Bài P=1 được dễ hơn bài P=3 của ngày trước.

### Starter

- Cùng cấu trúc HTML với lời giải. Từ bài 004, **dựng sẵn class Tailwind cho CSS quen thuộc**. Nếu có kỹ thuật CSS mới thì chỉ chừa phần đó để người học tự thêm, ghi rõ phần tử, class, tác dụng và cách kiểm tra trong đề. Giữ mọi `data-*`, `aria-*`, `role`, `type`, `tabindex`, `id` mà JS hoặc trợ năng cần.
- Cách xác định class nào điền sẵn:
  - Chia theo từng class, không theo cả thẻ. Một thẻ có thể có sẵn class cũ, người học chỉ thêm class mới vào.
  - Đã học nghĩa là utility đó đã dùng ở bài trước (xem cột "Kỹ thuật CSS" trong `PROGRESS.md` và file đề các bài cũ), kể cả với giá trị khác hoặc giá trị âm: đã có `max-w-md` thì `max-w-xl` là đã học, đã có `outline-offset-2` thì `-outline-offset-2` là đã học. Utility khác tên là mới, dù na ná: `min-w-*` khác `max-w-*`.
  - Luôn để người học tự làm mọi class tạo ra hoặc sửa **cái bẫy** của bài, kể cả khi utility đã học (ví dụ thứ tự `z-10`/`z-20`/`z-30` ở bài 004). Cũng để trống class mà bước gợi ý bảo thêm rồi đổi (ví dụ `bg-white` rồi đổi thành `bg-inherit`).
  - Phần tử lặp lại (mục danh sách, thẻ, dòng, nút giống nhau): điền sẵn cả class mới cho các mục đầu, chỉ để trống ở 2 mục cuối (5 mục thì sẵn 3, 4 mục thì sẵn 2, 2–3 mục thì người học làm 1 mục cuối). Mục gây ra cái bẫy phải nằm trong nhóm người học tự làm.
  - Thẻ không có class nào đã học thì không có thuộc tính `class`.
- Trong `<head>` có đúng dòng `<link rel="stylesheet" href="../../build/tailwind.css" />`. Không dùng CDN Tailwind.
- Cuối `<body>` có `<script src="script.js"></script>`. `script.js` để rỗng.
- Không có `style.css`, không có `:root`.

### Lời giải

- `index.html`: không nạp Tailwind dưới bất kỳ hình thức nào. Nạp `<link rel="stylesheet" href="style.css" />`. Class đặt tên theo ý nghĩa (`card`, `menu-button`, `button danger`...).
- `style.css`:
  - Mở đầu bằng reset nhỏ thay cho Preflight của Tailwind: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`, reset `button`, `ul`, và cỡ chữ heading khi cần.
  - Không dùng `:root`.
  - Giá trị lấy đúng tương đương của class Tailwind đã gợi ý: 1 đơn vị khoảng cách = 4px, màu là mã hex gần đúng của bảng màu Tailwind. Nhờ vậy làm đúng gợi ý sẽ ra giao diện giống hệt lời giải.
- Mở thẳng file là chạy, không cần mạng, không cần build.

### Nối JS với giao diện

- JS chỉ ghi **trạng thái**: thuộc tính `data-*` (bằng `toggleAttribute`, `dataset`), thuộc tính HTML có sẵn như `inert`, `aria-expanded`, hoặc CSS custom property (bằng `style.setProperty`).
- Bên Tailwind đọc trạng thái qua variant `data-*:`, `group-data-*:`, `peer-*:`, `aria-*:` hoặc `var(--x)`. Bên CSS thuần đọc qua selector thuộc tính, ví dụ `.card[data-open] .menu`.
- JS không thêm hoặc gỡ từng class giao diện, không đặt `style.display`, không tự tính vị trí.
- JS chỉ tìm phần tử bằng `data-*`, **không tìm bằng class**. Cùng một `script.js` phải chạy được với cả bản Tailwind của người học lẫn bản CSS của lời giải.
- Phần tử ẩn bằng `visibility: hidden` (`invisible`) mà cần `focus()` ngay khi mở thì `visibility` không được có transition lúc mở. Bên Tailwind chỉ chuyển động `opacity`/`translate` (`transition-opacity`, `transition-[opacity,translate]`), bên CSS thì chỉ liệt kê những thuộc tính đó trong `transition`. Nếu không, `focus()` thất bại.

### File `.md`: thứ tự mục

1. `# Bài NNN: <tên bài>`, rồi một dòng: Ngày học K, bài P/3, cấp C, chủ đề CSS, độ khó (1–5 sao), thời gian ước tính. Rồi khối trích dẫn nhắc chạy `npm run dev`, làm bằng Tailwind, lời giải bằng CSS thuần, và nói rõ bài có lưu dữ liệu hay không.
2. `## Mục tiêu`: 3–5 gạch đầu dòng cụ thể, đo được.
3. `## Kết quả mong đợi`: mô tả bằng lời.
4. `## Tư duy`: vì sao làm vậy, mô hình tư duy, ví dụ đời thường khi khái niệm khó, giải thích cái bẫy.
5. `## Phân chia trách nhiệm CSS và JS`: bảng 2 cột Tailwind (CSS) | JS, kèm những gì JS không nên làm.
6. `## Ôn lại`: kỹ thuật cũ dùng lại, ghi tên bài và thư mục.
7. `## Gợi ý từng bước`: mở đầu bằng khối trích dẫn nói starter đã điền sẵn những nhóm class nào (kể cả các mục lặp đã điền sẵn). Sau đó là 5–8 bước đánh số. Ưu tiên hướng dẫn JS; không bắt người học dựng lại CSS đã biết. Mức chi tiết theo cột "Mức gợi ý" của cấp C (P=3 bớt một mức). Ngay sau tên mỗi bước có dòng **Bạn làm:** ghi đúng các class mới phải thêm và ở phần tử nào (với phần tử lặp lại thì ghi rõ "2 thẻ `<li>` cuối", chép theo các thẻ đầu), hoặc "không có, bước này đã điền sẵn hết", hoặc "toàn bộ JS". Có CSS mới thì ghi đúng class Tailwind cho phần tử nào và cách kiểm tra. API JS gặp lần đầu thì kèm một câu giải thích. Có bước cố tình cho người học gặp cái bẫy. Sau các bước là `### Bảng tra nhanh Tailwind và CSS`.
8. `## Tự kiểm tra`: checklist `- [ ]` gồm kiểm tra bằng mắt, bằng DevTools (xoá hoặc sửa class để thấy tác dụng), bàn phím, `prefers-reduced-motion`, và 2–3 câu tự hỏi.
9. `## Thử thách thêm`: 2 biến thể nâng cao có gợi ý class.
10. `## Mã hoàn chỉnh`: dòng "Chỉ mở sau khi đã tự làm.", rồi `<details><summary>Xem lời giải</summary>` chứa các khối `html`, `css`, `js` giống hệt ba file trong `solution/`, mỗi khối có tên file đứng trước, rồi `</details>`. Sau đó là `### Giải thích từng hàm` và `### Đối chiếu Tailwind của bạn với CSS trong lời giải`.

Trong `### Giải thích từng hàm`, mỗi hàm tự đặt, mỗi API trình duyệt, mỗi toán tử hoặc cú pháp dễ lạ (`!`, `!==`, `&&`, selector `[a][b]`, return sớm, truyền tên hàm không có `()`...) có một gạch đầu dòng.

Sinh các khối code trong `.md` bằng script đọc file `solution/` rồi chèn vào, để chắc chắn khớp từng ký tự.

### Cập nhật file chung

- `README.md`: chỉ thêm một dòng liên kết `bai-NNN-slug/bai-NNN-slug.md` lên đầu danh sách dưới `## Danh sách bài`. Giữ nguyên các mục khác.
- `PROGRESS.md`: thêm một dòng cuối bảng với đủ 7 cột: Bài, Ngày (YYYY-MM-DD, giờ Việt Nam), Lịch (`Ngày học K, bài P/3, cấp C`), Chủ đề (chủ đề CSS và loại ứng dụng), Kỹ thuật CSS, Tương tác JS, Thư mục.

## Quy tắc viết code (code của agent)

- Không có comment trong file code: không `//`, `/* */`, `<!-- -->`. Giải thích chỉ nằm trong file `.md`.
- `const` mặc định, `let` khi cần gán lại, cấm `var`.
- Cấm arrow function `=>`. Dùng `function tenHam() {}` hoặc `function () {}`, tên camelCase.
- JavaScript thuần, `addEventListener`, Pointer Events cho kéo và theo dõi chuột, `requestAnimationFrame` khi cập nhật liên tục.
- Mọi chuyển động có `motion-reduce:` bên gợi ý, `@media (prefers-reduced-motion: reduce)` bên lời giải.
- Phần tử tương tác là `<button>`, hoặc có `tabindex` + `role`. Phải có viền focus rõ ràng: `focus-visible:` bên gợi ý, `:focus-visible` bên lời giải.
- HTML có `lang="vi"`, meta charset, meta viewport. Thụt lề bằng tab.
- Mỗi file JS khoảng 20–100 dòng.

## Kiểm tra trước khi báo xong

1. `grep -rnE '=>|\bvar |/\*|<!--|//' bai-NNN-*/starter bai-NNN-*/solution` phải rỗng.
2. `grep -rni 'tailwind\|cdn' bai-NNN-*/solution` phải rỗng. Trong `starter/index.html` có đúng một dòng `href="../../build/tailwind.css"`; từ bài 004 có sẵn class Tailwind, chỉ thiếu đúng các class nằm trong dòng **Bạn làm** của đề.
3. `node --check bai-NNN-*/solution/script.js`.
4. Khối code trong `.md` khớp từng ký tự với ba file `solution/`.
5. `starter/index.html` giữ đủ mọi `data-*`/`aria-*` mà `solution/script.js` truy vấn.
6. Mọi API trong `solution/script.js` có trong `### Giải thích từng hàm`.
7. Mở lời giải trên trình duyệt (phục vụ bằng `python -m http.server`) và thử từng mục trong Mục tiêu và Tự kiểm tra, kể cả cái bẫy. Dựng thêm trong thư mục tạm (không trong `daily-css-js`) hai bản: starter đã điền sẵn, phải hiện đúng phần đã học; và starter thêm đủ class trong các dòng **Bạn làm**, phải chạy giống lời giải.

## Chấm bài khi người học nhờ "check bài"

1. Đọc `starter/index.html` và `starter/script.js` của bài đó.
2. Người học phải đang chạy `npm run dev`, tức đã có `build/tailwind.css`. Phục vụ thư mục `daily-css-js` bằng `python -m http.server <port> --bind 127.0.0.1` rồi mở `starter/index.html` trên trình duyệt. Không mở bằng `file://`.
3. Thử từng mục trong Mục tiêu và Tự kiểm tra: dùng `.click()`, `KeyboardEvent`, `getComputedStyle`, `elementFromPoint`, hoặc gắn tạm `data-open` bằng tay để kiểm tra CSS.
4. Trả về: điểm trên 10, bảng từng mục đạt hay chưa, điểm làm tốt, chỗ còn thiếu. Gợi ý sửa phải bám theo code của người học và giải thích mọi API dùng tới. Không trừ điểm arrow function. Góp ý nhỏ (code trùng lặp, tìm phần tử bằng class) thì ghi riêng.
5. Tắt server sau khi chấm.

## Git

- Chỉ tạo hoặc sửa file trong `daily-css-js/`. Repo có nhiều thư mục khác của người học, không đụng tới.
- Routine push thẳng lên `main`. Agent làm tay thì không commit, không push, trừ khi người học yêu cầu.
- Bài tạo bằng tay phải được push **trước 7h sáng hôm sau**. Nếu chưa push, routine đọc `PROGRESS.md` trên GitHub thấy thiếu dòng, sẽ tạo trùng số bài và gây xung đột.
