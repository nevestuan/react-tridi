import React from 'react';
import styles from './styles.module.css';

const StatusBar = ({ isRecording, currentImageIndex }) => (
	<div className={`tridi-status-bar ${styles['tridi-status-bar']}`}>
		<div className="status-info">
			<span className="info-label">Frame Id: </span>
			<span className="info-value">{currentImageIndex}</span>
		</div>
		{isRecording && (
			<div className="status-info">
				<span className="info-label">Recording...</span>
			</div>
		)}
	</div>
);

export default StatusBar;
