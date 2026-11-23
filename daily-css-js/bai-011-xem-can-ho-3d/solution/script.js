const ring = document.querySelector('[data-ring]');
const panels = Array.from(ring.querySelectorAll('[data-panel]'));
const dotsBox = document.querySelector('[data-dots]');
const dots = Array.from(dotsBox.querySelectorAll('[data-go]'));
const info = document.querySelector('[data-info]');
const prevButton = document.querySelector('[data-prev]');
const nextButton = document.querySelector('[data-next]');
const formatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });
const step = 60;
let current = 0;

function render() {
	ring.style.setProperty('--angle', `${-current * step}deg`);
	panels.forEach(function (panel, index) {
		panel.toggleAttribute('data-active', index === current);
	});
	dots.forEach(function (dot, index) {
		dot.toggleAttribute('data-active', index === current);
		if (index === current) {
			dot.setAttribute('aria-current', 'true');
		} else {
			dot.removeAttribute('aria-current');
		}
	});
	const data = panels[current].dataset;
	const price = formatter.format(Number(data.price) / 1000000000);
	info.textContent = `${current + 1}/${panels.length} · ${data.name} · ${data.area} m² · ${price} tỷ`;
	prevButton.disabled = current === 0;
	nextButton.disabled = current === panels.length - 1;
}

function goTo(index) {
	current = Math.max(0, Math.min(panels.length - 1, index));
	render();
}

prevButton.addEventListener('click', function () {
	goTo(current - 1);
});

nextButton.addEventListener('click', function () {
	goTo(current + 1);
});

dotsBox.addEventListener('click', function (event) {
	const dot = event.target.closest('[data-go]');
	if (!dot) {
		return;
	}
	goTo(Number(dot.dataset.go));
});

document.addEventListener('keydown', function (event) {
	if (event.key === 'ArrowLeft') {
		goTo(current - 1);
	}
	if (event.key === 'ArrowRight') {
		goTo(current + 1);
	}
});

render();
