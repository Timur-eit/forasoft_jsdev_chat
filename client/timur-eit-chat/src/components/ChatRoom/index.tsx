import React from 'react';
import axios from 'axios';
import socket from "socket";
import {useHistory, useParams} from 'react-router-dom';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import UsersList from 'shared/ui/UsersList';
import Messages from 'shared/ui/Messages';
import {IUserData} from 'shared/interfaces';
import GetInviteButton from 'shared/ui/GetInvite'
import {messageValid} from 'shared/utils'
import './style.scss';

const MESSAGE_ERROR = 'Value must not be empty'

interface IChatRoomProps {
    users: string[],
    messages: Array<{ userName: string, text: string, date: Date }>,
    userName: string | null,
    roomId: number | null,
    onAddMessage: any,
    onLogin: (obj: IUserData) => Promise<void>,
}

const ChatRoom: React.FC<IChatRoomProps> = (props) => {
    const {
        users,
        messages,
        userName,
        roomId,
        onAddMessage,
        onLogin
    } = props;

    const [messageValue, setMessageValue] = React.useState('');
    const [messageError, setMessageError] = React.useState<string | null>(MESSAGE_ERROR);
    const [touched, setTouched] = React.useState<boolean>(false);
    console.log('ROOM')
    const messagesRef = React.useRef<HTMLDivElement>(null);

    interface IParams {
        chat_id: string | undefined
    }

    const params: IParams = useParams();
    const history = useHistory();

    React.useEffect(() => {
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
        onAddMessage({
            userName,
            text: messageValue.trim(),
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

//   console.log(messages)

    return (
        <div className='chat-container'>
            <h2>Room ID: <span>{roomId}</span></h2>

            <div className='chat-body'>
                <div className='chat-body__user-lisr'>
                    <GetInviteButton/>
                    <UsersList users={users}/>
                </div>

                <div className='chat-body__messages'>
                    <div ref={messagesRef} className='chat-messages'>
                        <Messages messages={messages}/>
                    </div>
                    <div className='users-input'>
                        <form>
                            {messageError && touched && <div>{messageError}</div>}
                            <TextareaAutosize
                                aria-label="new message"
                                placeholder="enter message"
                                value={messageValue}
                                minRows={3}
                                onChange={(e) => {
                                    setMessageError(messageValid(e.target.value));
                                    setMessageValue(e.target.value);
                                }
                                }
                            />
                            <Button disabled={messageError && touched ? true : false} variant="contained"
                                    color="primary" onClick={() => {
                                !touched && setTouched(true)
                                if (!messageError) {
                                    onSendMessage();
                                    setMessageValue('');
                                    setTouched(false);
                                    setMessageError(MESSAGE_ERROR);
                                }
                            }}>
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