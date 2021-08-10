import React from 'react'
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

export const reducer: React.Reducer<IReducerRecord, React.ReducerAction<any>> = (state, action: any) => {
  switch (action.type) {
    case 'JOINED':
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomId,
      }
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      }
    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }  
      default:
        return state
  }
};
  