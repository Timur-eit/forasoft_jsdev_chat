import * as express from 'express';
import { type } from 'os';
import * as ts from 'typescript';
import rooms, {RoomCollectionType} from './model';
import {v1} from 'uuid';

const router = express.Router();

router.get('/:roomId', (req, res) => {
    const { roomId } = req.params;
    interface roomData {
        users: string[],
        messages: string[],
    }

    const obj: roomData = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
    } : { users: [], messages: [] };

    if(!obj.users.length) {
        res.status(400).send('room doesn`t exist');
    } else {
        res.json(obj);
    }
    // get list off all users
});


router.post('/', (_req, res) => {
    const roomId: string = v1();
    const userCollection: RoomCollectionType = new Map();
    const roomCollection: RoomCollectionType = new Map();

    roomCollection.set('users', userCollection);
    roomCollection.set('messages', []);

    if (!rooms.has(roomId)) {
        rooms.set(roomId, roomCollection);
    }
    res.send(roomId);
});

export default router