import React from 'react';
import styles from './styles.module.css';

const Pins = ({
	pins,
	viewerWidth,
	viewerHeight,
	currentFrameId,
	pinWidth,
	pinHeight,
	renderPin,
	onPinDoubleClick,
	onPinClick
}) => {
	const getPosition = (pin) => {
		if (viewerWidth >= 0 && viewerHeight >= 0) {
			return {
				left: (pin.x * 100).toFixed(3) + '%',
				marginTop: `-${pinHeight / 2}px`,
				marginLeft: `-${pinWidth / 2}px`,
				top: (pin.y * 100).toFixed(3) + '%'
			};
		}
		return { display: 'none' };
	};
	return (
		<div className="tridi-dots-wrapper">
			{pins?.length > 0 &&
				pins
					.filter((pin) => pin.frameId === currentFrameId)
					.map((pin, index) =>
						renderPin ? (
							<div
								key={index}
								className={`tridi-pin ${styles['tridi-pin']}`}
								style={getPosition(pin)}
								onDoubleClick={(e) => {
									e.stopPropagation();
									onPinDoubleClick(pin);
								}}
								onClick={(e) => {
									e.stopPropagation();
									onPinClick(pin);
								}}
							>
								{renderPin(pin)}
							</div>
						) : (
							<div
								key={index}
								className={`tridi-dot ${styles['tridi-dot']}`}
								style={getPosition(pin)}
								onDoubleClick={(e) => {
									e.stopPropagation();
									onPinDoubleClick(pin);
								}}
								onClick={(e) => {
									e.stopPropagation();
									onPinClick(pin);
								}}
							/>
						)
					)}
		</div>
	);
};

Pins.defaultProps = {
	pins: [],
	pinWidth: 10,
	pinHeight: 10,
	onDoubleClick: () => {},
	onPinClick: () => {}
};

export default Pins;
