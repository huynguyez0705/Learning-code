const safe = document.querySelector('[data-safe]');
const vault = document.querySelector('[data-vault]');
const door = document.querySelector('[data-door]');
const display = document.querySelector('[data-display]');
const keypad = document.querySelector('[data-keypad]');
const message = document.querySelector('[data-message]');
const closeButton = document.querySelector('[data-close]');
const secret = safe.dataset.secret;
const maxTries = 3;
const lockSeconds = 5;
let pin = '';
let tries = 0;

function renderDisplay() {
	display.textContent = '●'.repeat(pin.length).padEnd(secret.length, '○');
}

function setOpen(open) {
	if (open) {
		closeButton.hidden = false;
		closeButton.focus();
	} else {
		closeButton.hidden = true;
	}
	door.toggleAttribute('data-open', open);
	door.toggleAttribute('inert', open);
	vault.toggleAttribute('inert', !open);
}

function lockKeypad() {
	keypad.disabled = true;
	display.focus();
	message.textContent = `Sai ${maxTries} lần. Bàn phím khoá ${lockSeconds} giây.`;
	setTimeout(function () {
		keypad.disabled = false;
		tries = 0;
		message.textContent = 'Bàn phím đã mở khoá. Hãy thử lại.';
	}, lockSeconds * 1000);
}

function submitPin() {
	if (pin.length < secret.length) {
		message.textContent = `Cần nhập đủ ${secret.length} chữ số.`;
		return;
	}
	if (pin === secret) {
		tries = 0;
		message.textContent = 'Mã đúng. Cửa két đã mở.';
		setOpen(true);
		return;
	}
	tries += 1;
	pin = '';
	renderDisplay();
	if (tries >= maxTries) {
		lockKeypad();
	} else {
		message.textContent = `Sai mã. Còn ${maxTries - tries} lần thử.`;
	}
}

function pressKey(key) {
	if (keypad.disabled || door.hasAttribute('data-open')) {
		return;
	}
	if (key === 'enter') {
		submitPin();
		return;
	}
	if (key === 'back') {
		pin = pin.slice(0, -1);
	} else if (pin.length < secret.length) {
		pin += key;
	}
	message.textContent = '';
	renderDisplay();
}

keypad.addEventListener('click', function (event) {
	const button = event.target.closest('[data-key]');
	if (!button) {
		return;
	}
	pressKey(button.dataset.key);
});

document.addEventListener('keydown', function (event) {
	if (/^[0-9]$/.test(event.key)) {
		pressKey(event.key);
	} else if (event.key === 'Backspace') {
		pressKey('back');
	} else if (event.key === 'Enter' && !event.target.closest('button')) {
		pressKey('enter');
	}
});

closeButton.addEventListener('click', function () {
	pin = '';
	renderDisplay();
	message.textContent = '';
	setOpen(false);
	keypad.querySelector('[data-key="1"]').focus();
});

renderDisplay();
