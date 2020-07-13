import React, { useState, useRef } from 'react';

import Tridi from 'react-tridi';
import 'react-tridi/dist/index.css';

const App = () => {
	const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
	const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
	const tridiRef = useRef(null);

	const frameChangeHandler = (currentFrameIndex) => {
		setCurrentFrameIndex(currentFrameIndex);
	};

	const dotPosition = [
		{ left: 188, top: 118 },
		{ left: 209, top: 118 },
		{ left: 232, top: 118 },
		{ left: 258, top: 118 },
		{ left: 283, top: 118 },
		{ left: 306, top: 118 },
		{ left: 328, top: 118 },
		{ left: 348, top: 118 },
		{ left: 346, top: 118 },
		{ left: 346, top: 118 },
		{ left: 338, top: 118 },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ display: 'none' },
		{ left: 158, top: 100 },
		{ left: 146, top: 104 },
		{ left: 139, top: 108 },
		{ left: 139, top: 112 },
		{ left: 138, top: 114 },
		{ left: 144, top: 118 },
		{ left: 154, top: 118 },
		{ left: 166, top: 118 },
		{ left: 169, top: 118 }
	];

	return (
		<div style={{ width: '500px', position: 'relative' }}>
			<Tridi
				ref={tridiRef}
				location="./images"
				format="jpg"
				count="36"
				onFrameChange={frameChangeHandler}
				autoplaySpeed={70}
				onAutoplayStart={() => setIsAutoPlayRunning(true)}
				onAutoplayStop={() => setIsAutoPlayRunning(false)}
				inverse
			/>
			<div className="dot" style={dotPosition[currentFrameIndex]}></div>
			<button onClick={() => tridiRef.current.prev()}>Prev</button>
			<button onClick={() => tridiRef.current.next()}>Next</button>
			<button onClick={() => tridiRef.current.toggleAutoplay(!isAutoPlayRunning)}>
				{isAutoPlayRunning ? 'Pause' : 'Autoplay'}
			</button>
		</div>
	);
};

export default App;
