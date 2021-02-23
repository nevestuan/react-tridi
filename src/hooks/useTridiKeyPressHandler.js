import { useEffect, useRef } from 'react';

// Hook
export default function useTridiKeyPressHandler({ nextMove, prevMove }) {
	const refPrevMove = useRef();
	const refNextMove = useRef();

	useEffect(() => {
		refPrevMove.current = prevMove;
		refNextMove.current = nextMove;
	}, [nextMove, prevMove]);

	// If pressed key is our target key then set to true
	function downHandler({ key }) {
		// console.log('down', key);
	}

	// If released key is our target key then set to false
	const upHandler = ({ key }) => {
		const keyEventConfig = {
			ArrowLeft: refPrevMove,
			ArrowRight: refNextMove
		};
		const keyEventHandler = keyEventConfig[key];
		if (keyEventHandler) {
			keyEventHandler.current();
		}
	};

	// Add event listeners
	useEffect(() => {
		window.addEventListener('keydown', downHandler);
		window.addEventListener('keyup', upHandler);
		// Remove event listeners on cleanup
		return () => {
			window.removeEventListener('keydown', downHandler);
			window.removeEventListener('keyup', upHandler);
		};
	}, []); // Empty array ensures that effect is only run on mount and unmount
}
