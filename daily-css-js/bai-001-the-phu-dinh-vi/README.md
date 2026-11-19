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
```

```css
```

```js
```

</details>

Các dòng then chốt: `position: relative` trên `.card` tạo điểm neo cho mọi phần tử `absolute` bên trong. `inset: 0` làm lớp phủ phủ kín thẻ. `z-index: 2` đặt lớp phủ trên huy hiệu (`z-index: 1`). Quy tắc `.card.is-open .overlay` là nơi duy nhất định nghĩa trạng thái mở, còn JS chỉ gọi `classList.toggle('is-open', moRa)`. Hàm `capNhatTrangThai` gom việc đổi class, `aria-expanded` và focus vào một chỗ nên ba nguồn mở/đóng (nút, nút Đóng, Escape) luôn nhất quán.
