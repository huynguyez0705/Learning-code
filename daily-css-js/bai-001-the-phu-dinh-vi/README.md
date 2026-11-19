# Bài 001: Thẻ sản phẩm với lớp phủ định vị

Tuần 1, ngày 1/7, vòng 1, độ khó ★☆☆☆☆, thời gian ước tính 30 phút.

## Mục tiêu

- Đặt huy hiệu "Mới" ở góc trên phải thẻ bằng `position: absolute`, cách mép 12px.
- Tạo lớp phủ phủ kín thẻ bằng `inset: 0`, mặc định ẩn.
- Bấm nút "Xem chi tiết" thì lớp phủ trượt từ dưới lên trong 300ms.
- Bấm "Đóng" hoặc phím Escape thì lớp phủ đóng lại.
- Lớp phủ luôn nằm trên huy hiệu nhờ `z-index`.

## Kết quả mong đợi

Một thẻ trắng bo góc, giữa màn hình, có tên sản phẩm, mô tả ngắn và nút "Xem chi tiết". Huy hiệu cam nằm góc trên phải. Khi bấm nút, một lớp nền tối trượt lên che toàn bộ thẻ (kể cả huy hiệu), hiện thông tin giao hàng và nút "Đóng".

## Tư duy

`position: absolute` định vị phần tử theo tổ tiên gần nhất có `position` khác `static`. Nếu quên đặt `position: relative` cho `.card`, huy hiệu và lớp phủ sẽ bám theo viewport hoặc `body`. Vì vậy `.card` là "điểm neo" (containing block).

`inset: 0` là viết tắt của `top/right/bottom/left: 0`, giúp lớp phủ co giãn theo thẻ mà không cần biết kích thước.

Thứ tự chồng lớp: phần tử có `position` khác `static` và `z-index` lớn hơn thì vẽ phía trên. Huy hiệu `z-index: 1`, lớp phủ `z-index: 2`, nên lớp phủ che được huy hiệu. `overflow: hidden` ở `.card` cắt phần lớp phủ đang nằm ngoài thẻ lúc chưa mở.

Ẩn lớp phủ bằng `opacity` + `visibility` thay vì `display: none` để còn chuyển động được; `visibility: hidden` cũng loại lớp phủ khỏi thứ tự Tab và trình đọc màn hình khi đóng.

## Phân chia trách nhiệm CSS và JS

| CSS | JS |
|---|---|
| Vị trí huy hiệu, lớp phủ, thứ tự `z-index` | Lắng nghe click và phím Escape |
| Trạng thái ẩn/hiện qua class `.is-open` | Bật/tắt class `is-open` bằng `classList.toggle` |
| Hiệu ứng trượt bằng `transition` | Cập nhật `aria-expanded` và chuyển focus |
| Tắt chuyển động khi `prefers-reduced-motion` | Không làm gì thêm |

JS KHÔNG nên: đặt `style.top`, `style.display` hay tự tính vị trí; không làm animation bằng `setInterval`. Mọi hình dạng và chuyển động thuộc về CSS.

## Gợi ý từng bước

1. Dựng bố cục: dùng `display: grid` + `place-items: center` cho `body`. Kiểm tra: thẻ nằm giữa màn hình.
2. Tạo kiểu thẻ (`width`, `padding`, `border-radius`, `box-shadow`). Kiểm tra: nhìn như thẻ sản phẩm bình thường.
3. Thêm `position: relative` cho `.card`, rồi `position: absolute` với `top`/`right` cho `.badge`. Kiểm tra: đổi kích thước cửa sổ, huy hiệu vẫn dính góc thẻ.
4. Làm `.overlay` với `position: absolute` và `inset: 0`. Tạm thời để nó hiện. Kiểm tra: phủ kín thẻ, đè lên huy hiệu (chỉnh `z-index` nếu chưa).
5. Ẩn mặc định bằng `opacity`, `visibility` và `transform: translateY(100%)`, thêm `overflow: hidden` cho thẻ. Kiểm tra: không thấy lớp phủ, không thấy phần thừa tràn ra ngoài.
6. Viết rule `.card.is-open .overlay` đưa các giá trị về trạng thái hiện, thêm `transition`. Kiểm tra: tự gõ class `is-open` trong DevTools, lớp phủ trượt lên.
7. Trong `script.js`: chọn phần tử bằng `querySelector`, bắt click để `classList.toggle`, cập nhật `aria-expanded`.
8. Thêm lắng nghe `keydown` cho Escape và `@media (prefers-reduced-motion: reduce)`.

