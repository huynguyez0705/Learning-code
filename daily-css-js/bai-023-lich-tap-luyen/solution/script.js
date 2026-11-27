const app = document.querySelector('[data-app]');
const grid = app.querySelector('[data-grid]');
const title = app.querySelector('[data-title]');
const summary = app.querySelector('[data-summary]');
const detail = app.querySelector('[data-detail]');
const dayTemplate = app.querySelector('[data-day-template]');
const blankTemplate = app.querySelector('[data-blank-template]');

const monthFormatter = new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' });
const dayFormatter = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
const workouts = ['Chạy bộ 5 km', 'Yoga 30 phút', 'Bơi 20 vòng', 'Đạp xe 15 km'];
const levelNames = ['Ngày nghỉ', 'Cường độ nhẹ', 'Cường độ vừa', 'Cường độ nặng'];
const emptyDetail = 'Chọn một ngày để xem chi tiết.';

const today = new Date();
const state = { year: today.getFullYear(), month: today.getMonth(), selected: 0 };

function isRestDay(date) {
	return date.getDay() === 0;
}

function getLevel(date) {
	if (isRestDay(date)) {
		return 0;
	}
	return 1 + ((date.getDate() * 5 + date.getMonth()) % 3);
}

function isToday(date) {
	return (
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate()
	);
}

function createDayButton(date) {
	const button = dayTemplate.content.firstElementChild.cloneNode(true);
	button.dataset.day = date.getDate();
	button.dataset.level = getLevel(date);
	button.textContent = date.getDate();
	button.disabled = isRestDay(date);
	button.toggleAttribute('data-today', isToday(date));
	button.setAttribute('aria-pressed', String(state.selected === date.getDate()));
	return button;
}

function render() {
	const first = new Date(state.year, state.month, 1);
	const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
	const blanks = (first.getDay() + 6) % 7;
	const cells = [];
	let trained = 0;
	for (let i = 0; i < blanks; i += 1) {
		cells.push(blankTemplate.content.firstElementChild.cloneNode(true));
	}
	for (let day = 1; day <= daysInMonth; day += 1) {
		const date = new Date(state.year, state.month, day);
		if (!isRestDay(date)) {
			trained += 1;
		}
		cells.push(createDayButton(date));
	}
	grid.replaceChildren(...cells);
	title.textContent = monthFormatter.format(first);
	summary.textContent = trained + ' ngày tập · ' + (daysInMonth - trained) + ' ngày nghỉ';
}

function selectDay(day) {
	state.selected = day;
	const date = new Date(state.year, state.month, day);
	grid.querySelectorAll('[data-day]').forEach(function (button) {
		button.setAttribute('aria-pressed', String(Number(button.dataset.day) === day));
	});
	detail.textContent =
		dayFormatter.format(date) + ' · ' + levelNames[getLevel(date)] + ' · ' + workouts[(day + state.month) % workouts.length];
}

function changeMonth(step) {
	const next = new Date(state.year, state.month + step, 1);
	state.year = next.getFullYear();
	state.month = next.getMonth();
	state.selected = 0;
	detail.textContent = emptyDetail;
	render();
}

function handleClick(event) {
	const dayButton = event.target.closest('[data-day]');
	if (dayButton) {
		selectDay(Number(dayButton.dataset.day));
		return;
	}
	if (event.target.closest('[data-prev]')) {
		changeMonth(-1);
		return;
	}
	if (event.target.closest('[data-next]')) {
		changeMonth(1);
	}
}

app.addEventListener('click', handleClick);
render();
