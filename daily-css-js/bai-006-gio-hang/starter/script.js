let MIN_QTY = 1
let MAX_QTY = 9
const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const cart = document.querySelector('[data-cart]');
const list = document.querySelector('[data-list]');
const heading = document.querySelector('[data-heading]');
const summary = document.querySelector('[data-summary]');
const total = document.querySelector('[data-total]');
const stt = document.querySelector('[data-status]');
const checkoutButton = document.querySelector('[data-checkout]');
let currentItem = null
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getLineTotal(item) {
  return Number(item.dataset.qty) * Number(item.dataset.price)
}

function renderItem(item) {
  const qty = Number(item.dataset.qty);
  item.querySelector('[data-qty-text]').textContent = String(qty);
  item.querySelector('[data-line-total]').textContent = formatter.format(getLineTotal(item));
  item.querySelector('[data-decrease]').disabled = qty <= MIN_QTY;
  item.querySelector('[data-increase]').disabled = qty >= MAX_QTY;
}

function changeQuantity(item, step) {
  const next = clamp(Number(item.dataset.qty) + step, MIN_QTY, MAX_QTY);
  item.dataset.qty = String(next);
  renderItem(item);
  renderCart()
}
function handleListClick(event) {
  const item = event.target.closest('[data-item]');
  if (!item) { return; }
  const decrease = item.querySelector('[data-decrease]');
  const increase = item.querySelector('[data-increase]');
  if (event.target.closest('[data-increase]')) {
    changeQuantity(item, 1);
    if (increase.disabled) {
      decrease.focus();
    }
  } else if (event.target.closest('[data-decrease]')) {
    changeQuantity(item, -1);
    if (decrease.disabled) {
      increase.focus();
    }
  } else if (event.target.closest('[data-remove]')) {
    removeItem(item)
  }
}


function removeItem(item) {
  item.remove();
  renderCart()
  heading.focus();
}

function isSelected(item) {
  return item.querySelector('[data-check]').checked;
}

function renderCart() {
  const item = Array.from(list.querySelectorAll('[data-item]'))
  cart.toggleAttribute('data-empty', item.length == 0)
  const selected = item.filter(isSelected)
  const sum = selected.reduce(function (accumulator, li) {
    return accumulator + getLineTotal(li);
  }, 0);
  total.textContent = formatter.format(sum);
  summary.textContent = `Đã chọn ${selected.length}/${item.length} món`
  checkoutButton.disabled = selected.length === 0
  stt.textContent = '';
}
function handleListChange(event) {
  if (event.target.matches('[data-check]')) {
    renderCart()
  }
}

function checkout() {
  const count = list.querySelectorAll('[data-check]:checked').length;
  stt.textContent = `Đã đặt ${count} món, tổng ${total.textContent}.`;
}

list.addEventListener('click', handleListClick);
list.querySelectorAll('[data-item]').forEach(renderItem)
list.addEventListener('change', handleListChange);
checkoutButton.addEventListener('click', checkout);

renderCart()
