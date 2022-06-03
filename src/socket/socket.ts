import { Socket } from "socket.io";
import { UserType } from "../types/User";
import { MessageType } from "../types/Message";

export const socket = (io: any) => {
    io.on("connection", (socket: Socket) => {
        console.log("connected to socket io");

        socket.on("setup", (user: UserType) => {
            socket.join(user._id);
            console.log("connected to:", user._id )
            socket.emit("connected"); 
        });

        socket.on("join-chat", (room: string) => {
            socket.join(room);
            console.log("Room joined:", room);
        });

        socket.on("new-message", (messageReceived: MessageType) => {
            const chat = messageReceived.chat;

            if(!chat.users || chat.users.length < 2) return console.log("No users are there");

            chat.users.forEach((user) => {
                if(user._id === messageReceived.sender._id) return;

                socket.in(user._id).emit("message-received", messageReceived);
            })
        })
    });
};