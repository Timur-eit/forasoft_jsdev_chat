import {createSelector} from "reselect";

import {ThunkAction} from "redux-thunk";
import {AnyAction} from "redux";
import axios from 'axios'

import {IAction, IRoomData, IStore, IUserData, IMessage} from './interfaces';
import socket, {socketActions} from 'socket';

export const moduleName = 'chat'

export const JOINED = `${moduleName}/JOINED`
export const SET_USERS = `${moduleName}/SET_USERS`
export const NEW_MESSAGE = `${moduleName}/NEW_MESSAGE`

export interface IReducerRecord {
    // joined: boolean,
    roomId: null | number,
    userName: null | string,
    users: string[],
    messages: IMessage[],
}

export const reducerRecord: IReducerRecord = {
    // joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
};

export default function reducer(state = reducerRecord, action: IAction) {
    const {type, payload} = action

    switch (type) {
        case JOINED:
            return Object.assign({}, state, {
                // joined: payload.joined,
                userName: payload.userName,
                roomId: payload.roomId,
            })
        case SET_USERS:
            return Object.assign({}, state, {
                users: payload
            })
        case NEW_MESSAGE:
            return Object.assign({}, state, {
                messages: payload
            })
        default:
            return state
    }
}

export const stateSelector = (state: IStore<IReducerRecord>) => state[moduleName]
// export const joinedSelector = createSelector(stateSelector, state => state.joined)
export const roomIdSelector = createSelector(stateSelector, state => state.roomId)
export const userNameSelector = createSelector(stateSelector, state => state.userName)
export const usersSelector = createSelector(stateSelector, state => state.users)
export const messagesSelector = createSelector(stateSelector, state => state.messages)

export const setUsers = (users: string[]): ThunkAction<void, IStore<IReducerRecord>, unknown, AnyAction> => (dispatch): void => {
    dispatch({
        type: SET_USERS,
        payload: users
    })
}

export const onLogin = (obj: IUserData): ThunkAction<void, IStore<IReducerRecord>, unknown, AnyAction> => async (dispatch): Promise<void> => {
    dispatch({
        type: JOINED,
        // payload: {joined: true, userName: obj.userName, roomId: obj.roomId},
        payload: obj,
    })

    socket.emit(socketActions.ROOM_JOIN, obj)

    const serverResponse = await axios.get(`http://localhost:9999/rooms/${obj.roomId}`)
    const responseData: IRoomData = serverResponse.data
    if (!responseData.users.includes(obj.userName)) {
        responseData.users.push(obj.userName)
    }
    dispatch({
        type: SET_USERS,
        payload: responseData.users,
    })
}


export const addMessage = (
    message: IMessage
): ThunkAction<void, IStore<IReducerRecord>, unknown, AnyAction> => (dispatch, getState): void => {

    const messages = messagesSelector(getState());
    const roomId = roomIdSelector(getState());
    const userName = usersSelector(getState());

    socket.emit('ROOM_NEW_MESSAGE', {
        userName,
        roomId,
        text: message.text.trim(),
    });

    dispatch({
        type: NEW_MESSAGE,
        payload: [...messages, message]
    })
}


export const initialChat = (): ThunkAction<void, IStore<IReducerRecord>, unknown, AnyAction> => (dispatch, getState): void => {
    const messages = messagesSelector(getState()) || [];
    socket.on(socketActions.ROOM_SET_USERS, (users: string[]) => dispatch({
        type: SET_USERS,
        payload: users
    }))

    socket.on(socketActions.ROOM_NEW_MESSAGE, (message: Array<{ userName: string, text: string, date: Date }>) => {
        dispatch({
            type: NEW_MESSAGE,
            payload: [...messages, message]
        })
    })
}