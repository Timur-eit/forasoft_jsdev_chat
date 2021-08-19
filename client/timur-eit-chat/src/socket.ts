import io from 'socket.io-client';

const socket = io('http://localhost:9999/');

interface ISocketActions {
    [actionName: string]: string
}

export const socketActions: ISocketActions = {
    ROOM_JOIN: 'ROOM_JOIN',
    ROOM_NEW_MESSAGE: 'ROOM_NEW_MESSAGE',
    ROOM_SET_USERS: 'ROOM_SET_USERS',
    SERVER_ROOM_ERROR: 'SERVER_ROOM_ERROR',
    disconnect: 'disconnect',
    connect_error: 'connect_error',
    SERVER_CONNECTION_ERROR: 'SERVER_CONNECTION_ERROR'
}

export default socket;