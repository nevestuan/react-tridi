import React, { useState, useRef } from 'react';

import Tridi from 'react-tridi';
import 'react-tridi/dist/index.css';

const App = () => {
	const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
	const tridiRef = useRef(null);

	const frameChangeHandler = (currentFrameIndex) => {
		console.log('current frame index', currentFrameIndex);
	};

	const recordStartHandler = (pins) => console.log('on record start', pins);

	const recordStopHandler = (pins) => console.log('on record stop', pins);

	const pinClickHandler = (pin) => console.log('on pin click', pin);

	return (
		<div style={{ width: '500px' }}>
			<Tridi
				ref={tridiRef}
				location="./images"
				format="jpg"
				count="36"
				onFrameChange={frameChangeHandler}
				autoplaySpeed={70}
				onAutoplayStart={() => setIsAutoPlayRunning(true)}
				onAutoplayStop={() => setIsAutoPlayRunning(false)}
				onRecordStart={recordStartHandler}
				onRecordStop={recordStopHandler}
				onPinClick={pinClickHandler}
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
