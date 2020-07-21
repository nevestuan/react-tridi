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
				showControlBar
			/>
			<button onClick={() => tridiRef.current.prev()}>Prev</button>
			<button onClick={() => tridiRef.current.next()}>Next</button>
			<button onClick={() => tridiRef.current.toggleAutoplay(!isAutoPlayRunning)}>
				{isAutoPlayRunning ? 'Pause' : 'Autoplay'}
			</button>
		</div>
	);
};

export default App;
