import express from 'express';
import socket from 'socket.io';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { port } from './constants';
import {actions} from './constants';
import ioActions from './io';
import router from './routes';

const app: express.Application = express(); // create express application
const server: http.Server = http.createServer(app); // create server and connect server to application
const io: socket.Server = new Server(server, {
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

app.use(cors(corsOptions));
app.use(express.json()); // чтобы в body отображались post data в виде json

app.use('/rooms', router)

io.on('connection', socket => { // socket - data of each socket user    
    socket.on(actions.ROOM_JOIN, ({roomId, userName}) => ioActions.ROOM_JOIN(socket, roomId, userName));
    socket.on(actions.ROOM_NEW_MESSAGE, ({roomId, userName, text}) => {
        ioActions.ROOM_NEW_MESSAGE(socket, roomId, userName, text)
    });
    socket.on('disconnect', () => ioActions.disconnect(socket));
    socket.on('connect_error', (err) => ioActions.connectError(socket, err));
});
// socket setup

server.listen(port, () => console.log('Server started on ' + port)).on("error", (err: string) => {
    if (err) {
        throw Error(err);
    }
});