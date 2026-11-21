const MIN_QTY = 1;
const MAX_QTY = 9;
const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

const cart = document.querySelector('[data-cart]');
const list = document.querySelector('[data-list]');
const heading = document.querySelector('[data-heading]');
const summary = document.querySelector('[data-summary]');
const total = document.querySelector('[data-total]');
const status = document.querySelector('[data-status]');
const checkoutButton = document.querySelector('[data-checkout]');

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function getLineTotal(item) {
	return Number(item.dataset.price) * Number(item.dataset.qty);
}

function isSelected(item) {
	return item.querySelector('[data-check]').checked;
}

function addLineTotal(sum, item) {
	return sum + getLineTotal(item);
}

function renderItem(item) {
	const qty = Number(item.dataset.qty);
	item.querySelector('[data-qty-text]').textContent = String(qty);
	item.querySelector('[data-line-total]').textContent = formatter.format(getLineTotal(item));
	item.querySelector('[data-decrease]').disabled = qty <= MIN_QTY;
	item.querySelector('[data-increase]').disabled = qty >= MAX_QTY;
}

function renderCart() {
	const items = Array.from(list.querySelectorAll('[data-item]'));
	const selected = items.filter(isSelected);
	total.textContent = formatter.format(selected.reduce(addLineTotal, 0));
	summary.textContent = `Đã chọn ${selected.length}/${items.length} món`;
	checkoutButton.disabled = selected.length === 0;
	cart.toggleAttribute('data-empty', items.length === 0);
	status.textContent = '';
}

function changeQuantity(item, step) {
	const next = clamp(Number(item.dataset.qty) + step, MIN_QTY, MAX_QTY);
	item.dataset.qty = String(next);
	renderItem(item);
	renderCart();
}

function removeItem(item) {
	item.remove();
	renderCart();
	heading.focus();
}

function handleListClick(event) {
	const item = event.target.closest('[data-item]');
	if (!item) {
		return;
	}
	const decrease = item.querySelector('[data-decrease]');
	const increase = item.querySelector('[data-increase]');
	if (event.target.closest('[data-remove]')) {
		removeItem(item);
	} else if (event.target.closest('[data-increase]')) {
		changeQuantity(item, 1);
		if (increase.disabled) {
			decrease.focus();
		}
	} else if (event.target.closest('[data-decrease]')) {
		changeQuantity(item, -1);
		if (decrease.disabled) {
			increase.focus();
		}
	}
}

function handleListChange(event) {
	if (event.target.matches('[data-check]')) {
		renderCart();
	}
}

function checkout() {
	const count = list.querySelectorAll('[data-check]:checked').length;
	status.textContent = `Đã đặt ${count} món, tổng ${total.textContent}.`;
}

list.addEventListener('click', handleListClick);
list.addEventListener('change', handleListChange);
checkoutButton.addEventListener('click', checkout);

list.querySelectorAll('[data-item]').forEach(renderItem);
renderCart();
