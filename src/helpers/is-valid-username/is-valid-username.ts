export const isValidUsername = (username: string): boolean => {
    if(username.length < 3) return false;

    if(username.length >= 4 && username.substring(username.length - 4) === "_gal") return false;

    return true;
}