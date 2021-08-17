"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const model_1 = __importDefault(require("./model"));
const uuid_1 = require("uuid");
const router = express.Router();
router.get('/:roomId', (req, res) => {
    const { roomId } = req.params;
    const obj = model_1.default.has(roomId) ? {
        users: [...model_1.default.get(roomId).get('users').values()],
        messages: [...model_1.default.get(roomId).get('messages').values()],
    } : { users: [], messages: [] };
    if (!obj.users.length) {
        res.status(400).send('room doesn`t exist');
    }
    else {
        res.json(obj);
    }
    // get list off all users
});
router.post('/', (_req, res) => {
    const roomId = uuid_1.v1();
    const userCollection = new Map();
    const roomCollection = new Map();
    roomCollection.set('users', userCollection);
    roomCollection.set('messages', []);
    if (!model_1.default.has(roomId)) {
        model_1.default.set(roomId, roomCollection);
    }
    res.send(roomId);
});
exports.default = router;
//# sourceMappingURL=routes.js.map