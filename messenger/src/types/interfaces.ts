export type MessageData = {
    sender: string;
    time: string;
    payload: string;
    isError?: boolean;
    type: "rec" | "sen";
};

export interface User {
    id: string;
    username: string;
}