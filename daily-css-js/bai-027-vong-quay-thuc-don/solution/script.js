const DAY_COUNT = 7;
const STEP_ANGLE = 360 / DAY_COUNT;

const app = document.querySelector('[data-app]');
const ring = app.querySelector('[data-ring]');
const days = Array.from(ring.querySelectorAll('[data-day]'));
const jumpButtons = app.querySelectorAll('[data-jump]');
const detail = app.querySelector('[data-detail]');
const todayNote = app.querySelector('[data-today-note]');

const todayFormatter = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
const todayIndex = (new Date().getDay() + 6) % DAY_COUNT;
const state = { turns: todayIndex };

function wrap(value) {
	return ((value % DAY_COUNT) + DAY_COUNT) % DAY_COUNT;
}

function getActive() {
	return wrap(state.turns);
}

function render() {
	const active = getActive();
	const activeDay = days[active];
	ring.style.setProperty('--rot', -state.turns * STEP_ANGLE + 'deg');
	days.forEach(function (day, index) {
		day.toggleAttribute('data-active', index === active);
		day.setAttribute('aria-hidden', String(index !== active));
	});
	jumpButtons.forEach(function (button) {
		button.setAttribute('aria-pressed', String(Number(button.dataset.jump) === active));
	});
	detail.textContent = activeDay.dataset.name + ': ' + activeDay.dataset.dish + ', khoảng ' + activeDay.dataset.kcal + ' kcal.';
}

function turnTo(index) {
	let delta = wrap(index - getActive());
	if (delta > DAY_COUNT / 2) {
		delta -= DAY_COUNT;
	}
	state.turns += delta;
	render();
}

function handleClick(event) {
	const stepButton = event.target.closest('[data-step]');
	if (stepButton) {
		state.turns += Number(stepButton.dataset.step);
		render();
		return;
	}
	const jumpButton = event.target.closest('[data-jump]');
	if (jumpButton) {
		turnTo(Number(jumpButton.dataset.jump));
	}
}

function handleKeydown(event) {
	if (event.key === 'ArrowLeft') {
		state.turns -= 1;
		render();
	} else if (event.key === 'ArrowRight') {
		state.turns += 1;
		render();
	}
}

days.forEach(function (day, index) {
	day.style.setProperty('--a', index * STEP_ANGLE + 'deg');
	day.toggleAttribute('data-today', index === todayIndex);
});
todayNote.textContent = 'Hôm nay: ' + todayFormatter.format(new Date());
app.addEventListener('click', handleClick);
document.addEventListener('keydown', handleKeydown);
render();
