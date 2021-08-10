import express from 'express'
import socket from 'socket.io'
import cors from 'cors'
import {v1} from 'uuid'

import http from 'http'
import { Server } from 'socket.io'
import { port } from './constants'
import * as ts from 'typescript'

const app: express.Application = express()
// create express application
const server: http.Server = http.createServer(app)
// create server and connect server to application
const io: socket.Server = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
})
// connect socket to app with cors configs

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json()) // чтобы в body отображались post data в виде json


const rooms: ts.ESMap<string, any> = new Map()
// collection as database

app.get('/rooms/:roomId', (req, res) => {
    const { roomId } = req.params
    interface roomData {
        users: string[],
        messages: string[],
    }

    const obj: roomData = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
    } : { users: [], messages: [] }

    if(!obj.users.length) {
        res.status(400).send('room doesn`t exist')
    } else {
        res.json(obj)
    }
    // get list off all users
})


app.post('/rooms', (_req, res) => {
    const roomId: string = v1()
    const userCollection: ts.ESMap<string, ts.ESMap<string, string>> = new Map()
    const roomCollection: ts.ESMap<string, object> = new Map()

    roomCollection.set('users', userCollection)
    roomCollection.set('messages', [])

    if (!rooms.has(roomId)) {
        rooms.set(roomId, roomCollection)
    }
    res.send(roomId)
})

io.on('connection', socket => {
    // socket - data of each socket user
    socket.on('ROOM_JOIN', ( {roomId, userName} ) => {
        try {
            socket.join(roomId)
            // connect socket to exact room
            rooms.get(roomId).get('users').set(socket.id, userName)
            const users: Array<string> = [...rooms.get(roomId).get('users').values()]
            socket.broadcast.to(roomId).emit('ROOM_SET_USERS', users) // передача ответа всем users комнаты
        } catch (err) {
            console.log(err)
            socket.broadcast.to(roomId).emit('SERVER_ROOM_ERROR', err.message)
        }
    })

    socket.on('ROOM_NEW_MESSAGE', ( {roomId, userName, text } ) => {
        interface userMessage {
            userName: string,
            text: string,
            date: Date
        }
        const date = new Date()
        const obj: userMessage = { userName, text, date }
        rooms.get(roomId).get('messages').push(obj)
        socket.broadcast.to(roomId).emit('ROOM_NEW_MESSAGE', obj)
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) { // delete returns boolean
                const users: Array<string> = [...rooms.get(roomId).get('users').values()]
                socket.broadcast.to(roomId).emit('ROOM_SET_USERS', users)
            }
        })
    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
        socket.emit('SERVER_CONNECTION_ERROR', err.message)
    });

})
// socket setup

server.listen(port, () => console.log('Server started on ' + port)).on("error", (err: string) => {
    if (err) {
        throw Error(err)
    }
})

