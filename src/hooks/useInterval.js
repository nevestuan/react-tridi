// https://github.com/johndiiorio/react-useinterval
import { useEffect, useRef } from 'react';

export default function useInterval(callback, delay, ...args) {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			savedCallback.current(...args);
		}
		if (delay !== null && delay !== undefined) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}
