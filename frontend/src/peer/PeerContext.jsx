import React, {
	createContext,
	useEffect,
	useRef,
	useState,
	useCallback,
} from "react";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const PeerContext = createContext(null);
export default PeerContext;

export function PeerProvider({ children }) {
	const [peerId, setPeerId] = useState(null);
	const [remoteStreams, setRemoteStreams] = useState([]); // {peerId, stream}
	const [status, setStatus] = useState("init");
	const [error, setError] = useState(null);
	const peerRef = useRef(null);
	const localStreamRef = useRef(null);
	const connectionsRef = useRef(new Map()); // peerId -> call

	// Remote stream management first so handlers can reference them
	const addRemoteStream = useCallback((pid, stream) => {
		setRemoteStreams((prev) => {
			if (prev.some((s) => s.peerId === pid))
				return prev.map((s) =>
					s.peerId === pid ? { ...s, stream } : s
				);
			return [...prev, { peerId: pid, stream }];
		});
	}, []);

	const removeRemoteStream = useCallback((pid) => {
		setRemoteStreams((prev) => prev.filter((s) => s.peerId !== pid));
	}, []);

	// Initialize peer
	const registerCallHandlers = useCallback(
		(call) => {
			const pid = call.peer;
			connectionsRef.current.set(pid, call);
			call.on("stream", (remoteStream) => {
				addRemoteStream(pid, remoteStream);
			});
			call.on("close", () => {
				removeRemoteStream(pid);
				connectionsRef.current.delete(pid);
			});
			call.on("error", (err) => {
				console.error("Call error", err);
			});
		},
		[addRemoteStream, removeRemoteStream]
	);

	useEffect(() => {
		const id = uuidv4();
		const peer = new Peer(id, {
			debug: 2,
		});
		peerRef.current = peer;
		setStatus("connecting");

		peer.on("open", (id) => {
			setPeerId(id);
			setStatus("ready");
		});

		peer.on("error", (err) => {
			console.error("Peer error", err);
			setError(err.message);
			setStatus("error");
		});

		peer.on("call", async (call) => {
			try {
				if (!localStreamRef.current) {
					const stream = await navigator.mediaDevices.getUserMedia({
						video: true,
						audio: true,
					});
					localStreamRef.current = stream;
				}
				call.answer(localStreamRef.current);
				registerCallHandlers(call);
			} catch (e) {
				console.error("Error answering call", e);
			}
		});

		return () => {
			peer.destroy();
			localStreamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, [registerCallHandlers]);

	// registerCallHandlers defined above

	const getLocalStream = useCallback(async () => {
		if (!localStreamRef.current) {
			localStreamRef.current = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
		}
		return localStreamRef.current;
	}, []);

	const callPeer = useCallback(
		async (targetPeerId) => {
			if (!peerRef.current || !targetPeerId || targetPeerId === peerId)
				return;
			try {
				const stream = await getLocalStream();
				const call = peerRef.current.call(targetPeerId, stream);
				registerCallHandlers(call);
			} catch (e) {
				console.error("Call failed", e);
				setError(e.message);
			}
		},
		[getLocalStream, peerId, registerCallHandlers]
	);

	const toggleTrack = useCallback((kind) => {
		const stream = localStreamRef.current;
		if (!stream) return;
		stream
			.getTracks()
			.filter((t) => t.kind === kind)
			.forEach((t) => {
				t.enabled = !t.enabled;
			});
	}, []);

	const replaceVideoTrack = useCallback((newTrack) => {
		// Replace outgoing video tracks in each connection
		connectionsRef.current.forEach((call) => {
			const sender = call.peerConnection
				.getSenders()
				.find((s) => s.track && s.track.kind === "video");
			if (sender) sender.replaceTrack(newTrack);
		});
	}, []);

	const startScreenShare = useCallback(async () => {
		try {
			const screenStream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
			});
			const screenTrack = screenStream.getVideoTracks()[0];
			replaceVideoTrack(screenTrack);
			screenTrack.onended = async () => {
				// revert to camera
				const stream = await getLocalStream();
				const camTrack = stream.getVideoTracks()[0];
				replaceVideoTrack(camTrack);
			};
		} catch (e) {
			console.error("Screen share error", e);
		}
	}, [getLocalStream, replaceVideoTrack]);

	const value = {
		peerId,
		status,
		error,
		localStreamRef,
		remoteStreams,
		callPeer,
		getLocalStream,
		toggleTrack,
		startScreenShare,
	};

	return (
		<PeerContext.Provider value={value}>{children}</PeerContext.Provider>
	);
}