## Tự kiểm tra

- [ ] Huy hiệu bám đúng góc trên phải khi thay đổi `--card-w`.
- [ ] Lớp phủ che kín thẻ, không tràn ra ngoài bo góc.
- [ ] Trong DevTools (Elements), bấm nút thì class `is-open` xuất hiện trên `.card`.
- [ ] Tab Computed của `.overlay` hiển thị `position: absolute` và `z-index: 2`.
- [ ] Bấm Tab: khi đóng, focus không rơi vào nút "Đóng" ẩn; khi mở, focus chuyển vào "Đóng".
- [ ] Escape đóng được lớp phủ.
- [ ] Bật giả lập `prefers-reduced-motion: reduce` (DevTools, Rendering): không còn chuyển động.
- [ ] Tự hỏi: nếu bỏ `position: relative` khỏi `.card` thì điều gì xảy ra, vì sao?
- [ ] Tự hỏi: vì sao dùng `visibility` mà không chỉ `opacity`?
- [ ] Tự hỏi: `z-index` của huy hiệu có tác dụng nếu nó là `position: static` không?

## Thử thách thêm

1. Cho lớp phủ trượt từ bên phải thay vì từ dưới, chỉ đổi giá trị `transform`.
2. Thêm một nhãn `position: sticky` bên trong lớp phủ dài (có `overflow: auto`) để thấy khác biệt giữa sticky và absolute.

## Mã hoàn chỉnh

Chỉ mở sau khi đã tự làm.

<details><summary>Xem lời giải</summary>

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bài 001 - Thẻ phủ định vị</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <article class="card">
    <span class="badge">Mới</span>
    <h1>Cốc gốm thủ công</h1>
    <p>Men xanh ngọc, dung tích 300ml.</p>
    <button class="toggle" type="button" aria-expanded="false">Xem chi tiết</button>
    <div class="overlay">
      <p>Giao trong 2 ngày. Bảo hành 12 tháng.</p>
      <button class="close" type="button">Đóng</button>
    </div>
  </article>
  <script src="script.js"></script>
</body>
</html>
```

```css
:root {
  --card-w: 320px;
  --accent: #e4572e;
  --speed: 300ms;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: #f1efe9;
}

.card {
  position: relative;
  width: var(--card-w);
  padding: 24px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 0.8rem;
  z-index: 1;
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: rgb(20 20 30 / 0.92);
  color: #fff;
  opacity: 0;
  visibility: hidden;
  transform: translateY(100%);
  transition: transform var(--speed), opacity var(--speed), visibility var(--speed);
}

.card.is-open .overlay {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

button {
  padding: 8px 16px;
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

button:focus-visible {
  outline: 3px solid #1b6ef3;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .overlay {
    transition: none;
  }
}
```

```js
const card = document.querySelector('.card');
const toggle = card.querySelector('.toggle');
const close = card.querySelector('.close');

function capNhatTrangThai(moRa) {
  card.classList.toggle('is-open', moRa);
  toggle.setAttribute('aria-expanded', String(moRa));
  if (moRa) {
    close.focus();
  } else {
    toggle.focus();
  }
}

toggle.addEventListener('click', function () {
  capNhatTrangThai(!card.classList.contains('is-open'));
});

close.addEventListener('click', function () {
  capNhatTrangThai(false);
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && card.classList.contains('is-open')) {
    capNhatTrangThai(false);
  }
});
```

</details>

Các dòng then chốt: `position: relative` trên `.card` tạo điểm neo cho mọi phần tử `absolute` bên trong. `inset: 0` làm lớp phủ phủ kín thẻ. `z-index: 2` đặt lớp phủ trên huy hiệu (`z-index: 1`). Quy tắc `.card.is-open .overlay` là nơi duy nhất định nghĩa trạng thái mở, còn JS chỉ gọi `classList.toggle('is-open', moRa)`. Hàm `capNhatTrangThai` gom việc đổi class, `aria-expanded` và focus vào một chỗ nên ba nguồn mở/đóng (nút, nút Đóng, Escape) luôn nhất quán.
