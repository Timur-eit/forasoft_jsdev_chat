import React from 'react';
import axios from 'axios';
import socket from "socket";
import {useParams, useHistory} from 'react-router-dom';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import UsersList from 'shared/ui/UsersList';
import Messages from 'shared/ui/Messages';
import {IUserData} from 'shared/interfaces';
import './style.scss';

import {getInviteLink} from 'shared/utils'

interface IChatRoomProps {
  users: string[],
  messages: Array<{userName: string, text: string, date: Date}>,
  userName: string | null,
  roomId: number | null,
  onAddMessage: any,
  onLogin: (obj: IUserData) => Promise<void>,
}

const ChatRoom: React.FC<IChatRoomProps> = ({users, messages, userName, roomId, onAddMessage, onLogin}) => {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef<HTMLDivElement>(null);
  interface IParams {
    chat_id: string | undefined
  }

  const params: IParams = useParams();
  const history = useHistory();  

  React.useEffect( () => {
      if (!userName) {
        axios.get(`http://localhost:9999/rooms/${params.chat_id}`)
          .then((_data) => {
            let userName: string = '';
            let roomId: string | undefined = params.chat_id;

            (function getUserName() {
              const promptName = window.prompt('Please enter user name - max 10 symbols');
              if (promptName && promptName.length < 10) {
                userName = promptName;
              } else {
                getUserName();
              }
            })()

            const obj: IUserData = {userName, roomId};
            onLogin(obj);
          })
          .catch((_err) => {
            alert('This room doesn\'t exist, please create the rooom');
            history.push('/');
          })
        }
  }, [params, userName, onLogin, history]);

  const onSendMessage = () => {
    socket.emit('ROOM_NEW_MESSAGE', {
      userName,
      roomId,
      text: messageValue,

    });
    onAddMessage({
      userName,
      text: messageValue,
      date: new Date(),
    });
    // add user's message to his self front
    setMessageValue('');
  }

  React.useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo(0, 999);
    }
  }, [messages])  

  return (
    <div className='chat-container'>
      <h2>Room ID: <span>{roomId}</span></h2>      

      <button onClick={() => getInviteLink()}>Get invite link</button>

      <div className='chat-body'>
        <div className='chat-body__user-lisr'>
          <UsersList users={users}/>
        </div>
        <div className='chat-body__messages'>
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
      </div>
    </div>
  )
}

export default ChatRoom;