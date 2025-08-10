/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";

export const Home = () => {
	const peerRef = useRef(null);
	const localStreamRef = useRef(null);
	const remoteStreamRef = useRef(null);
	const [peerId, setPeerId] = useState("");
	const [remotePeerId, setRemotePeerId] = useState("");

	async function getLocalStream() {
		try {
			return await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
		} catch (error) {
			console.error("Error accessing media devices:", error);
			throw error;
		}
	}

	useEffect(() => {
		// Initialize peer with default configuration
		const peer = new Peer();

		peer.on("open", (id) => {
			console.log("My peer ID:", id);
			setPeerId(id);
		});

		peer.on("error", (error) => {
			console.error("PeerJS error:", error);
		});

		peerRef.current = peer;

		// Setup local stream
		(async () => {
			try {
				const stream = await getLocalStream();
				if (localStreamRef.current) {
					localStreamRef.current.srcObject = stream;
				}
			} catch (error) {
				console.error("Failed to get local stream", error);
			}
		})();

		// Handle incoming calls
		peer.on("call", async (call) => {
			try {
				const localStream =
					localStreamRef.current?.srcObject ||
					(await getLocalStream());
				call.answer(localStream);

				call.on("stream", (remoteStream) => {
					if (remoteStreamRef.current) {
						remoteStreamRef.current.srcObject = remoteStream;
					}
				});

				call.on("close", () => {
					console.log("Call ended");
					if (remoteStreamRef.current) {
						remoteStreamRef.current.srcObject = null;
					}
				});

				call.on("error", (error) => {
					console.error("Call error:", error);
				});
			} catch (error) {
				console.error("Error answering call:", error);
			}
		});

		return () => {
			if (peerRef.current) {
				peerRef.current.destroy();
			}
		};
	}, []);

	async function connectToPeer() {
		if (!remotePeerId.trim()) {
			alert("Please enter a peer ID");
			return;
		}

		try {
			const localStream =
				localStreamRef.current?.srcObject || (await getLocalStream());
			const call = peerRef.current.call(remotePeerId, localStream);

			call.on("stream", (remoteStream) => {
				if (remoteStreamRef.current) {
					remoteStreamRef.current.srcObject = remoteStream;
				}
			});

			call.on("close", () => {
				console.log("Call ended");
				if (remoteStreamRef.current) {
					remoteStreamRef.current.srcObject = null;
				}
			});

			call.on("error", (error) => {
				console.error("Call error:", error);
			});
		} catch (error) {
			console.error("Error connecting to peer:", error);
			alert("Failed to connect: " + error.message);
		}
	}

	return (
		<div className="flex h-screen">
			<div className="w-1/2 h-full flex flex-col border border-gray-900">
				<div className="h-1/2 bg-gray-800 p-2">
					<h3 className="text-white">Local Stream (You)</h3>
					<video
						ref={localStreamRef}
						className="w-full h-full object-cover"
						autoPlay
						playsInline
						muted
					/>
				</div>
				<div className="h-1/2 bg-gray-800 p-2">
					<h3 className="text-white">Remote Stream</h3>
					<video
						ref={remoteStreamRef}
						className="w-full h-full object-cover"
						autoPlay
						playsInline
					/>
				</div>
			</div>

			<div className="w-1/2 h-full border flex flex-col items-center justify-center border-gray-900 p-4">
				<div className="mb-4">
					<h3 className="text-lg font-bold">
						Your ID: {peerId || "Generating..."}
					</h3>
				</div>
				<div className="flex flex-col w-full max-w-xs">
					<input
						type="text"
						value={remotePeerId}
						onChange={(e) => setRemotePeerId(e.target.value)}
						placeholder="Enter peer ID to connect"
						className="p-2 border rounded mb-2"
					/>
					<button
						className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						onClick={connectToPeer}
					>
						Connect
					</button>
				</div>
			</div>
		</div>
	);
};
