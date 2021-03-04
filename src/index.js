import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
	useCallback,
	Fragment
} from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import DragIcon from './assets/icons/drag.svg';

import useInterval from './hooks/useInterval';
import useTridiKeyPressHandler from './hooks/useTridiKeyPressHandler';
import ControlBar from './components/ControlBar';
import Pins from './components/Pins';
import StatusBar from './components/StatusBar';

class TridiUtils {
	static isValidProps = ({ images, format, location }) => {
		let isValid = true;
		if (!images && !format) {
			console.error(
				"'format' property is missing or invalid. Image format must be provided for 'numbered' property."
			);
			isValid = false;
		}
		if (images === 'numbered' && !location) {
			console.error(
				"'location' property is missing or invalid. Image location must be provided for 'numbered' property."
			);
			isValid = false;
		}
		return isValid;
	};

	static normalizedImages = (images, format, location, count) => {
		if (images === 'numbered') {
			return Array.apply(null, { length: count }).map((_a, index) => {
				return `${location}/${index + 1}.${format.toLowerCase()}`;
			});
		}
		return images;
	};

	static uid = () => {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	};
}

const Tridi = forwardRef(
	(
		{
			className,
			style,
			images,
			pins,
			pinWidth,
			pinHeight,
			setPins,
			format,
			location,
			count,
			draggable,
			hintOnStartup,
			hintText,
			autoplay,
			autoplaySpeed,
			stopAutoplayOnClick,
			stopAutoplayOnMouseEnter,
			resumeAutoplayOnMouseLeave,
			touch,
			mousewheel,
			inverse,
			dragInterval,
			touchDragInterval,
			mouseleaveDetect,
			showControlBar,
			showStatusBar,
			renderPin,
			renderHint,
			onHintHide,
			onAutoplayStart,
			onAutoplayStop,
			onNextMove,
			onPrevMove,
			onNextFrame,
			onPrevFrame,
			onDragStart,
			onDragEnd,
			onFrameChange,
			onRecordStart,
			onRecordStop,
			onPinClick,
			onZoom,
			maxZoom,
			minZoom
		},
		ref
	) => {
		const [moveBuffer, setMoveBuffer] = useState([]);
		const [hintVisible, setHintVisible] = useState(hintOnStartup);
		const [currentImageIndex, setCurrentImageIndex] = useState(0);
		const [zoom, setZoom] = useState(1);
		const [isDragging, setIsDragging] = useState(false);
		const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
		const [isRecording, setIsRecording] = useState(false);
		const [recordingSessionId, setRecordingSessionId] = useState(null);
		const [isPlaying, setIsPlaying] = useState(false);
		const [isMoveing, setIsMoveing] = useState(false);

		const [viewerImageOfset, setViewerImageOfset] = useState({ x: 0, y: 0 });
		const [moveingMouseDownPoint, setMoveingMouseDownPoint] = useState(null);

		const _count = Array.isArray(images) ? images.length : Number(count);
		const _images = TridiUtils.normalizedImages(images, format, location, _count);
		const _viewerImageRef = useRef(null);
		const _draggable = !isRecording && draggable;

		const hideHint = () => {
			setHintVisible(false);
			onHintHide();
		};

		const nextFrame = useCallback(() => {
			const newIndex = currentImageIndex >= _count - 1 ? 0 : currentImageIndex + 1;
			setCurrentImageIndex(newIndex);
			onNextFrame();
			onFrameChange(newIndex);
		}, [_count, currentImageIndex, onFrameChange, onNextFrame]);

		const prevFrame = useCallback(() => {
			const newIndex = currentImageIndex <= 0 ? _count - 1 : currentImageIndex - 1;
			setCurrentImageIndex(newIndex);
			onPrevFrame();
			onFrameChange(newIndex);
		}, [_count, currentImageIndex, onFrameChange, onPrevFrame]);

		const nextMove = useCallback(() => {
			onNextMove();
			return inverse ? prevFrame() : nextFrame();
		}, [inverse, nextFrame, onNextMove, prevFrame]);

		const prevMove = useCallback(() => {
			onPrevMove();
			return inverse ? nextFrame() : prevFrame();
		}, [inverse, nextFrame, onPrevMove, prevFrame]);

		const rotateViewerImage = useCallback(
			(e) => {
				const interval = e.touches ? touchDragInterval : dragInterval;
				const eventX = e.touches ? Math.round(e.touches[0].clientX) : e.clientX;
				const coord = eventX - _viewerImageRef.current.offsetLeft;
				let newMoveBufffer = moveBuffer;
				if (moveBuffer.length < 2) {
					newMoveBufffer = moveBuffer.concat(coord);
				} else {
					newMoveBufffer = [moveBuffer[1], coord];
				}
				setMoveBuffer(newMoveBufffer);
				const threshold = !(coord % interval);
				const oldMove = newMoveBufffer[0];
				const newMove = newMoveBufffer[1];
				if (threshold && newMove < oldMove) {
					nextMove();
				} else if (threshold && newMove > oldMove) {
					prevMove();
				}
			},
			[dragInterval, moveBuffer, nextMove, prevMove, touchDragInterval]
		);

		const resetMoveBuffer = () => setMoveBuffer([]);

		const startDragging = useCallback(() => {
			setIsDragging(true);
			onDragStart();
		}, [onDragStart]);

		const stopDragging = useCallback(() => {
			setIsDragging(false);
			onDragEnd();
		}, [onDragEnd]);

		const toggleAutoplay = useCallback(
			(state) => {
				setIsAutoPlayRunning(state);
				return state ? onAutoplayStart() : onAutoplayStop();
			},
			[onAutoplayStart, onAutoplayStop]
		);

		const toggleRecording = (state, existingSessionId) => {
			setIsRecording(state);
			const sessionId = recordingSessionId || existingSessionId || TridiUtils.uid();
			if (state) {
				if (!recordingSessionId) {
					setRecordingSessionId(sessionId);
				}
				onRecordStart(sessionId);
			} else {
				setRecordingSessionId(null);
				onRecordStop(sessionId);
			}
		};

		// handlers
		const imageViewerMouseDownHandler = (e) => {
			if (_draggable) {
				if (e.preventDefault) e.preventDefault();
				startDragging();
				rotateViewerImage(e);
			}
			if (isMoveing) {
				const clientX = e.clientX;
				const clientY = e.clientY;
				setMoveingMouseDownPoint({
					x: clientX - viewerImageOfset.x,
					y: clientY - viewerImageOfset.y
				});
			}
			if (isAutoPlayRunning && stopAutoplayOnClick) {
				toggleAutoplay(false);
			}
		};

		const imageViewerMouseUpHandler = (e) => {
			if (_draggable) {
				if (e.preventDefault) e.preventDefault();
				stopDragging();
				resetMoveBuffer();
			}
			if (moveingMouseDownPoint) {
				setMoveingMouseDownPoint(null);
			}
		};

		const imageViewerMouseMoveHandler = (e) => {
			if (isDragging && isMoveing && moveingMouseDownPoint) {
				const clientX = e.clientX;
				const clientY = e.clientY;
				setViewerImageOfset({
					x: clientX - moveingMouseDownPoint.x,
					y: clientY - moveingMouseDownPoint.y
				});
				return;
			}
			if (_draggable && isDragging) {
				rotateViewerImage(e);
			}
		};

		const imageViewerMouseLeaveHandler = () => {
			if (_draggable) resetMoveBuffer();
			if (!isAutoPlayRunning && resumeAutoplayOnMouseLeave) {
				toggleAutoplay(true);
			}
			if (mouseleaveDetect) {
				stopDragging();
				resetMoveBuffer();
			}
		};

		const imageViewerMouseEnterHandler = () => {
			if (isAutoPlayRunning && stopAutoplayOnMouseEnter) {
				toggleAutoplay(false);
			}
		};

		const imageViewerWheelHandler = useCallback(
			(e) => {
				if (mousewheel) {
					if (e.preventDefault) e.preventDefault();
					e.deltaY / 120 > 0 ? nextMove() : prevMove();
				}
			},
			[mousewheel, nextMove, prevMove]
		);

		const imageViewerTouchStartHandler = useCallback(
			(e) => {
				if (touch) {
					if (e.preventDefault) e.preventDefault();
					startDragging();
					rotateViewerImage(e);
				}

				if (isAutoPlayRunning && stopAutoplayOnClick) {
					toggleAutoplay(false);
				}
			},
			[
				isAutoPlayRunning,
				rotateViewerImage,
				startDragging,
				stopAutoplayOnClick,
				toggleAutoplay,
				touch
			]
		);

		const imageViewerTouchMoveHandler = useCallback(
			(e) => {
				if (touch) {
					if (e.preventDefault) e.preventDefault();
					rotateViewerImage(e);
				}
			},
			[rotateViewerImage, touch]
		);

		const imageViewerTouchEndHandler = useCallback(
			(e) => {
				if (touch) {
					stopDragging();
					resetMoveBuffer();
				}

				if (!isAutoPlayRunning && resumeAutoplayOnMouseLeave) {
					toggleAutoplay(true);
				}
			},
			[isAutoPlayRunning, resumeAutoplayOnMouseLeave, stopDragging, toggleAutoplay, touch]
		);

		const imageViewerClickHandler = (e) => {
			if (isRecording) {
				const viewerWidth = _viewerImageRef.current.clientWidth;
				const viewerHeight = _viewerImageRef.current.clientHeight;
				const clientX =
					(e.clientX - viewerImageOfset.x - (viewerWidth - viewerWidth * zoom) / 2) /
					zoom;
				const clientY =
					(e.clientY - viewerImageOfset.y - (viewerHeight - viewerHeight * zoom) / 2) /
					zoom;
				const viewerOffsetLeft = _viewerImageRef.current.getBoundingClientRect().left;
				const viewerOffsetTop = _viewerImageRef.current.getBoundingClientRect().top;

				const x = ((clientX - viewerOffsetLeft) / viewerWidth).toFixed(6);
				const y = ((clientY - viewerOffsetTop) / viewerHeight).toFixed(6);
				const pin = {
					id: TridiUtils.uid(),
					frameId: currentImageIndex,
					x,
					y,
					recordingSessionId
				};
				const newPins = pins.concat(pin);
				setPins(newPins);
			}
		};

		const pinDoubleClickHandler = (pin) => {
			if (isRecording) {
				const newPins = pins.filter((item) => item.id !== pin.id);
				setPins(newPins);
			}
		};

		const pinClickHandler = (pin) => {
			if (!isRecording) {
				onPinClick(pin);
			}
		};

		// effects
		useEffect(() => {
			const viewerRef = _viewerImageRef.current;
			viewerRef.addEventListener('touchstart', imageViewerTouchStartHandler, {
				passive: false
			});
			viewerRef.addEventListener('touchmove', imageViewerTouchMoveHandler, {
				passive: false
			});
			viewerRef.addEventListener('touchend', imageViewerTouchEndHandler, {
				passive: false
			});
			viewerRef.addEventListener('wheel', imageViewerWheelHandler, {
				passive: false
			});

			return () => {
				viewerRef.removeEventListener('touchstart', imageViewerTouchStartHandler);
				viewerRef.removeEventListener('touchmove', imageViewerTouchMoveHandler);
				viewerRef.removeEventListener('touchend', imageViewerTouchEndHandler);
				viewerRef.removeEventListener('wheel', imageViewerWheelHandler);
			};
		}, [
			imageViewerTouchEndHandler,
			imageViewerTouchMoveHandler,
			imageViewerTouchStartHandler,
			imageViewerWheelHandler
		]);

		useEffect(() => {
			if (autoplay) {
				toggleAutoplay(autoplay);
			}
		}, [autoplay, toggleAutoplay]);

		useInterval(
			() => {
				nextMove();
			},
			isAutoPlayRunning ? autoplaySpeed : null
		);

		useImperativeHandle(ref, () => ({
			toggleRecording: (state, recordingSessionId) =>
				toggleRecording(state, recordingSessionId),
			toggleAutoplay: (state) => toggleAutoplay(state),
			next: () => nextMove(),
			prev: () => prevMove()
		}));

		useTridiKeyPressHandler({ nextMove, prevMove });

		// render component helpers
		const renderImages = () =>
			_images.map((src, index) => (
				<img
					key={index}
					src={src}
					className={`${styles['tridi-viewer-image']} ${
						currentImageIndex === index
							? styles['tridi-viewer-image-shown']
							: styles['tridi-viewer-image-hidden']
					}`}
					alt=""
				/>
			));

		const renderHintOverlay = () => (
			<div
				className={`${styles['tridi-hint-overlay']}`}
				onClick={hideHint}
				onTouchStart={hideHint}
			>
				{!renderHint && (
					<Fragment>
						<DragIcon />
						{hintText && (
							<span className={`${styles['tridi-hint-text']}`}>{hintText}</span>
						)}
					</Fragment>
				)}
				{renderHint && renderHint()}
			</div>
		);

		const generateViewerClassName = () => {
			let classNameStr = styles['tridi-viewer'];
			if (_draggable) classNameStr += ' ' + styles['tridi-draggable-true'];
			if (isRecording) classNameStr += ' ' + styles['tridi-recording-true'];
			if (touch) classNameStr += ' ' + styles['tridi-touch-true'];
			if (mousewheel) classNameStr += ' ' + styles['tridi-mousewheel-true'];
			if (hintOnStartup) classNameStr += ' ' + styles['tridi-hintOnStartup-true'];
			if (className) classNameStr += ' ' + className;
			return classNameStr;
		};

		if (!TridiUtils.isValidProps({ images, format, location })) return null;

		return (
			<div className={generateViewerClassName()}>
				{hintVisible && renderHintOverlay()}
				<div
					ref={_viewerImageRef}
					onMouseDown={imageViewerMouseDownHandler}
					onMouseUp={imageViewerMouseUpHandler}
					onMouseMove={imageViewerMouseMoveHandler}
					onMouseLeave={imageViewerMouseLeaveHandler}
					onMouseEnter={imageViewerMouseEnterHandler}
					onClick={imageViewerClickHandler}
					style={{
						width: '100%'
					}}
				>
					<div
						style={{
							width: '100%',
							transform: `scale(${zoom}, ${zoom}) translate(${
								viewerImageOfset.x / zoom
							}px, ${viewerImageOfset.y / zoom}px)`
						}}
					>
						{_images?.length > 0 && renderImages()}
						<Pins
							pins={pins}
							viewerWidth={_viewerImageRef?.current?.clientWidth}
							viewerHeight={_viewerImageRef?.current?.clientHeight}
							currentFrameId={currentImageIndex}
							pinWidth={pinWidth}
							pinHeight={pinHeight}
							onPinDoubleClick={pinDoubleClickHandler}
							onPinClick={pinClickHandler}
							renderPin={renderPin}
						/>
					</div>
				</div>

				{showStatusBar && (
					<StatusBar isRecording={isRecording} currentImageIndex={currentImageIndex} />
				)}
				{showControlBar && (
					<ControlBar
						isPlaying={isPlaying}
						isRecording={isRecording}
						isMoveing={isMoveing}
						setIsPlaying={setIsPlaying}
						setIsRecording={setIsRecording}
						setIsMoveing={setIsMoveing}
						onStartMoveing={() => {
							toggleRecording(false);
							setIsMoveing(true);
						}}
						onStopMoveing={() => {
							setIsMoveing(false);
						}}
						onPlay={() => toggleAutoplay(true)}
						onPause={() => toggleAutoplay(false)}
						onNext={() => nextMove()}
						onPrev={() => prevMove()}
						onRecordStart={() => {
							toggleRecording(true);
							setIsMoveing(false);
						}}
						onRecordStop={() => toggleRecording(false)}
						onZoomout={() => {
							const newZoom = Math.max(minZoom, zoom - 0.1);
							setZoom(newZoom);
							onZoom(newZoom);
						}}
						onZoomin={() => {
							const newZoom = Math.min(maxZoom, zoom + 0.1);
							setZoom(newZoom);
							onZoom(newZoom);
						}}
					/>
				)}
			</div>
		);
	}
);

