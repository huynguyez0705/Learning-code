const cities = [
	{ id: 'ha-noi', name: 'Hà Nội', temp: 24, weather: 'cloudy', text: 'Nhiều mây, se lạnh', humidity: 78, wind: 12 },
	{ id: 'da-nang', name: 'Đà Nẵng', temp: 31, weather: 'sunny', text: 'Nắng đẹp, trời trong', humidity: 62, wind: 18 },
	{ id: 'hue', name: 'Huế', temp: 26, weather: 'rain', text: 'Mưa rào kéo dài', humidity: 91, wind: 9 },
	{ id: 'sai-gon', name: 'Sài Gòn', temp: 34, weather: 'sunny', text: 'Nắng gắt, oi nóng', humidity: 55, wind: 7 },
];

const picker = document.querySelector('[data-picker]');
const card = document.querySelector('[data-card]');
const cityName = document.querySelector('[data-city]');
const temp = document.querySelector('[data-temp]');
const desc = document.querySelector('[data-desc]');
const humidity = document.querySelector('[data-humidity]');
const wind = document.querySelector('[data-wind]');

function findCity(id) {
	return cities.find(function (city) {
		return city.id === id;
	});
}

function showCity(id) {
	const city = findCity(id);
	if (!city) return;
	cityName.textContent = city.name;
	temp.textContent = `${city.temp}°`;
	desc.textContent = city.text;
	humidity.textContent = `${city.humidity}%`;
	wind.textContent = `${city.wind} km/h`;
	card.dataset.weather = city.weather;
	picker.querySelectorAll('[data-city-id]').forEach(function (button) {
		button.setAttribute('aria-pressed', String(button.dataset.cityId === id));
	});
}

function handlePickerClick(event) {
	const button = event.target.closest('[data-city-id]');
	if (!button) return;
	showCity(button.dataset.cityId);
}

function handleKeydown(event) {
	if (event.ctrlKey || event.metaKey || event.altKey) return;
	const index = Number(event.key) - 1;
	if (!Number.isInteger(index) || index < 0 || index >= cities.length) return;
	const city = cities[index];
	showCity(city.id);
	picker.querySelector(`[data-city-id="${city.id}"]`).focus();
}

picker.addEventListener('click', handlePickerClick);
document.addEventListener('keydown', handleKeydown);
showCity('ha-noi');
