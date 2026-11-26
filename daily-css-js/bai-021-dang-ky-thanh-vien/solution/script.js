const minAge = 16;
const messages = {
	username: {
		valueMissing: 'Hãy nhập tên đăng nhập.',
		tooShort: 'Tên đăng nhập cần ít nhất 4 ký tự.',
		patternMismatch: 'Chỉ dùng chữ thường không dấu, số và dấu gạch dưới.',
	},
	email: { valueMissing: 'Hãy nhập email.', typeMismatch: 'Email chưa đúng dạng, ví dụ ten@example.com.' },
	birth: { valueMissing: 'Hãy chọn ngày sinh.', badInput: 'Ngày sinh chưa hợp lệ.', rangeOverflow: `Bạn cần từ ${minAge} tuổi trở lên.` },
	password: { valueMissing: 'Hãy nhập mật khẩu.', tooShort: 'Mật khẩu cần ít nhất 8 ký tự.' },
	confirm: { valueMissing: 'Hãy nhập lại mật khẩu.' },
	terms: { valueMissing: 'Bạn cần đồng ý với nội quy.' },
};
const passwordRules = [/.{8}/, /.{12}/, /[a-z].*[A-Z]|[A-Z].*[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
const levelNames = { none: 'chưa nhập', weak: 'yếu', medium: 'trung bình', strong: 'mạnh' };
const form = document.querySelector('[data-form]');
const fields = Array.from(form.querySelectorAll('[data-field]'));
const meter = document.querySelector('[data-meter]');
const strengthText = document.querySelector('[data-strength-text]');
const remaining = document.querySelector('[data-remaining]');
const success = document.querySelector('[data-success]');
const successText = document.querySelector('[data-success-text]');
const restartButton = document.querySelector('[data-restart]');
const dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long', timeZone: 'UTC' });
const state = { user: null };

function pad(number) {
	return String(number).padStart(2, '0');
}

function setBirthLimit() {
	const limit = new Date();
	limit.setFullYear(limit.getFullYear() - minAge);
	form.elements.birth.max = `${limit.getFullYear()}-${pad(limit.getMonth() + 1)}-${pad(limit.getDate())}`;
}

function getMessage(field) {
	const validity = field.validity;
	if (validity.valid) {
		return '';
	}
	if (validity.customError) {
		return field.validationMessage;
	}
	const table = messages[field.name];
	const key = Object.keys(table).find(function (name) {
		return validity[name];
	});
	return key === undefined ? 'Giá trị chưa hợp lệ.' : table[key];
}

function renderField(field) {
	const error = form.querySelector(`[data-error-for="${field.name}"]`);
	const message = field.hasAttribute('data-touched') ? getMessage(field) : '';
	error.textContent = message;
	field.setAttribute('aria-invalid', message === '' ? 'false' : 'true');
}

function scorePassword(value) {
	return passwordRules.filter(function (rule) {
		return rule.test(value);
	}).length;
}

function renderMeter() {
	const value = form.elements.password.value;
	const score = scorePassword(value);
	let level = 'strong';
	if (value === '') {
		level = 'none';
	} else if (score <= 2) {
		level = 'weak';
	} else if (score <= 4) {
		level = 'medium';
	}
	meter.dataset.level = level;
	meter.style.setProperty('--pct', `${score * 20}%`);
	strengthText.textContent = `Độ mạnh: ${levelNames[level]}`;
}

function checkConfirm() {
	const confirm = form.elements.confirm;
	const mismatch = confirm.value !== '' && confirm.value !== form.elements.password.value;
	confirm.setCustomValidity(mismatch ? 'Mật khẩu nhập lại chưa khớp.' : '');
}

function renderRemaining() {
	const count = form.querySelectorAll('[data-field]:invalid').length;
	remaining.textContent = count === 0 ? 'Mọi ô đã hợp lệ' : `Còn ${count} ô chưa hợp lệ`;
}

function renderView() {
	form.hidden = state.user !== null;
	success.hidden = state.user === null;
	if (state.user !== null) {
		successText.textContent = `Chào ${state.user.name}! Ngày sinh của bạn là ${dateFormat.format(new Date(state.user.birth))}.`;
		success.focus();
	}
}

function handleInput(event) {
	const field = event.target;
	if (field.name === 'password') {
		renderMeter();
	}
	checkConfirm();
	renderField(field);
	renderField(form.elements.confirm);
	renderRemaining();
}

function handleFocusOut(event) {
	if (!event.target.matches('[data-field]')) {
		return;
	}
	event.target.toggleAttribute('data-touched', true);
	renderField(event.target);
}

function handleSubmit(event) {
	event.preventDefault();
	if (!form.checkValidity()) {
		fields.forEach(function (field) {
			field.toggleAttribute('data-touched', true);
			renderField(field);
		});
		form.querySelector('[data-field]:invalid').focus();
		return;
	}
	state.user = { name: form.elements.username.value, birth: form.elements.birth.value };
	renderView();
}

function handleRestart() {
	state.user = null;
	form.reset();
	checkConfirm();
	fields.forEach(function (field) {
		field.removeAttribute('data-touched');
		renderField(field);
	});
	renderMeter();
	renderRemaining();
	renderView();
	form.elements.username.focus();
}

form.addEventListener('input', handleInput);
form.addEventListener('focusout', handleFocusOut);
form.addEventListener('submit', handleSubmit);
restartButton.addEventListener('click', handleRestart);

setBirthLimit();
renderMeter();
renderRemaining();
