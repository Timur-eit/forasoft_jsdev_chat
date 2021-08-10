import React, {useEffect} from "react"
import axios from 'axios'
import socket from "../../socket"
import {useParams, useHistory} from 'react-router-dom'

import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Button from "@material-ui/core/Button"

import UsersList from 'shared/ui/UsersList'
import Messages from 'shared/ui/Messages'

import {IUserData} from '../../shared/interfaces'

import './style.scss'

interface IChatRoomProps {
  users: string[],
  messages: Array<{userName: string, text: string}>,
  userName: string | null,
  roomId: number | null,
  onAddMessage: any,
  onLogin: (obj: IUserData) => Promise<void>,
}

const ChatRoom: React.FC<IChatRoomProps> = ({users, messages, userName, roomId, onAddMessage, onLogin}) => {
  const [messageValue, setMessageValue] = React.useState('')
  const messagesRef = React.useRef(null)

  interface IParams {
    chat_id: string | undefined
  }

  const params: IParams = useParams()
  const history = useHistory()

  useEffect( () => {
      if (!userName) {
        axios.get(`http://localhost:9999/rooms/${params.chat_id}`)
          .then((_data) => {
            const userName: string | null = window.prompt('Please enter user name')
            const obj: any = {userName, roomId: params.chat_id}
            onLogin(obj)
          })
          .catch((_err) => {            
            alert('This room doesn`s exist, please create the rooom')
            history.push('/')
          })
        }
  }, [params, userName, onLogin, history])

  const onSendMessage = () => {
    socket.emit('ROOM_NEW_MESSAGE', {
      userName,
      roomId,
      text: messageValue,

    })
    onAddMessage({
      userName,
      text: messageValue,
    })
    // имитация добавления сообщения (своего), как-будто от сервера
    setMessageValue('')
    // window.scrollTo(0, document.body.scrollHeight);
  }

  // React.useEffect(() => {
  //   messagesRef.current.scrollTo(0, 999999)
  // }, [messages])

  return (
    <div className='chat-container'>
      <h2>Room ID: <span>{roomId}</span></h2>
      <UsersList users={users}/>

      <div ref={messagesRef} className='chat-messages'>
        <Messages messages={messages} />
      </div>

      <div className='users-input'>
        <form>
          <TextareaAutosize
            aria-label="new message"
            placeholder="enter message"
            value={messageValue}
            minRows={3}
            onChange={(e) => setMessageValue(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={() => onSendMessage()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatRoom