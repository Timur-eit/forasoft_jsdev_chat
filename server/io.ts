import rooms from './model';
import { actions } from './constants';
import socket from 'socket.io';

type ioAction = (
    socket: socket.Socket,
    roomId?: string,
    userName?: string,
    text?: string,
    err?: { message: string }
) => void;

const onRoomJoin: ioAction = (socket, roomId, userName) => {
    // 'ROOM_JOIN'
    try {
        socket.join(roomId);
        // connect socket to exact room
        rooms.get(roomId).get('users').set(socket.id, userName);
        const users: Array<string> = [...rooms.get(roomId).get('users').values()];
        socket.broadcast.to(roomId).emit(actions.ROOM_SET_USERS, users); // передача ответа всем users комнаты
    } catch (err) {
        console.log(err);
        socket.broadcast.to(roomId).emit(actions.SERVER_ROOM_ERROR, err.message);
    }
};

const onNewMessage: ioAction = (socket, roomId, userName, text) => {
    // 'ROOM_NEW_MESSAGE'
    interface userMessage {
        userName: string;
        text: string;
        date: Date;
    }
    const date = new Date();
    const obj: userMessage = { userName, text, date };
    rooms.get(roomId).get('messages').push(obj);
    socket.broadcast.to(roomId).emit(actions.ROOM_NEW_MESSAGE, obj);
};

const onDisconnect: ioAction = (socket) => {
    // 'disconnect'
    rooms.forEach((value, roomId) => {
        if (value.get('users').delete(socket.id)) {
            // delete returns boolean
            const users: Array<string> = [...rooms.get(roomId).get('users').values()];
            socket.broadcast.to(roomId).emit(actions.ROOM_SET_USERS, users);
        }
    });
};

const onConnectError: ioAction = (
    // 'connect_error'
    socket,
    _roomId,
    _userName,
    _text,
    err
) => {
    console.log(`connect_error due to ${err.message}`);
    socket.emit('SERVER_CONNECTION_ERROR', err.message);
};

interface IioActions {
    [actionName: string]: ioAction;
}

const ioActions: IioActions = {
    ROOM_JOIN: onRoomJoin,
    ROOM_NEW_MESSAGE: onNewMessage,
    disconnect: onDisconnect,
    connectError: onConnectError,
};

export default ioActions;
