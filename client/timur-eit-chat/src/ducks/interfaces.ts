export interface IStore<R> {
    [projectModule: string]: R
}

export interface IAction {
    type: string,
    payload?: any
}