Tridi.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	images: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	pins: PropTypes.array,
	pinWidth: PropTypes.number,
	pinHeight: PropTypes.number,
	format: PropTypes.string,
	location: PropTypes.string,
	count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	draggable: PropTypes.bool,
	hintOnStartup: PropTypes.bool,
	hintText: PropTypes.string,
	autoplay: PropTypes.bool,
	autoplaySpeed: PropTypes.number,
	stopAutoplayOnClick: PropTypes.bool,
	stopAutoplayOnMouseEnter: PropTypes.bool,
	resumeAutoplayOnMouseLeave: PropTypes.bool,
	touch: PropTypes.bool,
	mousewheel: PropTypes.bool,
	inverse: PropTypes.bool,
	dragInterval: PropTypes.number,
	touchDragInterval: PropTypes.number,
	mouseleaveDetect: PropTypes.bool,
	showControlBar: PropTypes.bool,
	showStatusBar: PropTypes.bool,

	renderPin: PropTypes.func,
	setPins: PropTypes.func,
	renderHint: PropTypes.func,

	onHintHide: PropTypes.func,
	onAutoplayStart: PropTypes.func,
	onAutoplayStop: PropTypes.func,
	onNextMove: PropTypes.func,
	onPrevMove: PropTypes.func,
	onNextFrame: PropTypes.func,
	onPrevFrame: PropTypes.func,
	onDragStart: PropTypes.func,
	onDragEnd: PropTypes.func,
	onFrameChange: PropTypes.func,
	onRecordStart: PropTypes.func,
	onRecordStop: PropTypes.func,
	onPinClick: PropTypes.func
};

