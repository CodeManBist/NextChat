import React, { createContext, useEffect, useState } from "react";
import socket, { syncSocketAuth } from "../socket";

export const ChatContext = createContext({
	onlineUsers: [],
});

const ChatProvider = ({ children }) => {
	const [onlineUsers, setOnlineUsers] = useState([]);

	useEffect(() => {
		const handleOnlineUsers = (userIds) => {
			setOnlineUsers(Array.isArray(userIds) ? userIds : []);
		};

		const handleAuthChange = () => {
			syncSocketAuth(localStorage.getItem("token"));
		};

		socket.on("onlineUsers", handleOnlineUsers);
		window.addEventListener("auth-changed", handleAuthChange);
		handleAuthChange();

		return () => {
			socket.off("onlineUsers", handleOnlineUsers);
			window.removeEventListener("auth-changed", handleAuthChange);
		};
	}, []);

	return (
		<ChatContext.Provider value={{ onlineUsers }}>
			{children}
		</ChatContext.Provider>
	);
};

export default ChatProvider;
