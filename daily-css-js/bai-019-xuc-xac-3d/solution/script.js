const app = document.querySelector('[data-app]');
const cube = document.querySelector('[data-cube]');
const rollButton = document.querySelector('[data-roll]');
const clearButton = document.querySelector('[data-clear]');
const result = document.querySelector('[data-result]');
const historyText = document.querySelector('[data-history]');
const stats = document.querySelector('[data-stats]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const faceAngles = {
	1: { x: 0, y: 0 },
	2: { x: -90, y: 0 },
	3: { x: 0, y: -90 },
	4: { x: 0, y: 90 },
	5: { x: 90, y: 0 },
	6: { x: 0, y: 180 },
};
const rolls = [];
const counts = Array.from({ length: 6 }, function () {
	return 0;
});
let rolling = false;
let pendingValue = 0;
let spins = 0;

function renderStats() {
	const total = rolls.length;
	const sum = rolls.reduce(function (acc, value) {
		return acc + value;
	}, 0);
	counts.forEach(function (count, index) {
		const row = stats.querySelector(`[data-row="${index + 1}"]`);
		const percent = total === 0 ? 0 : Math.round((count / total) * 100);
		row.querySelector('[data-count]').textContent = count;
		row.querySelector('[data-fill]').style.setProperty('--pct', `${percent}%`);
	});
	if (total === 0) {
		historyText.textContent = '';
		return;
	}
	historyText.textContent = `Gần đây: ${rolls.slice(-8).join(', ')}. Tổng ${sum}, trung bình ${(sum / total).toFixed(2)}.`;
}

function finishRoll() {
	rolling = false;
	app.toggleAttribute('data-rolling', false);
	rolls.push(pendingValue);
	counts[pendingValue - 1] += 1;
	result.textContent = `Kết quả: ${pendingValue}`;
	renderStats();
}

function roll() {
	if (rolling) {
		return;
	}
	rolling = true;
	app.toggleAttribute('data-rolling', true);
	pendingValue = Math.floor(Math.random() * 6) + 1;
	spins += 1;
	const angle = faceAngles[pendingValue];
	cube.style.setProperty('--rx', `${angle.x + spins * 720}deg`);
	cube.style.setProperty('--ry', `${angle.y + spins * 720}deg`);
	result.textContent = 'Đang lắc...';
	if (reduceMotion.matches) {
		finishRoll();
	}
}

function clearStats() {
	if (rolling) {
		return;
	}
	rolls.length = 0;
	counts.fill(0);
	result.textContent = 'Hãy lắc xúc xắc.';
	renderStats();
}

cube.addEventListener('transitionend', function (event) {
	if (!rolling || event.target !== cube || event.propertyName !== 'transform') {
		return;
	}
	finishRoll();
});

rollButton.addEventListener('click', roll);
clearButton.addEventListener('click', clearStats);

renderStats();
