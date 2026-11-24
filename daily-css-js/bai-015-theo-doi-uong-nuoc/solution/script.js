const goal = 2000;
const minAmount = 50;
const maxAmount = 1000;
const logs = [];
const ring = document.querySelector('[data-ring]');
const totalOutput = document.querySelector('[data-total]');
const litresText = document.querySelector('[data-litres]');
const percentText = document.querySelector('[data-percent]');
const statusText = document.querySelector('[data-status]');
const quick = document.querySelector('[data-quick]');
const form = document.querySelector('[data-form]');
const errorText = document.querySelector('[data-error]');
const undoButton = document.querySelector('[data-undo]');
const empty = document.querySelector('[data-empty]');
const logList = document.querySelector('[data-log]');
const template = document.querySelector('[data-log-template]');

function getTotal() {
	return logs.reduce(function (sum, amount) {
		return sum + amount;
	}, 0);
}

function createLogItem(amount) {
	const item = template.content.firstElementChild.cloneNode(true);
	item.querySelector('[data-log-amount]').textContent = `+${amount} ml`;
	return item;
}

function render() {
	const total = getTotal();
	const percent = Math.min(100, Math.floor((total / goal) * 100));
	ring.style.setProperty('--pct', percent);
	ring.toggleAttribute('data-reached', total >= goal);
	totalOutput.textContent = total;
	litresText.textContent = `${(total / 1000).toFixed(2)} L`;
	percentText.textContent = `${percent}%`;
	statusText.textContent = total >= goal ? 'Đạt mục tiêu hôm nay!' : '';
	undoButton.disabled = logs.length === 0;
	empty.hidden = logs.length > 0;
	const items = logs.slice(-5).reverse().map(createLogItem);
	logList.replaceChildren(...items);
}

function addWater(amount) {
	logs.push(amount);
	errorText.textContent = '';
	render();
}

quick.addEventListener('click', function (event) {
	const button = event.target.closest('[data-add]');
	if (!button) {
		return;
	}
	addWater(Number(button.dataset.add));
});

form.addEventListener('submit', function (event) {
	event.preventDefault();
	const amount = Number(new FormData(form).get('amount').trim());
	if (!Number.isInteger(amount) || amount < minAmount || amount > maxAmount) {
		errorText.textContent = `Nhập số nguyên từ ${minAmount} đến ${maxAmount} ml.`;
		return;
	}
	addWater(amount);
	form.reset();
});

undoButton.addEventListener('click', function () {
	if (logs.length === 0) {
		return;
	}
	logs.pop();
	render();
});

render();
