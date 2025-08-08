import React, { useEffect, useRef } from "react";

export default function VideoTile({ stream, label, muted }) {
	const videoRef = useRef(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<div className="relative bg-black rounded overflow-hidden aspect-video">
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted={muted}
				className="w-full h-full object-cover"
			/>
			<div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
				{label}
			</div>
		</div>
	);
}
