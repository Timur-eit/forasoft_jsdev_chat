export interface IStore<R> {
    [projectModule: string]: R
}

export interface IAction {
    type: string,
    payload?: any
}

export interface IUserData {
    userName: string,
    roomId?: string,
}

export interface IRoomData {
    users: string[],
    messages: Array<{ userName: string, text: string }>,
}

export interface IMessage {
    userName: string,
    text: string,
    date: Date
}