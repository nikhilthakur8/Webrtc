import React from "react";
import { PeerProvider } from "./peer/PeerContext";
import Room from "./components/Room";
import "./index.css";

export default function App() {
	return (
		<PeerProvider>
			<div className="min-h-screen bg-neutral-900 text-white font-sans">
				<header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
					<h1 className="text-lg font-semibold tracking-tight">
						PeerJS Video Call
					</h1>
					<a
						href="https://peerjs.com"
						target="_blank"
						rel="noreferrer"
						className="text-xs text-neutral-400 hover:text-white"
					>
						PeerJS Docs
					</a>
				</header>
				<main className="py-6">
					<Room />
				</main>
				<footer className="text-center text-xs text-neutral-500 py-4">
					Demo built with React, PeerJS & Tailwind
				</footer>
			</div>
		</PeerProvider>
	);
}
