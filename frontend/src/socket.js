import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
	autoConnect: false,
	withCredentials: true,
});

let unloadCleanupRegistered = false;

const disconnectSocket = () => {
	if (socket.connected) {
		socket.disconnect();
	}
};

const registerUnloadCleanup = () => {
	if (unloadCleanupRegistered) {
		return;
	}

	unloadCleanupRegistered = true;
	window.addEventListener('pagehide', disconnectSocket);
	window.addEventListener('beforeunload', disconnectSocket);
};

export const syncSocketAuth = (token) => {
	if (!token) {
		socket.auth = {};

		disconnectSocket();

		return;
	}

	const nextAuth = { token };
	const currentToken = socket.auth?.token;

	socket.auth = nextAuth;

	if (!socket.connected) {
		socket.connect();
		registerUnloadCleanup();
		return;
	}

	if (currentToken !== token) {
		socket.disconnect().connect();
		registerUnloadCleanup();
	}
};

socket.on('connect', () => {
  
});

export default socket;