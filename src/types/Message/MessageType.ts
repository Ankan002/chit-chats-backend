interface MessageUserType{
    _id: string;
    __v: number;
    name: string;
    username: string;
    image: string;
    email: string;
    tagline: string;
    updatedAt: string;
    createdAt: string;
}

interface MessageSenderType{
    _id: string;
    username: string;
    image: string;
    name: string;
}

interface MessageChatType{
    _id: string;
    isGroupChat: boolean;
    chatName: string;
    groupAdmin: MessageUserType;
    groupImage: string;
    latestMessage: string;
    users: Array<MessageUserType>;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

export interface MessageType{
    _id: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
    sender: MessageSenderType;
    content: string;
    chat: MessageChatType;
    media?: string;
    replyingTo?: string;
}