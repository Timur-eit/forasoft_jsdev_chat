"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("./model"));
const constants_1 = require("./constants");
// 'ROOM_JOIN'
const onRoomJoin = (socket, roomId, userName) => {
    try {
        socket.join(roomId);
        // connect socket to exact room
        model_1.default.get(roomId).get('users').set(socket.id, userName);
        const users = [...model_1.default.get(roomId).get('users').values()];
        socket.broadcast.to(roomId).emit(constants_1.actions.ROOM_SET_USERS, users); // передача ответа всем users комнаты
    }
    catch (err) {
        console.log(err);
        socket.broadcast.to(roomId).emit(constants_1.actions.SERVER_ROOM_ERROR, err.message);
    }
};
// 'ROOM_NEW_MESSAGE'
const onNewMessage = (socket, roomId, userName, text) => {
    const date = new Date();
    const obj = { userName, text, date };
    model_1.default.get(roomId).get('messages').push(obj);
    socket.broadcast.to(roomId).emit(constants_1.actions.ROOM_NEW_MESSAGE, obj);
};
// 'disconnect'
const onDisconnect = (socket) => {
    model_1.default.forEach((value, roomId) => {
        if (value.get('users').delete(socket.id)) { // delete returns boolean
            const users = [...model_1.default.get(roomId).get('users').values()];
            socket.broadcast.to(roomId).emit(constants_1.actions.ROOM_SET_USERS, users);
        }
    });
};
// 'connect_error'
const onConnectError = (socket, _roomId, _userName, _text, err) => {
    console.log(`connect_error due to ${err.message}`);
    socket.emit('SERVER_CONNECTION_ERROR', err.message);
};
const ioActions = {
    ROOM_JOIN: onRoomJoin,
    ROOM_NEW_MESSAGE: onNewMessage,
    disconnect: onDisconnect,
    connectError: onConnectError,
};
exports.default = ioActions;
//# sourceMappingURL=io.js.map