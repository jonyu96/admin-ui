import { User } from "./user.model";

export class Log {
    error: string;
    username: string;
    url: string;
    type: "UI_ERROR" | "SERVER_ERROR";

    constructor(input: any) {
        Object.assign(this, input);
    }
}