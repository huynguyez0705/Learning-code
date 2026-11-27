const app = document.querySelector('[data-app]');
const form = app.querySelector('[data-controls]');
const card = app.querySelector('[data-card]');
const arm = app.querySelector('[data-arm]');
const code = app.querySelector('[data-code]');
const reach = app.querySelector('[data-reach]');
const presetButtons = app.querySelectorAll('[data-preset]');

const presets = {
	mem: { angle: 330, distance: 12, blur: 32, opacity: 20 },
	cung: { angle: 315, distance: 10, blur: 0, opacity: 35 },
	noi: { angle: 20, distance: 28, blur: 48, opacity: 40 },
};
const controls = ['angle', 'distance', 'blur', 'opacity'];
const units = { angle: '°', distance: ' px', blur: ' px', opacity: '%' };

let state = structuredClone(presets.mem);
let activePreset = 'mem';

function getShadow(values) {
	const radians = (values.angle * Math.PI) / 180;
	const x = Math.round(-Math.sin(radians) * values.distance);
	const y = Math.round(Math.cos(radians) * values.distance);
	const alpha = (values.opacity / 100).toFixed(2);
	return x + 'px ' + y + 'px ' + values.blur + 'px 0 rgb(0 0 0 / ' + alpha + ')';
}

function render() {
	const shadow = getShadow(state);
	card.style.setProperty('--shadow', shadow);
	arm.style.setProperty('--angle', state.angle + 'deg');
	controls.forEach(function (name) {
		form.elements[name].value = state[name];
		form.querySelector('[data-output="' + name + '"]').textContent = state[name] + units[name];
	});
	code.textContent = 'box-shadow: ' + shadow + ';';
	reach.textContent = state.distance + state.blur + ' px';
	presetButtons.forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.preset === activePreset));
	});
}

function handleInput(event) {
	const name = event.target.name;
	if (!controls.includes(name)) {
		return;
	}
	state[name] = event.target.valueAsNumber;
	activePreset = '';
	render();
}

function applyPreset(name) {
	state = structuredClone(presets[name]);
	activePreset = name;
	render();
}

function handleClick(event) {
	const button = event.target.closest('[data-preset]');
	if (button) {
		applyPreset(button.dataset.preset);
	}
}

form.addEventListener('input', handleInput);
app.addEventListener('click', handleClick);
render();
