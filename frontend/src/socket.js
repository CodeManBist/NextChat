import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
	autoConnect: false,
	withCredentials: true,
});

export const syncSocketAuth = (token) => {
	if (!token) {
		socket.auth = {};

		if (socket.connected) {
			socket.disconnect();
		}

		return;
	}

	const nextAuth = { token };
	const currentToken = socket.auth?.token;

	socket.auth = nextAuth;

	if (!socket.connected) {
		socket.connect();
		return;
	}

	if (currentToken !== token) {
		socket.disconnect().connect();
	}
};

socket.on('connect', () => {
  
});

export default socket;