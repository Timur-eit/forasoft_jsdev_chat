import {connect} from 'react-redux'
import ChatApp from './ChatApp'
import {IStore} from '../../ducks/interfaces'

import {
    IReducerRecord,    
    roomIdSelector,
    userNameSelector,
    usersSelector,
    messagesSelector,
    setUsers,
    onLogin,
    addMessage,
    initialChat,
} from '../../ducks/chat'

export default connect((state: IStore<IReducerRecord>) => ({
    roomId: roomIdSelector(state),
    userName: userNameSelector(state),
    users: usersSelector(state),
    messages: messagesSelector(state),
}), {
    setUsers,
    initialChat,
    onLogin,
    addMessage,
})(ChatApp)