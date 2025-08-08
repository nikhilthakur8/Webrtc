import React, { useState } from "react";
import { usePeer } from "../peer/usePeer";

export default function Controls({ onCall }) {
	const { toggleTrack, startScreenShare } = usePeer();
	const [audioOn, setAudioOn] = useState(true);
	const [videoOn, setVideoOn] = useState(true);

	return (
		<div className="flex gap-3 items-center justify-center py-3">
			<button
				onClick={() => {
					toggleTrack("audio");
					setAudioOn((a) => !a);
				}}
				className={`px-4 py-2 rounded text-sm font-medium ${
					audioOn
						? "bg-emerald-600 hover:bg-emerald-500"
						: "bg-red-600 hover:bg-red-500"
				} text-white`}
			>
				{audioOn ? "Mute" : "Unmute"}
			</button>
			<button
				onClick={() => {
					toggleTrack("video");
					setVideoOn((v) => !v);
				}}
				className={`px-4 py-2 rounded text-sm font-medium ${
					videoOn
						? "bg-emerald-600 hover:bg-emerald-500"
						: "bg-red-600 hover:bg-red-500"
				} text-white`}
			>
				{videoOn ? "Video Off" : "Video On"}
			</button>
			<button
				onClick={startScreenShare}
				className="px-4 py-2 rounded text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white"
			>
				Share Screen
			</button>
			<button
				onClick={onCall}
				className="px-4 py-2 rounded text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white"
			>
				Call
			</button>
		</div>
	);
}
