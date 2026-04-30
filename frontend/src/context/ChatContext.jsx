import React, { createContext, useEffect, useState } from "react";
import socket from "../socket";

export const ChatContext = createContext({
	onlineUsers: [],
});

const ChatProvider = ({ children }) => {
	const [onlineUsers, setOnlineUsers] = useState([]);
	const currentUserId = localStorage.getItem("userId");

	useEffect(() => {
		const handleOnlineUsers = (userIds) => {
			setOnlineUsers(Array.isArray(userIds) ? userIds : []);
		};

		const identifyCurrentUser = () => {
			if (currentUserId) {
				socket.emit("identifyUser", currentUserId);
			}
		};

		socket.on("onlineUsers", handleOnlineUsers);
		socket.on("connect", identifyCurrentUser);

		if (socket.connected) {
			identifyCurrentUser();
		}

		return () => {
			socket.off("onlineUsers", handleOnlineUsers);
			socket.off("connect", identifyCurrentUser);
		};
	}, [currentUserId]);

	return (
		<ChatContext.Provider value={{ onlineUsers }}>
			{children}
		</ChatContext.Provider>
	);
};

export default ChatProvider;
