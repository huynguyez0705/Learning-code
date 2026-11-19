import { useState } from 'react';
function App() {
	const [dem, setDem] = useState(0);
	const tang = () => {
		setDem(dem + 1);
	};
	return (
		<div>
			<h1>Đếm: {dem}</h1>
			<button onClick={tang}>Click</button>
			<button
				onClick={function () {
					setDem(dem - 1);
				}}
			>
				Click
			</button>
			<button
				onClick={function () {
					setDem(0);
				}}
			>
				Reset
			</button>
		</div>
	);
}
export default App;
