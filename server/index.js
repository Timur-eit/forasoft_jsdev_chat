"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const constants_1 = require("./constants");
const app = express_1.default();
// create express application
const server = http_1.default.createServer(app);
// create server and connect server to application
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
// connect socket to app with cors configs
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors_1.default(corsOptions));
app.use(express_1.default.json()); // чтобы в body отображались post data в виде json
const rooms = new Map();
// collection as database
app.get('/rooms/:roomId', (req, res) => {
    const { roomId } = req.params;
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
    } : { users: [], messages: [] };
    if (!obj.users.length) {
        res.status(400).send('room doesn`t exist');
    }
    else {
        res.json(obj);
    }
    // get list off all users
});
app.post('/rooms', (_req, res) => {
    const roomId = uuid_1.v1();
    const userCollection = new Map();
    const roomCollection = new Map();
    roomCollection.set('users', userCollection);
    roomCollection.set('messages', []);
    if (!rooms.has(roomId)) {
        rooms.set(roomId, roomCollection);
    }
    res.send(roomId);
});
io.on('connection', socket => {
    // socket - data of each socket user
    socket.on('ROOM_JOIN', ({ roomId, userName }) => {
        try {
            socket.join(roomId);
            // connect socket to exact room
            rooms.get(roomId).get('users').set(socket.id, userName);
            const users = [...rooms.get(roomId).get('users').values()];
            socket.broadcast.to(roomId).emit('ROOM_SET_USERS', users); // передача ответа всем users комнаты
        }
        catch (err) {
            console.log(err);
            socket.broadcast.to(roomId).emit('SERVER_ROOM_ERROR', err.message);
        }
    });
    socket.on('ROOM_NEW_MESSAGE', ({ roomId, userName, text }) => {
        const date = new Date();
        const obj = { userName, text, date };
        rooms.get(roomId).get('messages').push(obj);
        socket.broadcast.to(roomId).emit('ROOM_NEW_MESSAGE', obj);
    });
    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) { // delete returns boolean
                const users = [...rooms.get(roomId).get('users').values()];
                socket.broadcast.to(roomId).emit('ROOM_SET_USERS', users);
            }
        });
    });
    socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`);
        socket.emit('SERVER_CONNECTION_ERROR', err.message);
    });
});
// socket setup
server.listen(constants_1.port, () => console.log('Server started on ' + constants_1.port)).on("error", (err) => {
    if (err) {
        throw Error(err);
    }
});
//# sourceMappingURL=index.js.map