export class CustomError extends Error {
    msg: string;

    constructor(msg, ...params) {
        super(...params);

        this.name = 'CustomError';
        this.msg = msg;
        
    }
}