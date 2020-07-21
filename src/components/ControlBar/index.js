import React, { useState } from 'react';
import styles from './styles.module.css';
import TargetIcon from '../../assets/icons/target.svg';
import StopIcon from '../../assets/icons/stop.svg';
import NextIcon from '../../assets/icons/next.svg';
import PrevIcon from '../../assets/icons/previous.svg';
import PauseIcon from '../../assets/icons/pause.svg';
import PlayIcon from '../../assets/icons/play.svg';

const ControlBar = ({ onPlay, onPause, onNext, onPrev, onRecordStart, onRecordStop }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isRecording, setIsRecording] = useState(false);

	const playHandler = () => {
		setIsPlaying(true);
		onPlay();
	};

	const pauseHandler = () => {
		setIsPlaying(false);
		onPause();
	};

	const recordStartHandler = () => {
		setIsRecording(true);
		onRecordStart();
	};

	const recordStopHandler = () => {
		setIsRecording(false);
		onRecordStop();
	};

	return (
		<div
			className={`tridi-control-bar ${styles['tridi-control-bar']}`}
			onClick={(e) => e.stopPropagation()}
		>
			{!isRecording && (
				<a className={`${styles['tridi-control-button']}`} onClick={recordStartHandler}>
					<TargetIcon />
				</a>
			)}
			{isRecording && (
				<a className={`${styles['tridi-control-button']}`} onClick={recordStopHandler}>
					<StopIcon />
				</a>
			)}
			{!isPlaying && (
				<a className={`${styles['tridi-control-button']}`} onClick={playHandler}>
					<PlayIcon />
				</a>
			)}
			{isPlaying && (
				<a className={`${styles['tridi-control-button']}`} onClick={pauseHandler}>
					<PauseIcon />
				</a>
			)}
			<a className={`${styles['tridi-control-button']}`} onClick={onPrev}>
				<PrevIcon />
			</a>
			<a className={`${styles['tridi-control-button']}`} onClick={onNext}>
				<NextIcon />
			</a>
		</div>
	);
};

export default ControlBar;
