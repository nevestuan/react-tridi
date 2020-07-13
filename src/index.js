import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';

import useInterval from './useInterval';

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
}

const Tridi = forwardRef(
	(
		{
			className,
			style,
			images,
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
			onHintHide,
			onAutoplayStart,
			onAutoplayStop,
			onNextMove,
			onPrevMove,
			onNextFrame,
			onPrevFrame,
			onDragStart,
			onDragEnd,
			onFrameChange
		},
		ref
	) => {
		if (!TridiUtils.isValidProps({ images, format, location })) return null;
		const [moveBuffer, setMoveBuffer] = useState([]);
		const [hintVisible, setHintVisible] = useState(hintOnStartup);
		const [currentImageIndex, setCurrentImageIndex] = useState(0);
		const [isDragging, setIsDragging] = useState(false);
		const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);

		const _count = Array.isArray(images) ? images.length : Number(count);
		const _images = TridiUtils.normalizedImages(images, format, location, _count);
		const _viewerImageRef = useRef(null);

		const hideHint = () => {
			setHintVisible(false);
			onHintHide();
		};

		const nextFrame = () => {
			const newIndex = currentImageIndex >= _count - 1 ? 0 : currentImageIndex + 1;
			setCurrentImageIndex(newIndex);
			onNextFrame();
			onFrameChange(newIndex);
		};

		const prevFrame = () => {
			const newIndex = currentImageIndex <= 0 ? _count - 1 : currentImageIndex - 1;
			setCurrentImageIndex(newIndex);
			onPrevFrame();
			onFrameChange(newIndex);
		};

		const nextMove = () => {
			onNextMove();
			return inverse ? prevFrame() : nextFrame();
		};

		const prevMove = () => {
			onPrevMove();
			return inverse ? nextFrame() : prevFrame();
		};

		const rotateViewerImage = (e) => {
			const interval = e.touches ? touchDragInterval : dragInterval;
			const eventX = e.touches ? e.touches[0].clientX : e.clientX;
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
		};

		const resetMoveBuffer = () => setMoveBuffer([]);

		const startDragging = () => {
			setIsDragging(true);
			onDragStart();
		};

		const stopDragging = () => {
			setIsDragging(false);
			onDragEnd();
		};

		const toggleAutoplay = (state) => {
			setIsAutoPlayRunning(state);
			return state ? onAutoplayStart() : onAutoplayStop();
		};

		// handlers
		const imageViewerMouseDownHandler = (e) => {
			if (draggable) {
				if (e.preventDefault) e.preventDefault();
				startDragging();
				rotateViewerImage(e);
			}

			if (isAutoPlayRunning && stopAutoplayOnClick) {
				toggleAutoplay(false);
			}
		};

		const imageViewerMouseUpHandler = (e) => {
			if (draggable) {
				if (e.preventDefault) e.preventDefault();
				stopDragging();
				resetMoveBuffer();
			}
		};

		const imageViewerMouseMoveHandler = (e) => {
			if (draggable && isDragging) {
				rotateViewerImage(e);
			}
		};

		const imageViewerMouseLeaveHandler = () => {
			if (draggable) resetMoveBuffer();
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

		const imageViewerWheelHandler = (e) => {
			if (mousewheel) {
				if (e.preventDefault) e.preventDefault();
				e.deltaY / 120 > 0 ? nextMove() : prevMove();
			}
		};

		const imageViewerTouchStartHandler = (e) => {
			if (touch) {
				if (e.preventDefault) e.preventDefault();
				startDragging();
				rotateViewerImage(e);
			}

			if (isAutoPlayRunning && stopAutoplayOnClick) {
				toggleAutoplay(false);
			}
		};

		const imageViewerTouchMoveHandler = (e) => {
			if (touch) {
				if (e.preventDefault) e.preventDefault();
				rotateViewerImage(e);
			}
		};

		const imageViewerTouchEndHandler = (e) => {
			if (touch) {
				stopDragging();
				resetMoveBuffer();
			}

			if (!isAutoPlayRunning && resumeAutoplayOnMouseLeave) {
				toggleAutoplay(true);
			}
		};

		useEffect(() => {
			if (autoplay) {
				toggleAutoplay(autoplay);
			}
		}, [autoplay]);

		useInterval(
			() => {
				nextMove();
			},
			isAutoPlayRunning ? autoplaySpeed : null
		);

		useImperativeHandle(ref, () => ({
			toggleAutoplay: (state) => toggleAutoplay(state),
			next: () => nextMove(),
			prev: () => prevMove()
		}));

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

		const renderHint = () => (
			<div
				className={`${styles['tridi-hint-overlay']}`}
				onClick={hideHint}
				onTouchStart={hideHint}
			>
				<div className={`${styles['tridi-hint']}`}>
					{hintText && <span className={`${styles['tridi-hint-text']}`}>{hintText}</span>}
				</div>
			</div>
		);

		const generateViewerClassName = () => {
			let classNameStr = styles['tridi-viewer'];
			if (draggable) classNameStr += ' ' + styles['tridi-draggable-true'];
			if (touch) classNameStr += ' ' + styles['tridi-touch-true'];
			if (mousewheel) classNameStr += ' ' + styles['tridi-mousewheel-true'];
			if (hintOnStartup) classNameStr += ' ' + styles['tridi-hintOnStartup-true'];
			if (className) classNameStr += ' ' + className;
			return classNameStr;
		};

		return (
			<div
				className={generateViewerClassName()}
				ref={_viewerImageRef}
				onMouseDown={imageViewerMouseDownHandler}
				onMouseUp={imageViewerMouseUpHandler}
				onMouseMove={imageViewerMouseMoveHandler}
				onMouseLeave={imageViewerMouseLeaveHandler}
				onMouseEnter={imageViewerMouseEnterHandler}
				onWheel={imageViewerWheelHandler}
				onTouchStart={imageViewerTouchStartHandler}
				onTouchMove={imageViewerTouchMoveHandler}
				onTouchEnd={imageViewerTouchEndHandler}
			>
				{hintVisible && renderHint()}
				{_images?.length > 0 && renderImages()}
			</div>
		);
	}
);

Tridi.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	images: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
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

	onHintHide: PropTypes.func,
	onAutoplayStart: PropTypes.func,
	onAutoplayStop: PropTypes.func,
	onNextMove: PropTypes.func,
	onPrevMove: PropTypes.func,
	onNextFrame: PropTypes.func,
	onPrevFrame: PropTypes.func,
	onDragStart: PropTypes.func,
	onDragEnd: PropTypes.func,
	onFrameChange: PropTypes.func
};

Tridi.defaultProps = {
	className: undefined,
	style: undefined,
	images: 'numbered',
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

	onHintHide: () => {},
	onAutoplayStart: () => {},
	onAutoplayStop: () => {},
	onNextMove: () => {},
	onPrevMove: () => {},
	onNextFrame: () => {},
	onPrevFrame: () => {},
	onDragStart: () => {},
	onDragEnd: () => {},
	onFrameChange: () => {}
};

export default Tridi;
