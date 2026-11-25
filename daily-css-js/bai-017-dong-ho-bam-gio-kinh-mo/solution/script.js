const watch = document.querySelector('[data-watch]');
const display = document.querySelector('[data-display]');
const toggleButton = document.querySelector('[data-toggle]');
const lapButton = document.querySelector('[data-lap]');
const resetButton = document.querySelector('[data-reset]');
const lapList = document.querySelector('[data-laps]');
const template = document.querySelector('[data-lap-template]');
let timerId = null;
let startedAt = 0;
let elapsedBefore = 0;
let lastLapTotal = 0;

function pad(number) {
	return String(number).padStart(2, '0');
}

function formatTime(ms) {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor(ms / 1000) % 60;
	const centis = Math.floor(ms / 10) % 100;
	return `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
}

function getElapsed() {
	if (timerId === null) {
		return elapsedBefore;
	}
	return elapsedBefore + Date.now() - startedAt;
}

function tick() {
	display.textContent = formatTime(getElapsed());
}

function render() {
	const running = timerId !== null;
	const hasTime = getElapsed() > 0;
	watch.toggleAttribute('data-running', running);
	toggleButton.textContent = running ? 'Tạm dừng' : hasTime ? 'Tiếp tục' : 'Bắt đầu';
	lapButton.disabled = !running;
	resetButton.disabled = !hasTime;
	tick();
}

function start() {
	startedAt = Date.now();
	timerId = setInterval(tick, 20);
	render();
}

function pause() {
	elapsedBefore = getElapsed();
	clearInterval(timerId);
	timerId = null;
	render();
}

function markExtremes() {
	const laps = Array.from(lapList.children);
	const durations = laps.map(function (lap) {
		return Number(lap.dataset.duration);
	});
	const best = Math.min(...durations);
	const worst = Math.max(...durations);
	laps.forEach(function (lap, index) {
		lap.toggleAttribute('data-best', laps.length > 1 && durations[index] === best);
		lap.toggleAttribute('data-worst', laps.length > 1 && durations[index] === worst);
	});
}

function addLap() {
	const total = getElapsed();
	const duration = total - lastLapTotal;
	const item = template.content.firstElementChild.cloneNode(true);
	lastLapTotal = total;
	item.dataset.duration = duration;
	item.querySelector('[data-lap-number]').textContent = `Vòng ${lapList.children.length + 1}`;
	item.querySelector('[data-lap-time]').textContent = formatTime(duration);
	item.querySelector('[data-lap-total]').textContent = formatTime(total);
	lapList.prepend(item);
	markExtremes();
}

function reset() {
	clearInterval(timerId);
	timerId = null;
	startedAt = 0;
	elapsedBefore = 0;
	lastLapTotal = 0;
	lapList.replaceChildren();
	render();
}

toggleButton.addEventListener('click', function () {
	if (timerId === null) {
		start();
	} else {
		pause();
	}
});

lapButton.addEventListener('click', addLap);
resetButton.addEventListener('click', reset);

render();