Tridi.defaultProps = {
	className: undefined,
	style: undefined,
	images: 'numbered',
	pin: undefined,
	pinWidth: 10,
	pinHeight: 10,
	format: undefined,
	location: './images',
	count: undefined,
	draggable: true,
	hintOnStartup: false,
	hintText: null,
	autoplay: false,
	autoplaySpeed: 50,
	stopAutoplayOnClick: false,
	stopAutoplayOnMouseEnter: false,
	resumeAutoplayOnMouseLeave: false,
	touch: true,
	mousewheel: false,
	inverse: false,
	dragInterval: 1,
	touchDragInterval: 2,
	mouseleaveDetect: false,
	showControlBar: false,
	showStatusBar: false,

	renderPin: undefined,
	setPins: () => {},
	renderHint: undefined,
	maxZoom: 3,
	minZoom: 0.3,
	onHintHide: () => {},
	onAutoplayStart: () => {},
	onAutoplayStop: () => {},
	onNextMove: () => {},
	onPrevMove: () => {},
	onNextFrame: () => {},
	onPrevFrame: () => {},
	onDragStart: () => {},
	onDragEnd: () => {},
	onFrameChange: () => {},
	onRecordStart: () => {},
	onRecordStop: () => {},
	onPinClick: () => {},
	onZoom: () => {}
};

export default Tridi;
