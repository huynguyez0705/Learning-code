const form = document.querySelector('[data-controls]');
const card = document.querySelector('[data-card]');
const numberText = document.querySelector('[data-number-text]');
const tierText = document.querySelector('[data-tier-text]');
const summary = document.querySelector('[data-summary]');
const log = document.querySelector('[data-log]');
const logTemplate = document.querySelector('[data-log-template]');
const lightNames = { left: 'Trái', center: 'Giữa', right: 'Phải' };
const tierNames = { silver: 'Bạc', gold: 'Vàng', platinum: 'Bạch kim' };
const labels = { light: 'Nguồn sáng', tier: 'Hạng thẻ', mask: 'Số thẻ' };
const maxLogItems = 4;

function readValues() {
	const values = Object.fromEntries(new FormData(form));
	return {
		light: values.light,
		tier: values.tier,
		masked: values.mask === 'on',
	};
}

function describe(values) {
	return {
		light: lightNames[values.light],
		tier: tierNames[values.tier],
		mask: values.masked ? 'đang ẩn' : 'đang hiện',
	};
}

function paint(values) {
	const number = card.dataset.number;
	card.dataset.light = values.light;
	card.dataset.tier = values.tier;
	numberText.textContent = values.masked ? `•••• •••• •••• ${number.slice(-4)}` : number;
	tierText.textContent = `Hạng ${tierNames[values.tier]}`;
	summary.textContent = `Nguồn sáng: ${lightNames[values.light]} · Hạng ${tierNames[values.tier]} · Số thẻ ${values.masked ? 'đang ẩn' : 'đang hiện'}`;
}

function addLog(text) {
	const item = logTemplate.content.cloneNode(true);
	item.querySelector('[data-log-text]').textContent = text;
	log.append(item);
	while (log.children.length > maxLogItems) {
		log.firstElementChild.remove();
	}
}

let previous = describe(readValues());

function handleChange() {
	const values = readValues();
	const now = describe(values);
	paint(values);
	Object.entries(now).forEach(function (entry) {
		const key = entry[0];
		const text = entry[1];
		if (text !== previous[key]) {
			addLog(`${labels[key]}: ${previous[key]} → ${text}`);
		}
	});
	previous = now;
}

function handleReset() {
	const values = readValues();
	log.replaceChildren();
	previous = describe(values);
	paint(values);
}

form.addEventListener('change', handleChange);

form.addEventListener('reset', function () {
	setTimeout(handleReset, 0);
});

paint(readValues());
