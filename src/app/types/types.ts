export type Channel = {
    username: string;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
    followers: string[];
    following: string[];
};
