import * as ts from 'typescript';

export type RoomCollectionType = ts.ESMap<string, any>;
const rooms: RoomCollectionType = new Map();

export default rooms;

