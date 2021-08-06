import {createSelector} from "reselect";
import {IStore, IAction} from './interfaces'
import {ThunkAction} from "redux-thunk"
import {AnyAction} from "redux"
// import axios from 'axios'

export const moduleName: string = 'chat'

export const SET_USERNAME = `${moduleName}/SET_USERNAME`

export interface IChatUser {
    // roomId: number,
    username: string,
}

export interface IReducerRecord {
    // usersList: IChatUser[],
    // roomIds: number[],
    usersNamesList: string[]
}

export const reducerRecord: IReducerRecord = {
    // usersList: [],
    usersNamesList: [],
    // roomIds: []
}

export default function reducer(state = reducerRecord, action: IAction) {
    const {type, payload} = action
    switch (type) {
        case SET_USERNAME:
            return Object.assign({}, state, {usersNamesList: payload})
        default: return state
    }
}

export const stateSelector = (state: IStore<IReducerRecord>) => state[moduleName]
// export const usersListSelector = createSelector(stateSelector, state => state.usersList)
export const usersNamesSelector = createSelector(stateSelector, state => state.usersNamesList)

export const setUserName = (name: string): ThunkAction<void, IStore<IReducerRecord>, unknown, AnyAction> => async (dispatch, getState): Promise<void> => {
    const usersNamesList = usersNamesSelector(getState()) // getState()[moduleName].usersList    
    const doesNameExist = usersNamesList.includes(name)

    console.log(usersNamesList)

    if (doesNameExist) {
        alert('Such Username already exists, please try another name')
    } else {
        dispatch({
            type: SET_USERNAME,
            payload: [...usersNamesList, name]
        })
    }
    // const config: any = {
    //     method: 'post',
    //     url: 'http://localhost:8000/projects/',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data : dataToSend
    // }

    
    // await dispatch({
        // type: SEND NAME TO SERVER,
        // payload: data
    // })
}