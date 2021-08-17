import {createSelector} from "reselect";
import {IStore, IAction} from './interfaces'
import {deleteItemFromList, modifyListObject} from '../utils'
import {ThunkAction} from "redux-thunk";
import {AnyAction} from "redux";
import axios from 'axios'
import qs from 'qs';

export const moduleName = 'chat'

export const JOINED = `${moduleName}/JOINED`
export const SET_USERS = `${moduleName}/SET_USERS`
export const NEW_MESSAGE = `${moduleName}/NEW_MESSAGE`

export interface IProject {
    readonly id?: number,
    name: string,
    code: string
}

interface IReducerRecord {
    joined: boolean,
    roomId: null | number,
    userName: null | string,
    users: string[],
    messages: Array<{userName: string, text: string, date: Date}>,
}

export const reducerRecord: IReducerRecord = {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
};

export default function reducer(state = reducerRecord, action: IAction) {
    const {type, payload} = action

    switch (type) {        
        case JOINED:
            return Object.assign({}, state, {
                joined: payload,
                userName: payload,
                roomId: payload,
            })
        case SET_USERS:
            return Object.assign({}, state, {
                users: payload
            })
        case NEW_MESSAGE:
            return Object.assign({}, state, {
                messages: payload
            })
        default: return state
    }
}

export const stateSelector = (state: IStore<IReducerRecord>) => state[moduleName]
export const projectListSelector = createSelector(stateSelector, state => state.projectList)
export const errorSelector = createSelector(stateSelector, state => state.error)
export const isLoaderSelector = createSelector(stateSelector, state => state.isLoader)

export const fetchProjectList = (): ThunkAction<void, IStore<IReducerRecord>, unknown, AnyAction> => async (dispatch): Promise<void> => {

    await dispatch({
        type: SET_LOADER,
        payload: true
    })

    try{
        const { data } : {data: IProject[] } = await axios.get('http://localhost:8000/projects')
        await dispatch({
            type: GET_PROJECT_LIST,
            payload: data
        })
    } catch(err) {
        await dispatch({
            type: CATCH_ERROR,
            payload: err.message
        })
    } finally {
        await dispatch({
            type: SET_LOADER,
            payload: false
        })
    }
}

export const addProjectList = (newProject: IProject): ThunkAction<void, IStore<IReducerRecord>, unknown, AnyAction> => async (dispatch, getState) => {
    const projectList = projectListSelector(getState()) // getState()[moduleName].projectList
    const dataToSend = newProject
    const config: any = {
        method: 'post',
        url: 'http://localhost:8000/projects/',
        headers: {
            'Content-Type': 'application/json'
        },
        data : dataToSend
    }

    try{
        const {data} = await axios(config)
        dispatch({
            type: ADD_NEW_PROJECT,
            payload: [...projectList, ...data]
        })
    } catch(err){
        const error = err?.response?.data
        await dispatch({
            type: CATCH_ERROR,
            payload: error
        })
    }


}

export const updateProjectList = (projectData: IProject): ThunkAction<void, IStore<IReducerRecord>, unknown, AnyAction> => async (dispatch, getState) => {
    const projectList = projectListSelector(getState()) // getState()[moduleName].projectList
    const dataToSend = qs.stringify(projectData)
    const config: any = {
        method: 'put',
        url: 'http://localhost:8000/projects',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : dataToSend
    }
    const {data}: {data : IProject[]} = await axios(config)
    dispatch({
        type: UPDATE_PROJECT,
        payload: modifyListObject(projectList, data[0])
    })
}

export const removeProjectList = (projectId: number): ThunkAction<void, IStore<IReducerRecord>, unknown, AnyAction> => async (dispatch, getState) => {
    const projectList = projectListSelector(getState()) // getState()[moduleName].projectList
    const config: any = {
        method: 'delete',
        url: 'http://localhost:8000/projects',
        headers: {
            'Content-Type': 'application/json'
        },
        data : {id: projectId}
    }
    axios(config)
        .then(function (_response) {
            const newProjectList = deleteItemFromList<IProject>(projectList, projectId)
            dispatch({
                type: REMOVE_PROJECT,
                payload: newProjectList
            })
        })
        .catch(function (error) {
            console.log(error)
        })
}