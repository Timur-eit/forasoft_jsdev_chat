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
} from '../../ducks/chat'

export default connect((state: IStore<IReducerRecord>) => ({    
    roomI: roomIdSelector(state),
    userName: userNameSelector(state),
    users: usersSelector(state),
    messages: messagesSelector(state),
}), {
    setUsers,
    onLogin,
    addMessage,
})(ChatApp)