export interface UserSchema{
    name: String;
    username: String;
    email: String;
    providerId: String;
    image: String;
    notificationToken?: Array<String>;
}