"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const constants_1 = require("./constants");
const constants_2 = require("./constants");
const io_1 = __importDefault(require("./io"));
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default(); // create express application
const server = http_1.default.createServer(app); // create server and connect server to application
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
app.use('/rooms', routes_1.default);
io.on('connection', socket => {
    socket.on(constants_2.actions.ROOM_JOIN, ({ roomId, userName }) => io_1.default.ROOM_JOIN(socket, roomId, userName));
    socket.on(constants_2.actions.ROOM_NEW_MESSAGE, ({ roomId, userName, text }) => {
        io_1.default.ROOM_NEW_MESSAGE(socket, roomId, userName, text);
    });
    socket.on('disconnect', () => io_1.default.disconnect(socket));
    socket.on('connect_error', (err) => io_1.default.connectError(socket, err));
});
// socket setup
server.listen(constants_1.port, () => console.log('Server started on ' + constants_1.port)).on("error", (err) => {
    if (err) {
        throw Error(err);
    }
});
//# sourceMappingURL=index.js.map