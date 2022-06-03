export interface UserType{
    __v: number;
    _id: string;
    createdAt: string;
    email: string;
    image: string;
    name: string;
    notification?: Array<string | null>;
    pinnedChats?: Array<any>;
    providerId: string;
    updatedAt: string;
    username: string;
    tagline: string;
}