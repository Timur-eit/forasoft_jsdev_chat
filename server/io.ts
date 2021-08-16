import rooms from './model'

// 'ROOM_JOIN'
const onRoomJoin = (socket, {roomId, userName}) => {
    try {
        socket.join(roomId);
        // connect socket to exact room
        rooms.get(roomId).get('users').set(socket.id, userName);
        const users: Array<string> = [...rooms.get(roomId).get('users').values()];
        socket.broadcast.to(roomId).emit('ROOM_SET_USERS', users) // передача ответа всем users комнаты
    } catch (err) {
        console.log(err);
        socket.broadcast.to(roomId).emit('SERVER_ROOM_ERROR', err.message);
    }
}

// 'ROOM_NEW_MESSAGE'
const onNewMessage = (socket, {roomId, userName, text }) => {
    interface userMessage {
        userName: string,
        text: string,
        date: Date
    }
    const date = new Date();
    const obj: userMessage = { userName, text, date };
    rooms.get(roomId).get('messages').push(obj);
    socket.broadcast.to(roomId).emit('ROOM_NEW_MESSAGE', obj);
}

// 'disconnect'
const onDisconnect = (socket) => {
    rooms.forEach((value, roomId) => {
        if (value.get('users').delete(socket.id)) { // delete returns boolean
            const users: Array<string> = [...rooms.get(roomId).get('users').values()];
            socket.broadcast.to(roomId).emit('ROOM_SET_USERS', users);
        }
    })
}


    // socket.on('connect_error', (err) => {
    //     console.log(`connect_error due to ${err.message}`);
    //     socket.emit('SERVER_CONNECTION_ERROR', err.message);
    // });

interface IioActions {
    [action: string]: (socket: any, data?: object) => void
}

const ioActions: IioActions = {
    ROOM_JOIN: onRoomJoin,
    ROOM_NEW_MESSAGE: onNewMessage,
    disconnect: onDisconnect,
}

export default ioActions;
