import React from 'react'
import socket from './socket'
import axios from 'axios'
import {Switch, Route} from 'react-router-dom'
import { reducer, reducerRecord } from 'reducer'
import GreetingBlock from 'components/GreetingBlock'
import ChatRoom from 'components/ChatRoom'
import {IUserData} from 'shared/interfaces'

import 'App.scss'

interface IAppProps {
  [property: string]: any
}

interface roomData {
  users: string[],
  messages: [{userName: string, text: string}],
}


const App: React.FC<IAppProps> = () => {
  const [state, dispatch] = React.useReducer(reducer, reducerRecord)

  const onLogin = async (obj: IUserData) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    })

    socket.emit('ROOM_JOIN', obj)

    const response = await axios.get(`http://localhost:9999/rooms/${obj.roomId}`)
    const data: roomData = response.data
    if (!data.users.includes(obj.userName)) {
      data.users.push(obj.userName)
    }

    setUsers(data.users)
  }

  const setUsers = (users: string[]) => {
    dispatch({
      type: 'SET_USERS',
      payload: users
    })
  }

  const addMessage = (message: string[]) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message
    })
  }

  React.useEffect(() => {
    socket.on('ROOM_SET_USERS', (users: string[]) => setUsers(users))
    socket.on('ROOM_NEW_MESSAGE', (message: string[]) => addMessage(message))
  }, [])

  return (
    <div className="App">      
      <Switch>
        <Route exact path="/">
          <GreetingBlock onLogin={onLogin} />
        </Route>
        <Route path="/:chat_id">
          <ChatRoom
            onLogin={onLogin}
            users={state.users}
            messages={state.messages}
            userName={state.userName}
            roomId={state.roomId}
            onAddMessage={addMessage}
          />
        </Route>
      </Switch>
    </div>
  )
}

export default App