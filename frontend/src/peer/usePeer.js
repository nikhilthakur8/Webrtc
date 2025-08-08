import { useContext } from "react";
import PeerContext from "./PeerContext.jsx";
export function usePeer() {
	return useContext(PeerContext);
}
export default usePeer;
