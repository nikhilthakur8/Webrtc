import React, { useEffect, useRef, useState } from "react";
import { usePeer } from "../peer/usePeer";
import VideoTile from "./VideoTile";
import Controls from "./Controls";

export default function Room() {
	const { peerId, status, error, remoteStreams, getLocalStream, callPeer } = usePeer();
	const [targetId, setTargetId] = useState("");
	const [initLocal, setInitLocal] = useState(false);
	const localVideoRef = useRef(null);

	useEffect(() => {
		if (!initLocal) return;
		(async () => {
			const stream = await getLocalStream();
			if (localVideoRef.current) localVideoRef.current.srcObject = stream;
		})();
	}, [initLocal, getLocalStream]);

	const handleStart = async () => {
		setInitLocal(true);
	};

	const handleCall = () => {
		if (targetId) callPeer(targetId.trim());
	};

	return (
		<div className="flex flex-col gap-4 max-w-7xl mx-auto p-4">
			<div className="flex flex-wrap items-center gap-4 bg-neutral-800/40 border border-neutral-700 rounded p-3">
				<div className="text-sm text-neutral-300">
					Your ID:{" "}
					<span className="font-mono text-white select-all">
						{peerId || "..."}
					</span>
				</div>
				<div className="text-sm text-neutral-400">
					Status: <span className="text-white">{status}</span>
				</div>
				{error && (
					<div className="text-sm text-red-400">Error: {error}</div>
				)}
			</div>

			{!initLocal && (
				<div className="flex justify-center">
					<button
						onClick={handleStart}
						className="px-6 py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
					>
						Enable Camera & Mic
					</button>
				</div>
			)}

			{initLocal && (
				<div className="grid md:grid-cols-2 gap-4">
					<div className="relative bg-black rounded overflow-hidden aspect-video">
						<video
							ref={localVideoRef}
							autoPlay
							muted
							playsInline
							className="w-full h-full object-cover"
						/>
						<div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
							You ({peerId})
						</div>
					</div>
					{remoteStreams.map(({ peerId: pid, stream }) => (
						<VideoTile key={pid} stream={stream} label={pid} />
					))}
				</div>
			)}

			<div className="bg-neutral-800/40 border border-neutral-700 rounded p-4 flex flex-col gap-3">
				<div className="flex gap-2 flex-wrap items-center">
					<input
						type="text"
						className="flex-1 min-w-64 px-3 py-2 rounded bg-neutral-900 border border-neutral-700 text-sm outline-none focus:ring-2 focus:ring-emerald-600 text-white"
						placeholder="Enter peer ID to call"
						value={targetId}
						onChange={(e) => setTargetId(e.target.value)}
					/>
				</div>
				<Controls onCall={handleCall} />
				<p className="text-xs text-neutral-400">
					Share your ID with another user. One user pastes the other's
					ID and presses Call. Accept occurs automatically when call
					arrives.
				</p>
			</div>
		</div>
	);
}
