const STORAGE_KEY = 'bai-028-the-deo';
const MAX_TILT = 18;
const defaults = { holder: 'Nguyễn Minh Anh', role: 'Diễn giả', code: 'DEV-1236' };

const app = document.querySelector('[data-app]');
const stage = app.querySelector('[data-stage]');
const card = app.querySelector('[data-card]');
const form = app.querySelector('[data-form]');
const flipButton = app.querySelector('[data-flip]');
const barcode = app.querySelector('[data-barcode]');
const barTemplate = app.querySelector('[data-bar-template]');
const expiryText = app.querySelector('[data-expiry]');
const bindings = app.querySelectorAll('[data-bind]');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const dateFormatter = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
const state = loadDraft();

function loadDraft() {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw === null ? { ...defaults } : { ...defaults, ...JSON.parse(raw) };
}

function saveDraft() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCode(text) {
	const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
	return clean.replace(/^([A-Z0-9]{3})([A-Z0-9]+)$/, '$1-$2');
}

function checkCode(code) {
	if (!/^[A-Z]{3}-\d{4}$/.test(code)) {
		return 'Mã vé có dạng ABC-1234.';
	}
	const digits = code.slice(4).split('').map(Number);
	const sum = digits.slice(0, 3).reduce(function (total, digit) { return total + digit; }, 0);
	if (sum % 10 !== digits[3]) {
		return 'Chữ số cuối phải là ' + (sum % 10) + '.';
	}
	return '';
}

function validateField(field) {
	if (field.name === 'code') {
		field.setCustomValidity(checkCode(field.value));
	}
	const valid = field.validity.valid;
	app.querySelector('[data-error="' + field.name + '"]').textContent = valid ? '' : field.validationMessage;
	field.setAttribute('aria-invalid', String(!valid));
}

function renderBarcode() {
	const bars = Array.from(state.code).map(function (char) {
		const bar = barTemplate.content.firstElementChild.cloneNode(true);
		bar.style.setProperty('--w', ((char.charCodeAt(0) % 4) + 1) * 2 + 'px');
		return bar;
	});
	barcode.replaceChildren(...bars);
}

function render() {
	bindings.forEach(function (element) {
		element.textContent = state[element.dataset.bind].trim() || '...';
	});
	renderBarcode();
}

function setTilt(x, y) {
	const rotateY = (x - 0.5) * 2 * MAX_TILT;
	const rotateX = -(y - 0.5) * 2 * MAX_TILT;
	const shadow = (0.5 - x) * 40 + 'px ' + ((0.5 - y) * 40 + 24) + 'px 40px rgb(0 0 0 / 0.45)';
	card.style.setProperty('--rx', rotateX.toFixed(2) + 'deg');
	card.style.setProperty('--ry', rotateY.toFixed(2) + 'deg');
	card.style.setProperty('--mx', x * 100 + '%');
	card.style.setProperty('--my', y * 100 + '%');
	card.style.setProperty('--pos', x * 100 + '% ' + y * 100 + '%');
	card.style.setProperty('--shadow', shadow);
}

function handlePointerEnter() {
	if (!reduceMotion.matches) {
		card.toggleAttribute('data-tracking', true);
	}
}

function handlePointerMove(event) {
	if (reduceMotion.matches) {
		return;
	}
	const rect = stage.getBoundingClientRect();
	const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
	const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
	setTilt(x, y);
}

function handlePointerLeave() {
	card.toggleAttribute('data-tracking', false);
	setTilt(0.5, 0.5);
}

function handleInput(event) {
	const field = event.target;
	if (field.name === 'code') {
		field.value = formatCode(field.value);
	}
	state[field.name] = field.value;
	if (field.name !== 'role') {
		validateField(field);
	}
	saveDraft();
	render();
}

function handleClick(event) {
	if (!event.target.closest('[data-flip]')) {
		return;
	}
	const flipped = card.toggleAttribute('data-flipped');
	flipButton.setAttribute('aria-pressed', String(flipped));
	flipButton.textContent = flipped ? 'Lật về mặt trước' : 'Lật thẻ';
	card.querySelector('[data-side="front"]').setAttribute('aria-hidden', String(flipped));
	card.querySelector('[data-side="back"]').setAttribute('aria-hidden', String(!flipped));
}

const expiry = new Date();
expiry.setDate(expiry.getDate() + 30);
expiryText.textContent = 'Hạn dùng: ' + dateFormatter.format(expiry);
card.querySelector('[data-side="back"]').setAttribute('aria-hidden', 'true');
form.elements.holder.value = state.holder;
form.elements.role.value = state.role;
form.elements.code.value = state.code;
setTilt(0.5, 0.5);
render();
stage.addEventListener('pointerenter', handlePointerEnter);
stage.addEventListener('pointermove', handlePointerMove);
stage.addEventListener('pointerleave', handlePointerLeave);
form.addEventListener('input', handleInput);
app.addEventListener('click', handleClick);
