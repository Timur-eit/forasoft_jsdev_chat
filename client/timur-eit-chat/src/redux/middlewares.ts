import {moduleName as chatModule, NEW_MESSAGE} from '../ducks/chat'
import { Middleware } from "redux"
import {IStore} from '../ducks/interfaces'
import {IReducerRecord} from "../ducks/chat";

export const persistMessages:Middleware<{}, IStore<IReducerRecord>> = (storeApi) => next => (action) => {
    if(action.type === NEW_MESSAGE) {
        const {roomId} = storeApi.getState()[chatModule] || 'empty room'
        window.localStorage.setItem(roomId, action.payload)
    }

    return next(action)
}