"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const socket = (io) => {
    io.on("connection", (socket) => {
        console.log("connected to socket io");
        socket.on("setup", (user) => {
            socket.join(user._id);
            console.log("connected to:", user._id);
            socket.emit("connected");
        });
        socket.on("join-chat", (room) => {
            socket.join(room);
            console.log("Room joined:", room);
        });
        socket.on("new-message", (messageReceived) => {
            const chat = messageReceived.chat;
            if (!chat.users || chat.users.length < 2)
                return console.log("No users are there");
            chat.users.forEach((user) => {
                if (user._id === messageReceived.sender._id)
                    return;
                socket.in(user._id).emit("message-received", messageReceived);
            });
        });
    });
};
exports.socket = socket;
